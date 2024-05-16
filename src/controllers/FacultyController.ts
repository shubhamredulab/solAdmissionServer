import { Request, Response, NextFunction } from "express";
import logger from "../utils/winston";
import FacultyServices from "../services/FacultyServices";
import { FacultySchema, FacultyIdSchema } from "../validator/faculty";
import { ActivityServices } from "../services/ActivityService";

export default class FacultyController {

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get all faculty
     * Router: /api/faculty/
     */
    public static allFaculties = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const faculties = await FacultyServices.getAllFaculties();
            if (faculties) {
                res.status(200).json({ status: 200, message: 'All faculties.', data: faculties });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Save the faculty
     * Router: /api/faculty/saveFaculty
     */
    public static saveFaculty = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await FacultySchema.validateAsync(req.body);
            const user = req.user;
            const faculty = await FacultyServices.saveFaculty(req.body);
            if (faculty) {
                const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const activity = `Created new faculty ${faculty.faculty_name_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Create Faculty`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);

                res.status(200).json({ status: 200, message: 'Added faculty successfully!!', data: faculty });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get faculty by id
     * Router: /api/faculty/getFacultyById
     */
    public static getFacultyById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await FacultyIdSchema.validateAsync(req.query);

            const { id } = req.query;
            const faculty = await FacultyServices.getFacultyById(Number(id));
            if (faculty) {
                res.status(200).json({ status: 200, message: "Faculty", data: faculty });
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
     * @description: Update faculty by id
     * Router: /api/faculty/updateFacultyById
     */
    public static updateFacultyById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await FacultyIdSchema.validateAsync(req.query);
            await FacultySchema.validateAsync(req.body);
            const user = req.user;
            const { id } = req.query;
            await FacultyServices.updateFacultyById(Number(id), req.body);
            const faculty = await FacultyServices.getFacultyById(Number(id));

            if (faculty) {
                const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const activity = `Updated faculty ${req.body.faculty_name_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Update Faculty`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);

                res.status(200).json({ status: 200, message: "Faculty updated successfully", data: faculty });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Delete faculty by id
     * Router: /api/faculty/deleteFacultyById
     */
    public static deleteFacultyById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await FacultyIdSchema.validateAsync(req.query);
            const user = req.user;
            const { id } = req.query;
            let facultyName: string | undefined;

            const facultyData = await FacultyServices.getFacultyById(Number(id));
            if (facultyData !== null) {
                facultyName = facultyData.faculty_name_admission;
            }
            await FacultyServices.deleteFacultyById(Number(id));

            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const activity = `Deleted faculty ${facultyName} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;
            const activity_data = {
                userId: user.id,
                name: `${user.nameAsOnMarksheet}(${user.email})`,
                activity: activity,
                activity_name: `Delete faculty`,
                ip_address: IP
            };
            await ActivityServices.saveActivity(activity_data);
            res.status(200).json({ status: 200, message: 'Faculty deleted successfully', id: Number(id) });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get the faculty data with pagination and search
     * Router: /api/faculty/getFacultyWithPaginationAndSearch
     */
    public static getFacultyWithPaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const count = await FacultyServices.getFacultyCount();
            const faculties = await FacultyServices.getFacultyWithPaginationAndSearch(offset, Number(limit), String(search));

            if (faculties) {
                res.status(200).json({ status: 200, message: 'All faculties.', data: faculties, count: count });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

}
