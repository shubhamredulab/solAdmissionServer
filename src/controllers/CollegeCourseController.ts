import { Request, Response, NextFunction } from "express";
import logger from "../utils/winston";
import CollegeCourseServices from "../services/CollegeCourseServices";
import { PreferencesServices } from "../services/PreferencesServices";
import { CollegeCourseSchema, CollegeCourseIdSchema, getCollegeWiseCourse, incrementIntakeSchema, decrementIntakeSchema } from '../validator/collegecourse';
import MeritListServices from "../services/MeritlistService";
import { activity } from "../utils/functions";
import CourseServices from "../services/CourseServices";
import MenuItemServices from "../services/MenuItemService";
import { ActivityServices } from "../services/ActivityService";

export default class CollegeCourseController {
    /**
     * @author: Priyanka Vishwakarma
     * @description: Get all college course
     * Router: /api/collegeCourse/
     */
    public static allCollegCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collegeCourses = await CollegeCourseServices.getAll();
            if (collegeCourses) {
                res.status(200).json({ status: 200, message: "All collegeCourses", data: collegeCourses[0] });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Save collegeCourse data
     * Router: /api/collegeCourse/saveCollegeCourse
     */
    public static saveCollegeCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CollegeCourseSchema.validateAsync(req.body);
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const user = req.user;
            const collegeCourse = await CollegeCourseServices.saveCollegeCourse(req.body);
            const newCollegeCourse = await CollegeCourseServices.getCollegeCourseById(collegeCourse.id);
            let college_name: string | undefined;
            let course_name: string | undefined;
            if (newCollegeCourse !== null) {
                college_name = newCollegeCourse.college_name_admission;
                course_name = newCollegeCourse.course_name_admission;
            }
            if (newCollegeCourse) {
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
                const activity = `Created new collegeCourse [College: ${college_name}, Course: ${course_name}] by ${roleVerb} ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Create CollegeCourse`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);

                res.status(200).json({ status: 200, message: 'Added collegeCourse successfully!!', data: newCollegeCourse });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get collegeCourse by id
     * Router: /api/collegeCourse/getCollegeCourseById
     */
    public static getCollegeCourseById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CollegeCourseIdSchema.validateAsync(req.query);
            const { id } = req.query;
            const collegeCourse = await CollegeCourseServices.getCollegeCourseById(Number(id));
            if (collegeCourse) {
                res.status(200).json({ status: 200, message: 'CollegeCourse', data: collegeCourse });
            } else {
                res.status(404).json({ status: 404, message: "Not Found" });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: upadate collegeCourse by id
     * Router: /api/collegeCourse/updateCollegeCourseById
     */
    public static updateCollegeCourseById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CollegeCourseIdSchema.validateAsync(req.query);
            await CollegeCourseSchema.validateAsync(req.body);
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const user = req.user;
            const { id } = req.query;
            await CollegeCourseServices.updateCollegeCourseById(Number(id), req.body);
            const collegeCourse = await CollegeCourseServices.getCollegeCourseById(Number(id));
            let college_name: string | undefined;
            let course_name: string | undefined;
            if (collegeCourse) {

                const newCollegeCourse = await CollegeCourseServices.getCollegeCourseById(collegeCourse.id);
                if (newCollegeCourse) {
                    college_name = newCollegeCourse.college_name_admission;
                    course_name = newCollegeCourse.course_name_admission;
                    const activity = `Updated collegeCourse [College: ${college_name}, Course: ${course_name}] by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                    const activity_data = {
                        userId: user.id,
                        name: `${user.nameAsOnMarksheet}(${user.email})`,
                        activity: activity,
                        activity_name: `Update CollegeCourse`,
                        ip_address: IP
                    };
                    await ActivityServices.saveActivity(activity_data);
                    res.status(200).json({ status: 200, message: 'CollegeCourse updated successfully!!', data: collegeCourse });
                }
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    /**
     * @author: Priyanka Vishwakarma
     * @description: delete collegeCourse by id
     * Router: /api/collegeCourse/deleteCollegeCourseById
     */
    public static deleteCollegeCourseById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CollegeCourseIdSchema.validateAsync(req.query);

            const { id } = req.query;
            const user = req.user;
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const collegeCourse = await CollegeCourseServices.getCollegeCourseById(Number(id));
            let college_name: string | undefined;
            let course_name: string | undefined;
            if (collegeCourse) {

                const newCollegeCourse = await CollegeCourseServices.getCollegeCourseById(collegeCourse.id);
                if (newCollegeCourse) {
                    college_name = newCollegeCourse.college_name_admission;
                    course_name = newCollegeCourse.course_name_admission;
                    await CollegeCourseServices.deleteCollegeCourseById(Number(id));
                    const activity = `Deleted collegeCourse [College: ${college_name}, Course: ${course_name}] by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                    const activity_data = {
                        userId: user.id,
                        name: `${user.nameAsOnMarksheet}(${user.email})`,
                        activity: activity,
                        activity_name: `Delete CollegeCourse`,
                        ip_address: IP
                    };
                    await ActivityServices.saveActivity(activity_data);

                    res.status(200).json({ status: 200, message: 'CollegeCourse deleted successfully!!', id: Number(id) });
                }
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static getCorseCollegeWise = async (req: Request, res: Response) => {
        try {
            const { collegeId } = req.query;
            const user = await MeritListServices.getCourseData(Number(collegeId));
            res.status(200).json({ status: 200, message: 'college wise course', data: user });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get the collegeCourse with pagination and search
     * Router: /api/collegeCourse/getCollegeCoursesPaginationAndSearch
     */
    public static getCollegeCoursesPaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const user = req.user;

            let count;
            let collegeCourses;

            if (user.role === 'SUPER_ADMIN' || user.role === 'UNIVERSITY') {
                count = await CollegeCourseServices.getCollegeCoursesCount();
                collegeCourses = await CollegeCourseServices.getCollegeCoursesPaginationAndSearch(offset, Number(limit), String(search));
            } else if (user.role === 'ADMIN') {
                const menuItem = await MenuItemServices.getMenuItemByUserId(user.id);

                if (menuItem && menuItem.courseId && menuItem.courseId.length > 0) {
                    count = 1;
                    collegeCourses = await CollegeCourseServices.getCollegeCoursesByCourseIds(menuItem.courseId, offset, Number(limit), String(search));
                } else {
                    return res.status(404).json({ status: 404, message: 'No courses found for the admin user' });
                }
            }

            if (collegeCourses) {
                res.status(200).json({ status: 200, message: 'All collegeCourses.', data: collegeCourses[0], count: count });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /*
 Author: Rutuja Patil.
 Router: /api/college/getPreferenceData
 Description: this function use for get the Preference data.
 */
    public static getPreferenceData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collegeData = await PreferencesServices.getpreference(req.user.id);
            if (collegeData) {
                const collegeIds = collegeData.preferences;
                const preData = await CollegeCourseServices.getPreferenceData(collegeIds);
                res.status(200).json({
                    status: 200,
                    message: "Get all Preference Data",
                    data: preData
                });
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
    public static getCourseData = async (req: Request, res: Response) => {
        try {
            const user = await CourseServices.gettingCourseData();
            if (user) {
                res.status(200).json({ status: 200, message: 'Course Fetched Successfully!', data: user });
            }
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    };
    // Moin 
    // this function get the college wise course Details
    public static getCollegeWiseCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await getCollegeWiseCourse.validateAsync(req.query);
            const { collegeId } = req.query;
            const collegeCourse = await CollegeCourseServices.getCollegeIdWiseCourse(Number(collegeId));
            if (collegeCourse) {
                res.status(200).json({ status: 200, message: 'CollegeCourse', data: collegeCourse });
            } else {
                res.status(404).json({ status: 404, message: "Not Found" });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
        * @author: Priya sawant
        * @description: Gets college-course wise status
        */
    public static getUniversityWiseCollegeCourseData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { collegeId } = req.query; // Assuming college_id is a route parameter
            const data = await CollegeCourseServices.getUniversityWiseCollegeCourseData(Number(collegeId));
            return res.json(data);
        } catch (error) {
            next(error);
        }
    };


    /**
     * @author: Priyanka Vishwakarma
     * @description: increment intakes by collegeCourseId, collegeId, courseId, admissionYear, academicYear
     */
    public static incrementIntakes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await incrementIntakeSchema.validateAsync(req.body);

            const { collegeCourseId, collegeId, courseId, admissionYear, academicYear, incrementIntake } = req.body;

            // Check if collegeCourse exists
            const existsCollegeCourse = await CollegeCourseServices.getCollegeCourseById(collegeCourseId);

            // Return a 204 status if the college course does not exist
            if (!existsCollegeCourse) return res.status(204).json({ status: 204, message: 'College course not found' });

            const result = await CollegeCourseServices.incrementIntakes(collegeCourseId, collegeId, courseId, admissionYear, academicYear, incrementIntake);

            // intakes were successfully incremented
            if (result.affected === 1) {

                const activity_data = `Incremented intakes by ${incrementIntake} of collegeCourse ID = ${collegeCourseId}, collegeId = ${collegeId}, courseId = ${courseId},
                admissionYear = ${admissionYear}, academicYear = ${academicYear} by ${req.user.nameAsOnMarksheet} ( ${req.user.email} )`;
                await activity(req.user.id, req.user.nameAsOnMarksheet, activity_data);

                return res.status(200).json({ status: 200, message: 'Intakes incremented successfully' });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: decrement intakes by collegeCourseId, collegeId, courseId, admissionYear, academicYear
     */
    public static decrementIntakes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await decrementIntakeSchema.validateAsync(req.body);

            const { collegeCourseId, collegeId, courseId, admissionYear, academicYear, decrementIntake } = req.body;

            // Check if collegeCourse exists
            const existsCollegeCourse = await CollegeCourseServices.getCollegeCourseById(collegeCourseId);

            // Return a 204 status if the college course does not exist
            if (!existsCollegeCourse) return res.status(204).json({ status: 204, message: 'College course not found' });

            const result = await CollegeCourseServices.decrementIntakes(collegeCourseId, collegeId, courseId, admissionYear, academicYear, decrementIntake);

            // intakes were successfully decremented
            if (result.affected === 1) {

                const activity_data = `Decremented intakes by ${decrementIntake} of collegeCourse ID = ${collegeCourseId}, collegeId = ${collegeId}, courseId = ${courseId},
                admissionYear = ${admissionYear}, academicYear = ${academicYear} by ${req.user.nameAsOnMarksheet} ( ${req.user.email} )`;
                await activity(req.user.id, req.user.nameAsOnMarksheet, activity_data);

                return res.status(200).json({ status: 200, message: 'Intakes decremented successfully' });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

}
