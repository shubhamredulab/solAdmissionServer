import { Request, Response, NextFunction } from 'express';
import FacultySubjectServices from '../services/FacultySubjectServices';
import logger from '../utils/winston';
import { ActivityServices } from "../services/ActivityService";
import { FacultySubjectSchema, FacultySubjectIdSchema } from '../validator/facultysubject';
import FacultySubject from '../entity/FacultySubject';

export default class FacultySubjectController {

    public static getSubjectName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const facultyData = await FacultySubjectServices.getSubjectName(req.query.facultyName as string);
            if (facultyData) {
                res.status(200).json({ status: 200, message: 'All subjects.', data: facultyData });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priya Sawant
     * @description: save faculty Subject
     */
    public static saveFacultySubject = async(req: Request, res: Response) => {
        try {
          const { faculty_phd_id_admission, subject_phd_id_admission } = req.body;
          const facultySubject: FacultySubject = {
            faculty_phd_id_admission,
            subject_phd_id_admission,
            createdAt: new Date(), 
            updatedAt: new Date(),
            id: 0
          };
          const savedFacultySubject = await FacultySubjectServices.saveFacultySubject(facultySubject);
          res.status(201).json({status:200, message: 'Added Faculty Subject successfully!!', savedFacultySubject:savedFacultySubject});
        } catch (error) {
          res.status(500).json({ message: `Failed to save faculty subject: ${(error as Error).message}` });
        }
      };

      /**
     * @author: Priya Sawant
     * @description: get faculty Subject data
     */
      public static getFacultySubjectData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const result = await FacultySubjectServices.getFacultySubjectData( offset, Number(limit), String(search));
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @author: Priya Sawant
     * @description: delete faculty Subject data
     */
    public static deleteFacultySubjectById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await FacultySubjectIdSchema.validateAsync(req.query);
            const user = req.user;
            const { id } = req.query;
            let facultySubjectName: number | undefined;

            const facultySubjectData = await FacultySubjectServices.getFacultySubjectById(Number(id));
            if (facultySubjectData !== null) {
                facultySubjectName = facultySubjectData.faculty_phd_id_admission;
            }
            await FacultySubjectServices.deleteFacultySubjectById(Number(id));

            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const activity = `Deleted faculty ${facultySubjectName} by superadmin (${user.email}).`;
            const activity_data = {
                userId: user.id,
                name: `${user.nameAsOnMarksheet}(${user.email})`,
                activity: activity,
                activity_name: `Delete faculty`,
                ip_address: IP
            };
            await ActivityServices.saveActivity(activity_data);
            res.status(200).json({ status: 200, message: 'Faculty Subject deleted successfully', id: Number(id) });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priya Sawant
     * @description: update faculty Subject data
     */
    public static updateFacultySubject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await FacultySubjectIdSchema.validateAsync(req.query);
            await FacultySubjectSchema.validateAsync(req.body);
            const user = req.user;
            const { id } = req.query;
            await FacultySubjectServices.updateFacultySubject(Number(id), req.body);
            const facultySubject = await FacultySubjectServices.getFacultySubjectById(Number(id));

            if (facultySubject) {
                const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const activity = `Updated FacultySubject ${req.body.faculty_phd_name_admission} by superadmin(${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Update facultySubject`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);

                res.status(200).json({ status: 200, message: "Faculty Subject updated successfully", data: facultySubject });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priya Sawant
     * @description: set limit offset for faculty Subject
     */
    public static getFacultySubjectPHDWithPaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const count = await FacultySubjectServices.getFacultySubjectCount();
            const facultySubject = await FacultySubjectServices.getFacultySubjectPHDWithPaginationAndSearch(offset, Number(limit), String(search));

            if (facultySubject) {
                res.status(200).json({ status: 200, message: 'All Faculty Subject.', data: facultySubject, count: count });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
}