import { Request, Response, NextFunction } from "express";
import logger from "../utils/winston";
import SubjectPhdServices from "../services/SubjectPhdService";
import { SubjectPhdSchema, SubjectPhdIdSchema } from "../validator/subjectPhd";
import { ActivityServices } from "../services/ActivityService";

export default class SubjectController {

    /**
     * @author: Priya Sawant
     * @description: get All Subject
     */
    public static getAllSubPhd = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subjects = await SubjectPhdServices.getAllSubPhd();
            if (subjects) {
                res.status(200).json({ status: 200, message: 'All PHD subjects.', data: subjects });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priya Sawant
     * @description: Save Subject
     */
    public static saveSubjectPhd = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectPhdSchema.validateAsync(req.body);
            const subjectPhd = await SubjectPhdServices.saveSubjectPhd(req.body);
            if (subjectPhd) {
                res.status(200).json({ status: 200, message: 'Added subject successfully!!', data: subjectPhd });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priya Sawant
     * @description: get All SubjectById
     */
    public static getSubjectPhdById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectPhdIdSchema.validateAsync(req.query);

            const { id } = req.query;
            const subject = await SubjectPhdServices.getSubjectPhdById(Number(id));
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
     * @author: Priya Sawant
     * @description: Update Subject
     */
    public static updateSubjectPhdById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectPhdIdSchema.validateAsync(req.query);
            await SubjectPhdSchema.validateAsync(req.body);
            const user = req.user;
            const { id } = req.query;
            await SubjectPhdServices.updateSubjectPhdById(Number(id), req.body);
            const subjectPhd = await SubjectPhdServices.getSubjectPhdById(Number(id));

            if (subjectPhd) {
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
                res.status(200).json({ status: 200, message: "Subject updated successfully", data: subjectPhd });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priya Sawant
     * @description: Delete Subject
     */
    public static deleteSubjectPhdById = async (req: Request, res: Response, next: NextFunction) => {
        try {
        
            await SubjectPhdIdSchema.validateAsync(req.query);
            const { id } = req.query;     

            const subjectData = await SubjectPhdServices.getSubjectPhdById(Number(id));
            
            if (subjectData !== null) {
                res.status(200).json({ status: 200, message: 'PHD Subject deleted successfully', id: Number(id) });
            }            
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priya Sawant
     * @description: get All Subject with limit offset
     */
    public static getSubjectsPhdWithPaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const count = await SubjectPhdServices.getSubjectsPhdCount();
            const subjects = await SubjectPhdServices.getSubjectsPhdWithPaginationAndSearch(offset, Number(limit), String(search));

            if (subjects) {
                res.status(200).json({ status: 200, message: 'All subjects.', data: subjects, count: count });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priya Sawant
     * @description: get Subject Data
     */
    public static getSubjectPhdData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subjectData = await SubjectPhdServices.getSubjectPhdData();
            res.status(200).json({ status: 200, message: "Subject data get successfully", data: subjectData });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
}
