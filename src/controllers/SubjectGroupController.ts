import { Request, Response, NextFunction } from "express";
import logger from "../utils/winston";
import SubjectGroupServices from "../services/SubjectGroupServices";
import { SubjectGroupSchema, SubjectGroupIdSchema, CourseId } from "../validator/subjectgroup";
import { jsonParser } from "../utils/functions";
import { ActivityServices } from "../services/ActivityService";

export default class SubjectGroupController {

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get subjectGroups
     * Router: /api/subjectGroup/
     */
    public static allSubjectGroups = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subjectgroups = await SubjectGroupServices.getAll();
            const parseData = await jsonParser(subjectgroups[0]);
            if (subjectgroups) {
                res.status(200).json({ status: 200, message: "All subjectgroups", data: parseData });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Save subjectGroup data
     * Router: /api/subjectGroup/saveSubjectGroup
     */
    public static saveSubjectGroup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectGroupSchema.validateAsync(req.body);
            const user = req.user;
            const subjectgroup = await SubjectGroupServices.saveSubjectGroup(req.body);
            const data = await SubjectGroupServices.getSubjectGroupById(subjectgroup.id);
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            if (subjectgroup) {
                const activity = `Created new subject ${subjectgroup.group_combination_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Create SubjectGroup`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);
                res.status(200).json({ status: 200, message: 'Added subjectgroup successfully!!', data: data[0][0] });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Get subjectGroup by id
     * Router: /api/subjectGroup/getSubjectGroupById
     */
    public static getSubjectGroupById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectGroupIdSchema.validateAsync(req.query);

            const { id } = req.query;
            const subjectgroup = await SubjectGroupServices.getSubjectGroupById(Number(id));
            const parseData = await jsonParser(subjectgroup);
            if (subjectgroup) {
                res.status(200).json({ status: 200, message: 'SubjectGroup', data: parseData[0] });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: Update subjectGroup by id
     * Router: /api/subjectGroup/updateSubjectGroupById
     */
    public static updateSubjectGroupById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectGroupIdSchema.validateAsync(req.query);
            await SubjectGroupSchema.validateAsync(req.body);
            const user = req.user;
            const { id } = req.query;
            await SubjectGroupServices.updateSubjectGroupById(Number(id), req.body);
            const subjectgroup = await SubjectGroupServices.getSubjectGroupById(Number(id));
            const parseData = await jsonParser(subjectgroup[0][0]);
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            if (subjectgroup) {
                const activity = `Updated subjectGroup ${req.body.group_combination_admission} by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;

                const activity_data = {
                    userId: user.id,
                    name: `${user.nameAsOnMarksheet}(${user.email})`,
                    activity: activity,
                    activity_name: `Update SubjectGroup`,
                    ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);
                res.status(200).json({ status: 200, message: 'SubjectGroup updated successfully!!', data: parseData });
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
     * @description: delete subjectGroup by id
     * Router: /api/subjectGroup/deleteSubjectGroupById
     */
    public static deleteSubjectGroupById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SubjectGroupIdSchema.validateAsync(req.query);
            const user = req.user;
            const { id } = req.query;
            let subjectGroupName: string | undefined;

            const subjectGroupData = await SubjectGroupServices.getSubjectGroupById(Number(id));
            if (subjectGroupData !== null) {
                subjectGroupName = subjectGroupData.group_combination_admission;
            }
            await SubjectGroupServices.deleteSubjectGroupById(Number(id));
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const activity = `Deleted subjectGroup ${subjectGroupName}) by superadmin ${user.nameAsOnMarksheet} (${user.email}).`;
            const activity_data = {
                userId: user.id,
                name: `${user.nameAsOnMarksheet}(${user.email})`,
                activity: activity,
                activity_name: `Delete subjectGroup`,
                ip_address: IP
            };
            await ActivityServices.saveActivity(activity_data);
            res.status(200).json({ status: 200, message: 'SubjectGroup deleted successfully!!', id: Number(id) });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static getSubjectGroupByCourseId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId } = req.query;
            const subjectGroups = await SubjectGroupServices.getSubjectGroupByCourseId(Number(courseId));
            if (subjectGroups) {
                res.status(200).json({ status: 200, message: "All subjectgroups by course", data: subjectGroups });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static getGroupData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const groupData = await SubjectGroupServices.getGroupData();
            res.status(200).json({ status: 200, message: 'Group Data', data: groupData });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /*
      Author: Rutuja Patil.
      Router: /api/subjectGroup/getGroupDetails
      Description: this function use for get group details based on the course Name from master_admission_course.
      */

    public static getGroupDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CourseId.validateAsync(req.query);
            const { courseId } = req.query;
            const groupDetails = await SubjectGroupServices.getGroupDetails(Number(courseId));
            res.status(200).json({ status: 200, message: 'Group Details Get successfully', data: groupDetails });
        } catch (err) {
            logger.error(err);
            next(err);
        }
    };


    /**
     * @author: Priyanka Vishwakarma
     * @description: Get subjectGroups with pagination and search
     * Router: /api/subjectGroup/getSubjectGroupsWithPaginationAndSearch
     */
    public static getSubjectGroupsWithPaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const count = await SubjectGroupServices.getSubjectGroupsCount();
            const subjectgroups = await SubjectGroupServices.getSubjectGroupsWithPaginationAndSearch(offset, Number(limit), String(search));

            if (subjectgroups) {
                res.status(200).json({ status: 200, message: 'All subjectgroups.', data: subjectgroups[0], count: count });
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };


}
