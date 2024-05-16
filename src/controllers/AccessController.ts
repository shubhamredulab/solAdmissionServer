import { NextFunction, Request, Response } from 'express';
import { AccessServices } from '../services/AccessService';
import logger from '../utils/winston';
import { allowAccess, getAccess, degreeStatus, columnAccess, saveCollegeAndCourse, deleteCourse } from '../validator/access';
import UserServices from '../services/UserServices';
// import MeritListServices from '../services/MeritlistService';
import CollegeCourseServices from '../services/CollegeCourseServices';
import CollegeServices from '../services/CollegeServices';
import { ActivityServices } from '../services/ActivityService';

interface College {
    id: number;
    college_code_admission: string;
    college_name_admission: string;
    college_logo_admission: any
    university_code_admission:number;
    college_type:string;
    city:string;
    state:string;
    collegeStatus:string
    createdAt:Date
    updatedAt:Date
    
}
export default class AccessController {
    /**
     * @author Moin
     * @router /api/access/getAccessUsersData
     * @description This function is used to provide access to menu data.
     */

    public static getAccessUsersData = async (req: Request, res: Response, next: NextFunction) => {

        try {
            await getAccess.validateAsync(req.query);
            const { role, userId, page } = req.query;
            const OFFSET_LIMIT = 10;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
            let dataCount: any[] = [];
            let Data;

            let tabs: string[] = [];
            if (role == 'SUPER_ADMIN') {
                if (!page == null) {
                    dataCount = await AccessServices.getAccessData();
                    Data = await AccessServices.getAccessDataWithPagination(OFFSET_LIMIT, offsetValue);

                } else {
                    Data = await AccessServices.getAccessData();
                }
                const valuesToRemove = ['admissionprocess', 'extradocuments', 'payments', 'phdAdmissionProcess'];
                const filteredTabs = Data.filter((tab: { tabName: string; }) => !valuesToRemove.includes(tab.tabName));
                const tabs = filteredTabs.map((tab: { tabName: any; }) => tab.tabName);
                return res.status(200).json({ status: 200, message: 'Get the menu access successfully', data: tabs, totalCount: dataCount.length });
            } else if (role == 'ADMIN' || role == 'UNIVERSITY') {

                const Data = await AccessServices.getAccessDataS(Number(userId));
                const columnData = await AccessServices.getColumnNameAccess(Number(userId));
                const collegeAndCourse = await AccessServices.getCollegeAndCourse(Number(userId));
                const viewData: { collegeName: College | undefined; courseDetails: any[]; }[] = [];
                for (const entry of collegeAndCourse) {
                    const collegeId = entry.collegeId;
                    const courseIds = entry.courseId;
                    const collegeNamePromises = collegeId.map(clgId => CollegeServices.getCollegeDetails(clgId));
                    const collegeNamesArrays = await Promise.all(collegeNamePromises);
                    const collegeNames: College[] = collegeNamesArrays.flat(); // Flatten the array of arrays
                    for (const clgId of collegeId) {
                        const collegeCourse = await CollegeCourseServices.getCollegeIdWiseCourse(clgId);
                        const courses = courseIds.map(courseId => {
                            const courseDetail = collegeCourse.find(course => course.course_id_admission === courseId);
                            return courseDetail ? courseDetail : null;
                        }).filter(course => course !== null);
                        const collegeName = collegeNames.find(college => college.id === clgId);
                        viewData.push({
                            collegeName: collegeName ?? undefined, 
                            courseDetails: courses
                        });
                    }
                }
                const valuesToRemove = ['admissionprocess', 'extradocuments', 'payments'];
                if (Array.isArray(Data) && Data.length > 0) {
                    const filteredMenuNames = Data[0].menuName.filter(menu => !valuesToRemove.includes(menu));
                    return res.status(200).json({
                        status: 200,
                        message: 'Get the menu access successfully',
                        data: filteredMenuNames,
                        columnData: columnData.length > 0 ? columnData[0] : [],
                        collegeCourseData:viewData.length >0 ? viewData : []
                    });
                } else if (collegeAndCourse.length > 0 || columnData.length > 0) {
                    return res.status(200).json({
                        status: 200,
                        message: 'Get the menu access successfully',
                        data: Data,
                        columnData: columnData.length > 0 ? columnData[0] : [],
                        collegeCourseData:viewData.length >0 ? viewData : []
                    });
                }
                else {
                    return res.status(400).json({
                        status: 400,
                        message: 'menu access Access Not found',
                        data: Data
                    });
                }
            } else {
                const userData = await UserServices.findUser(Number(userId));
              if(userData?.admissionType=='PHD'){
                tabs = ['dashboard', 'phdAdmissionProcess', 'help' ];
              }else{
                tabs = ['dashboard', 'admissionprocess', 'ticket', 'help', 'payments'];
              }
                res.status(200).json({ status: 200, message: 'Get the menu access successfully', data: tabs });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    /**
     * @author Moin
     * @router /api/access/allowMenuAccessToAdmin
     * @description This function is used to provide only allowed menu access.
     */

    public static allowMenuAccessToAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await allowAccess.validateAsync(req.body);
            const { id, data } = req.body;
            const { nameAsOnMarksheet, email } = req.user;
            const userId = req.user.id;
            const user = await AccessServices.findUser(id);
            if (user) {
                const updateUser = await AccessServices.updateUserData(user.userId, data);
                if (updateUser) {
                    const users = await UserServices.findUser(user.userId);
                    if (users) {

                        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                        const activity = `Superadmin ${nameAsOnMarksheet}(${email}) granted access of menus to admin ${users.nameAsOnMarksheet}(${users.email}) .`;

                        const activity_data = {
                            userId: userId,
                            name: `${nameAsOnMarksheet}(${email})`,
                            activity: activity,
                            activity_name: `Access of menus`,
                            ip_address: IP
                        };
                        const activityResult = await ActivityServices.saveActivity(activity_data);

                        if (activityResult) {
                            res.status(200).json({ status: 200, message: 'Access added successfully', data: updateUser });
                        }
                    }

                }
            } else {
                const createUser = await AccessServices.createUserData(req.body.id, req.body.role, req.body.data, req.body.email);
                if (createUser) {
                    const user = await UserServices.findUser(req.body.id);
                    if (user) {
                        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                        const activity = `Superadmin ${nameAsOnMarksheet}(${email}) granted access of menus to admin ${user.nameAsOnMarksheet}(${user.email}) .`;

                        const activity_data = {
                            userId: userId,
                            name: `${nameAsOnMarksheet}(${email})`,
                            activity: activity,
                            activity_name: `Access of menus`,
                            ip_address: IP
                        };
                        const activityResult = await ActivityServices.saveActivity(activity_data);
                        if (activityResult) {
                            res.status(200).json({ status: 200, message: 'Access added successfully', data: createUser });
                        }
                    }
                } else {
                    res.status(400).json({ status: 400, message: 'User not created ', data: createUser });

                }
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    /**
     * @author Moin
     * @router /api/access/changeDegree
     * @description This function is used to provide degree types for a specific purpose.
     */

    public static changeDegree = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await degreeStatus.validateAsync(req.body);
            const { nameAsOnMarksheet, email } = req.user;
            const userId = req.user.id;
            const { changeDegree, id, adminRole, adminEmail } = req.body;
            const user = await AccessServices.findUser(Number(id));
            if (user) {
                const updateUser = await AccessServices.updateDegree(user.userId, changeDegree);
                if (updateUser) {
                    const users = await UserServices.findUser(user.userId);
                    if (users) {

                        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                        const activity = `Superadmin ${nameAsOnMarksheet}(${email}) granted access to degree type to admin ${users.nameAsOnMarksheet}(${users.email}) .`;

                        const activity_data = {
                            userId: userId,
                            name: `${nameAsOnMarksheet}(${email})`,
                            activity: activity,
                            activity_name: `Access of degree type`,
                            ip_address: IP
                        };
                        const activityResult = await ActivityServices.saveActivity(activity_data);
                        if (activityResult) {
                            res.status(200).json({ status: 200, message: 'Access added successfully', data: updateUser });
                        }
                    }

                }
            } else {
                const createUser = await AccessServices.createDegreeType(id, changeDegree, adminRole, adminEmail);
                if (createUser) {
                    const user = await UserServices.findUser(id);
                    if (user) {
                        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                        const activity = `Superadmin ${nameAsOnMarksheet}(${email}) granted access to degree type to admin ${user.nameAsOnMarksheet}(${user.email}) .`;

                        const activity_data = {
                            userId: userId,
                            name: `${nameAsOnMarksheet}(${email})`,
                            activity: activity,
                            activity_name: `Access of degree type`,
                            ip_address: IP
                        };
                        const activityResult = await ActivityServices.saveActivity(activity_data);
                        if (activityResult) {
                            res.status(200).json({ status: 200, message: 'Degree Type Provide successfully', data: createUser });
                        }
                    }
                } else {
                    res.status(400).json({ status: 400, message: 'User not created ', data: createUser });
                }
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author Moin
     * @router /api/access/allowColumnAccessToAdmin
     * @description This function is used to provide only allowed column access.
     */

    public static allowColumnAccessToAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await columnAccess.validateAsync(req.body);
            const { id, data } = req.body;
            const { nameAsOnMarksheet, email } = req.user;
            const userId = req.user.id;
            const user = await AccessServices.findUser(id);
            if (user) {
                const updateUser = await AccessServices.updateUserColumnData(user.userId, data);
                if (updateUser) {
                    const users = await UserServices.findUser(user.userId);
                    if (users) {

                        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                        const activity = `Superadmin ${nameAsOnMarksheet}(${email}) granted column access to admin ${users.nameAsOnMarksheet}(${users.email}) .`;

                        const activity_data = {
                            userId: userId,
                            name: `${nameAsOnMarksheet}(${email})`,
                            activity: activity,
                            activity_name: `Column Access`,
                            ip_address: IP
                        };
                        const activityResult = await ActivityServices.saveActivity(activity_data);
                        if (activityResult) {
                            res.status(200).json({ status: 200, message: 'Access added successfully', data: updateUser });
                        }
                    }

                }
            } else {
                const createUser = await AccessServices.createUserData(req.body.id, req.body.role, req.body.data, req.body.email);
                if (createUser) {
                    const user = await UserServices.findUser(req.body.id);
                    if (user) {
                        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                        const activity = `Superadmin ${nameAsOnMarksheet}(${email}) granted column access to admin ${user.nameAsOnMarksheet}(${user.email}) .`;

                        const activity_data = {
                            userId: userId,
                            name: `${nameAsOnMarksheet}(${email})`,
                            activity: activity,
                            activity_name: `Column Access`,
                            ip_address: IP
                        };
                        const activityResult = await ActivityServices.saveActivity(activity_data);
                        if (activityResult) {
                            res.status(200).json({ status: 200, message: 'Access added successfully', data: createUser });
                        }
                    }
                } else {
                    res.status(400).json({ status: 400, message: 'User not created ', data: createUser });

                }
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    /**
     * @author Moin
     * @router /api/access/saveCollegeAndCourse
     * @description This function is used to provide only allowed college and course access.
     */

  
    public static saveCollegeAndCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await saveCollegeAndCourse.validateAsync(req.body);
            const { id, collegeId, courseData, role, email } = req.body;
            const { nameAsOnMarksheet } = req.user;
            const emailId = req.user.email;
            const userId = req.user.id;
            const user = await AccessServices.findUser(Number(id));
            const userCollegeId = await AccessServices.findUserCollegeId(Number(collegeId), Number(id));
            if (user) {
                
                if(userCollegeId.length !=0){
                    const updateUser = await AccessServices.updateExistCollegeWiseCourse(user.userId, courseData);
                    if (updateUser) {
                        const users = await UserServices.findUser(user.userId);
                        if (users) {
                            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                            const activity = `Superadmin ${nameAsOnMarksheet}(${emailId}) granted the access of college and course to admin ${users.nameAsOnMarksheet}(${users.email}) .`;
    
                            const activity_data = {
                                userId: userId,
                                name: `${nameAsOnMarksheet}(${email})`,
                                activity: activity,
                                activity_name: `Access added  Course of existing college`,
                                ip_address: IP
                            };
                            const activityResult = await ActivityServices.saveActivity(activity_data);
                            if (activityResult) {
                                res.status(200).json({ status: 200, message: 'Access added successfully', data: updateUser });
                            }
                        }
                    }
                }else{
                    const updateUser = await AccessServices.updateNewCollegeAndCourse(user.userId, collegeId, courseData);
                    if (updateUser) {
                        const users = await UserServices.findUser(user.userId);
                        if (users) {
                            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                            const activity = `Superadmin ${nameAsOnMarksheet}(${emailId}) granted the access of college and course to admin ${users.nameAsOnMarksheet}(${users.email}) .`;
    
                            const activity_data = {
                                userId: userId,
                                name: `${nameAsOnMarksheet}(${email})(${role})`,
                                activity: activity,
                                activity_name: `Access of College and Course`,
                                ip_address: IP
                            };
                            const activityResult = await ActivityServices.saveActivity(activity_data);
                            if (activityResult) {
                                res.status(200).json({ status: 200, message: 'Access added successfully', data: updateUser });
                            }
                        }
                    }
                }
             
            } else {
                    res.status(400).json({ status: 400, message: 'User not created '});
            
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author Moin
     * @router /api/access/deleteCourse
     * @description This function removes the unwanted courseId for a specific user in the database.
     */

    public static deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteCourse.validateAsync(req.query);
            const { userId, courseId } = req.query;
            const { id, nameAsOnMarksheet, email } = req.user;

            await AccessServices.deleteCourse(Number(userId), Number(courseId));
            const user = await UserServices.findUser(Number(userId));
            if (user) {
                const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const activity = `Superadmin ${nameAsOnMarksheet}(${email}) deleted course id of admin ${user.nameAsOnMarksheet}(${user.email}).`;

                const activity_data = {
                    userId: id,
                    name: `${nameAsOnMarksheet}(${email})`,
                    activity: activity,
                    activity_name: `Delete Course Id of Admin`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);

            }
            res.status(200).json({ status: 200, message: 'courseId deleted successfully!!', id: Number(courseId) });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    //        /**
    //  * @author Moin
    //  * @router /api/access/deleteCourse
    //  * @description This function removes the unwanted collegeId for a specific user in the database.
    //  */

           public static deleteCollege = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = req.body.userId;
                const courseData = req.body.courseData as any[];
               const collegeId :number=req.body.collegeId;
               
               await AccessServices.deleteCollege(Number(userId), Number(collegeId));
                for (const data of courseData) {
                    const courseId = data.course_id_admission;
                    await AccessServices.deleteCourse(Number(userId), Number(courseId));
                }
                res.status(200).json({ status: 200, message: 'College data delete  successfully!' });
            } catch (error) {
                logger.error(error);
                next(error);
            }
        };
}
