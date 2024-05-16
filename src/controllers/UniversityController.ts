import { Request, Response, NextFunction } from "express";
import logger from "../utils/winston";
import UniversityServices from "../services/UniversityServices";
import { UniversitySchema, UniversityIdSchema } from "../validator/university";
import { ActivityServices } from "../services/ActivityService";

export default class UniversityController {

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get all university
     * Router: /api/university/
     */
    public static getAllUniversities = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const universities = await UniversityServices.getAllUniversities();
            if (universities) {
                res.status(200).json({ status: 200, message: 'All universities.', data: universities });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Save university by id
     * Router: /api/university/saveUniversity
     */
    public static saveUniversity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await UniversitySchema.validateAsync(req.body);
            const user = req.user;
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const university = await UniversityServices.saveUniversity(req.body);
            if (university) {
                const activity = `Created new university ${university.university_name_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Create new University`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);
                res.status(200).json({ status: 200, message: 'Added university successfully!!', data: university });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Update university by id
     * Router: /api/university/updateUniversity
     */
    public static updateUniversity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await UniversityIdSchema.validateAsync(req.query);
            await UniversitySchema.validateAsync(req.body);
            const user = req.user;
            const { id } = req.query;
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            await UniversityServices.updateUniversityById(Number(id), req.body);
            const updatedUniversity = await UniversityServices.getUniversityById(Number(id));
            if (updatedUniversity) {
                const activity = `Updated university ${req.body.university_name_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Update University`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);
                res.status(200).json({ status: 200, message: 'Updated Successfully!!', data: updatedUniversity });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get university by id
     * Router: /api/university/universityById
     */
    public static getUniversityById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await UniversityIdSchema.validateAsync(req.query);

            const { id } = req.query;
            const university = await UniversityServices.getUniversityById(Number(id));
            if (university) {
                res.status(200).json({ status: 200, message: 'University', data: university });
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
     * @description: Delete university by id
     * Router: /api/university/deleteUniversityById
     */
    public static deleteUniversityById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await UniversityIdSchema.validateAsync(req.query);
            const user = req.user;
            const { id } = req.query;
            let universityName: string | undefined;

            const uniData = await UniversityServices.getUniversityById(Number(id));
            if (uniData !== null) {
                universityName = uniData.university_name_admission;
            }
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const deleteData = await UniversityServices.deleteUniversityById(Number(id));
            if (deleteData) {
                const activity = `Deleted university ${universityName} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Delete University`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);

                res.status(200).json({
                    status: 200, message: 'Deleted Successfully!!',
                    id: Number(id)
                });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get the university data with pagination and search
     * Router: /api/university/getAllUniversityPaginationAndSearch
     */
    public static getAllUniversityPaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const count = await UniversityServices.getUniversityCount();

            const universities = await UniversityServices.getUniversityWithPaginationAndSearch(offset, Number(limit), String(search));

            if (universities) {
                res.status(200).json({ status: 200, message: 'All universities.', data: universities, count: count });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

}