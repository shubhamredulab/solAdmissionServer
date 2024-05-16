import { Request, Response, NextFunction } from "express";
import logger from "../utils/winston";
import SubjectServices from "../services/SubjectServices";
import { SubjectSchema, SubjectIdSchema } from "../validator/subject";
import { ActivityServices } from "../services/ActivityService";

export default class SubjectController {

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get subjects
     * Router: /api/subject/
     */
    public static allSubjects = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subjects = await SubjectServices.getAll();
            if (subjects) {
                res.status(200).json({ status: 200, message: 'All subjects.', data: subjects });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Save subjects data
     * Router: /api/subject/saveSubject
     */
    public static saveSubject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectSchema.validateAsync(req.body);
            const user = req.user;
            const subject = await SubjectServices.saveSubject(req.body);
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            if (subject) {
                const activity = `Created new subject ${subject.subject_name_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Create Subject`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);
                res.status(200).json({ status: 200, message: 'Added subject successfully!!', data: subject });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get subject by id
     * Router: /api/subject/getSubjectById
     */
    public static getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectIdSchema.validateAsync(req.query);

            const { id } = req.query;
            const subject = await SubjectServices.getSubjectById(Number(id));
            if (subject) {
                res.status(200).json({ status: 200, message: "Subject", data: subject });
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
     * @description: Update subject by id
     * Router: /api/subject/updateSubjectById
     */
    public static updateSubjectById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectIdSchema.validateAsync(req.query);
            await SubjectSchema.validateAsync(req.body);
            const user = req.user;
            const { id } = req.query;
            await SubjectServices.updateSubjectById(Number(id), req.body);
            const subject = await SubjectServices.getSubjectById(Number(id));

            if (subject) {
                const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const activity = `Updated subject ${req.body.subject_name_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Update subject`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);
                res.status(200).json({ status: 200, message: "Subject updated successfully", data: subject });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Delete subject by id
     * Router: /api/subject/deleteSubjectById
     */
    public static deleteSubjectById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectIdSchema.validateAsync(req.query);
            const user = req.user;
            const { id } = req.query;
            let subjectName: string | undefined;

            const subjectData = await SubjectServices.getSubjectById(Number(id));
            if (subjectData !== null) {
                subjectName = subjectData.subject_name_admission;
            }
            await SubjectServices.deleteSubjectById(Number(id));
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const activity = `Deleted subject ${subjectName} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;
            const activity_data = {
                userId: user.id,
                name: `${user.nameAsOnMarksheet}(${user.email})`,
                activity: activity,
                activity_name: `Delete subject`,
                ip_address: IP
            };
            await ActivityServices.saveActivity(activity_data);
            res.status(200).json({ status: 200, message: 'Subject deleted successfully', id: Number(id) });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get subjects data with pagination and search
     * Router: /api/subject/getSubjectsWithPaginationAndSearch
     */
    public static getSubjectsWithPaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const count = await SubjectServices.getSubjectsCount();
            const subjects = await SubjectServices.getSubjectsWithPaginationAndSearch(offset, Number(limit), String(search));

            if (subjects) {
                res.status(200).json({ status: 200, message: 'All subjects.', data: subjects, count: count });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static getSubjectData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subjectData = await SubjectServices.getSubjectData();
            res.status(200).json({ status: 200, message: "Subject data get successfully", data: subjectData });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

}
