import { Request, Response, NextFunction } from "express";
import logger from "../utils/winston";
import FacultyPhdServices from "../services/FacultyPhdService";
import { FacultyPhdSchema, FacultyPhdIDSchema } from "../validator/facultyPhd";
import { ActivityServices } from "../services/ActivityService";

export default class FacultyController {

    /**
     * @author: Priya Sawant
     * @description: Get all phd faculty
     * Router: /api/facultyPhd/
     */
    public static getAllFacultyPhd = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const faculties = await FacultyPhdServices.getAllFacultyPhd();
            if (faculties) {
                res.status(200).json({ status: 200, message: 'All PHD faculties.', data: faculties });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priya Sawant
     * @description: Save Faculty PHD faculty data
     * Router: /api/FacultyPHD/saveFacultyPhd
     */
    public static saveFacultyPhd = async (req: Request, res: Response, next: NextFunction) => {        
        try {            
            await FacultyPhdSchema.validateAsync(req.body);
            const facultyPhd = await FacultyPhdServices.saveFacultyPhd(req.body);
            if (facultyPhd) {
                res.status(200).json({ status: 200, message: 'Added Faculty PHD successfully!!', data: facultyPhd });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    // /**
    //  * @author: Priya Sawant
    //  * @description: Update faculty by id
    //  * Router: /api/facultyPhd/updateFacultyPhdById
    //  */
    public static updateFacultyPhdById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await FacultyPhdIDSchema.validateAsync(req.query);
            await FacultyPhdSchema.validateAsync(req.body);
            const user = req.user;
            const { id } = req.query;
            await FacultyPhdServices.updateFacultyPhdById(Number(id), req.body);
            const faculty = await FacultyPhdServices.getFacultyPhdById(Number(id));

            if (faculty) {
                res.status(200).json({ status: 200, message: "Faculty updated successfully", data: faculty });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    // /**
    //  * @author: Priya Sawant
    //  * @description: Delete faculty by id
    //  * Router: /api/facultyPhd/deleteFacultyPHDById
    //  */
    public static deleteFacultyPHDById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await FacultyPhdIDSchema.validateAsync(req.query);
            const user = req.user;
            const { id } = req.query;
            let facultyName: string | undefined;
            const facultyData = await FacultyPhdServices.deleteFacultyPHDById(Number(id));
            if (facultyData !== null) {
                res.status(200).json({ status: 200, message: 'Faculty PHD deleted successfully', id: Number(id) });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    // /**
    //  * @author: Priya Sawant
    //  * @description: Get the faculty data with pagination and search
    //  * Router: /api/facultyPhd/getFacultyPHDWithPaginationAndSearch
    //  */
    public static getFacultyPHDWithPaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const count = await FacultyPhdServices.getFacultyPhdCount();
            const facultyPhd = await FacultyPhdServices.getFacultyPHDWithPaginationAndSearch(offset, Number(limit), String(search));

            if (facultyPhd) {
                res.status(200).json({ status: 200, message: 'All PHD faculties.', data: facultyPhd, count: count });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

}
