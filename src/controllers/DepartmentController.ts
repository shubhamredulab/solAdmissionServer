import { Request, Response, NextFunction } from "express";
import logger from "../utils/winston";
import DepartmentServices from "../services/DepartmentServices";
import { DepartmentSchema, DepartmentIdSchema } from "../validator/department";
import { ActivityServices } from "../services/ActivityService";

export default class DepartmentController {

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get all departments
     * Router: /api/department/
     */
    public static allDepartments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const departments = await DepartmentServices.getAllDepartments();
            if (departments) {
                res.status(200).json({ status: 200, message: 'All departments.', data: departments });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Save departments data
     * Router: /api/department/saveDepartment
     */
    public static saveDepartment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await DepartmentSchema.validateAsync(req.body);
            const user = req.user;
            const department = await DepartmentServices.saveDepartment(req.body);

            if (department) {

                const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const activity = `Created new department ${department.department_name_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Create new Department`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);

                res.status(200).json({ status: 200, message: 'Added department successfully!!', data: department });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get deparmtent by id
     * Router: /api/department/getDepartmentById
     */
    public static getDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await DepartmentIdSchema.validateAsync(req.query);

            const { id } = req.query;
            const department = await DepartmentServices.getDepartmentById(Number(id));
            if (department) {
                res.status(200).json({ status: 200, message: "Department", data: department });
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
     * @description: Update department data by id
     * Router: /api/department/updateDepartmentById
     */
    public static updateDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await DepartmentIdSchema.validateAsync(req.query);
            await DepartmentSchema.validateAsync(req.body);
            const { id } = req.query;
            const user = req.user;
            await DepartmentServices.updateDepartmentById(Number(id), req.body);
            const department = await DepartmentServices.getDepartmentById(Number(id));

            if (department) {
                const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const activity = `Updated department ${req.body.department_name_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Update Department`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);
                res.status(200).json({ status: 200, message: "Department updated successfully", data: department });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Delete deparment by id
     * Router: /api/department/deleteDepartmentById
     */
    public static deleteDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await DepartmentIdSchema.validateAsync(req.query);
            const user = req.user;
            const { id } = req.query;
            let deptName: string | undefined;

            const deptData = await DepartmentServices.getDepartmentById(Number(id));
            if (deptData !== null) {
                deptName = deptData.department_name_admission;
            }
            await DepartmentServices.deleteDepartmentById(Number(id));
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const activity = `Deleted department ${deptName} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;
            const activity_data = {
                userId: user.id,
                name: `${user.nameAsOnMarksheet}(${user.email})`,
                activity: activity,
                activity_name: `Delete department`,
                ip_address: IP
            };
            await ActivityServices.saveActivity(activity_data);

            res.status(200).json({ status: 200, message: 'Department deleted successfully', id: Number(id) });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get the departments with pagination and search
     * Router: /api/department/getDepartmentsPaginationAndSearch
     */
    public static getDepartmentsPaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const count = await DepartmentServices.getDepartmentsCount();
            const departments = await DepartmentServices.getDepartmentsPaginationAndSearch(offset, Number(limit), String(search));

            if (departments) {
                res.status(200).json({ status: 200, message: 'All universities.', data: departments, count: count });
            }
        } catch (error) {
            next(error);
        }
    };

}
