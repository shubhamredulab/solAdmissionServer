import { Request, Response, NextFunction } from "express";
import logger from "../utils/winston";
import CourseServices from "../services/CourseServices";
import { CourseSchema, CourseIdSchema, checkCollegeId } from "../validator/course";
import SubjectGroupServices from "../services/SubjectGroupServices";
import { AccessServices } from "../services/AccessService";
import { ActivityServices } from "../services/ActivityService";
import { jsonParser } from "../utils/functions";
import MenuItemServices from "../services/MenuItemService";
// import { Degree } from "../types/user";

export default class CourseController {
    /**
     * @author: Priyanka Vishwakarma
     * @description: Get all courses
     * Router: /api/course/
     */
    public static allCourses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await CourseServices.getAllCourses();
            if (courses) {
                res.status(200).json({ status: 200, message: "All courses", data: courses });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Save course data
     * Router: /api/course/saveCourse
     */
    public static saveCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CourseSchema.validateAsync(req.body);
            const user = req.user;
            const course = await CourseServices.saveCourse(req.body);
            if (course) {

                const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                let roleVerb;
                switch (user.role) {
                    case 'SUPER_ADMIN':
                        roleVerb = 'superadmin';
                        break;
                    case 'ADMIN':
                        roleVerb = 'admin';
                        break;
                    default:
                        roleVerb = 'unknown';
                        break;
                }
                const activity = `Created new course ${course.course_name_admission} by ${roleVerb} ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Create Course`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);
                res.status(200).json({ status: 200, message: 'Added course successfully!!', data: course });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get course by id
     * Router: /api/course/getCourseById
     */
    public static getCourseById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CourseIdSchema.validateAsync(req.query);

            const { id } = req.query;
            const course = await CourseServices.getCourseById(Number(id));
            if (course) {
                res.status(200).json({ status: 200, message: 'Course', data: course });
            } else {
                res.status(404).json({ status: 404, message: "Not Found", data: course });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Update course by id
     * Router: /api/course/updateCourseById
     */
    public static updateCourseById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CourseIdSchema.validateAsync(req.query);
            await CourseSchema.validateAsync(req.body);

            const user = req.user;
            const { id } = req.query;
            await CourseServices.updateCourseById(Number(id), req.body);
            const course = await CourseServices.getCourseById(Number(id));
            if (course) {

                const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const activity = `Updated course ${req.body.course_name_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Update Course`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);
                res.status(200).json({ status: 200, message: 'Course updated successfully!!', data: course });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get all courses
     * Router: /api/course/deleteCourseById
     */
    public static deleteCourseById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CourseIdSchema.validateAsync(req.query);
            const user = req.user;
            const { id } = req.query;
            let courseName: string | undefined;

            const courseData = await CourseServices.getCourseById(Number(id));
            if (courseData !== null) {
                courseName = courseData.course_name_admission;
            }
            await CourseServices.deleteCourseById(Number(id));
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const activity = `Deleted course ${courseName} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;
            const activity_data = {
                userId: user.id,
                name: `${user.nameAsOnMarksheet}(${user.email})`,
                activity: activity,
                activity_name: `Delete course`,
                ip_address: IP
            };
            await ActivityServices.saveActivity(activity_data);
            res.status(200).json({ status: 200, message: 'Course deleted successfully!!', id: Number(id) });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static getsubjectgroup = async (req: Request, res: Response) => {
        try {
            const { courseId } = req.query;

            const collegeData = await SubjectGroupServices.getSubjectGroupByCourseId(Number(courseId));
            res.json({ status: 200, message: "All users", data: collegeData });
        } catch (error) {
            logger.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    };


    /*
Author: Rutuja Patil.
Router: /api/course/getDataByCourseName
Description: this function use for get the data by using course Id.
*/
    public static getDataByCourseName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CourseIdSchema.validateAsync(req.query);
            const { id } = req.query;
            const courseDetails = await CourseServices.getDataByCourseName(Number(id));
            const parseData = await jsonParser(courseDetails);
            if (courseDetails) {
                res.status(200).json({ status: 200, message: 'SubjectGroup', data: parseData });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };



    public static getDegreeData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.user.admissionType == 'UG') {
                const degreeData = await CourseServices.getDegreeDataUg();
                res.status(200).json({ status: 200, message: "Degree data get successfully", data: degreeData });
            } else {
                const degreeData = await CourseServices.getDegreeDataPg();
                res.status(200).json({ status: 200, message: "Degree data get successfully", data: degreeData });
            }
        } catch (err) {
            logger.error(err);
            next(err);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get courses data with pagination and search
     * Router: /api/course/getCoursesWithPaginationAndSearch
     */
    public static getCoursesWithPaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const user = req.user;
            let count;
            let courses;
            if (user.role == 'SUPER_ADMIN' || user.role == 'UNIVERSITY') {
                count = await CourseServices.getCoursesCount();
                courses = await CourseServices.getCoursesWithPaginationAndSearch(offset, Number(limit), String(search));
                if (courses) {
                    res.status(200).json({ status: 200, message: 'All courses.', data: courses, count: count });
                }
            } else if (user.role == 'ADMIN') {
                const menuItem = await MenuItemServices.getMenuItemByUserId(user.id);
                const courseIds = menuItem?.courseId;
                courses = await CourseServices.getCoursesWithPaginationAndSearch(offset, Number(limit), String(search), courseIds);
                count = courses?.length;
                if (courses) {
                    res.status(200).json({ status: 200, message: 'courses', data: courses, count: count });
                }
            }



        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Tiffany Correia
     * @description: Gets all the course data
     */
    public static getCourseData = async (req: any, res: Response) => {
        try {
            const user = await CourseServices.gettingCourseData();
            if (user) {
                res.status(200).json({ status: 200, message: 'Course Fetched Successfully!', data: user });
            }
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get assigned courses
     */
    public static getAssignedCourses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            const access_details = await AccessServices.findUser(user.id);

            if (access_details) {
                //Get access courses
                const { courseId } = access_details || {};

                const courses = await CourseServices.getCourses(courseId as number[]);
                return res.status(200).json({ status: 200, data: courses });
            }
            return res.status(200).json({ status: 200, message: 'No courses.', data: [] });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    /**
     * @author: Moin 
     * @description: Get Admin college wise assigned courses
     */
    public static getAdminWiseCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await checkCollegeId.validateAsync(req.query);
            const { collegeId } = req.query;
            const courses = await AccessServices.findAdminCollegeId(Number(collegeId));
            return res.status(200).json({ status: 200, data: courses });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Pranali Gambhir 
     * @description: Get courses role wise for reports tab
     */
    public static getAllCourseData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let courses;
            let course;
            const user = req.user;
            if (user.role === 'SUPER_ADMIN' || user.role === 'UNIVERSITY') {
                courses = await CourseServices.getAllCourses();

                if (courses) {
                    res.status(200).json({ status: 200, message: "All courses", data: courses });
                }
            } else {
                const menuItem = await MenuItemServices.getMenuItemByUserId(user.id);
                if (menuItem && menuItem.courseId) {
                    course = await CourseServices.getCourses(menuItem.courseId);
                    res.status(200).json({ status: 200, message: "All Courses", data: course });
                }
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static getCourseDetails = async (req: Request, res:Response, next:NextFunction) => {
        try{
            const {courseId} = req.query;
            const courseData = await CourseServices.getCourseDetails(Number(courseId));
            if (courseData) {
                return res.json({ status: 200, message: "Course data get successfully", data: courseData });
            } else {
                return res.status(404).json({ status: 404, message: "Course data not found" });
            }
        }catch(error){
            logger.error(error);
            next(error);
        }
    };
}
