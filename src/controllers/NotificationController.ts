import { Request, Response, NextFunction } from "express";
import logger from "../utils/winston";
import NotificationServices from "../services/NotificationServices";
import studentNotify from "../services/studentNotifyServices";
import { PreferencesServices } from "../services/PreferencesServices";
import meritlistServices from "../services/MeritlistService";
// import UserServices from "../services/UserServices";

export default class NotificationController {

    public static notifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Id = await PreferencesServices.searchingID(req.body.collegeCode);
            const { collegeCode, courseCode, role, title, notification, status } = req.body;
            const searchID = await meritlistServices.searchID(collegeCode);
            const notify = await NotificationServices.notification(collegeCode, courseCode, role, title, notification, status);
            if (notify) {
                res.status(200).json({ status: 200, message: 'Notification Sent Successfully!', data: notify });
                if (searchID) {
                    for (const pref of Id) {
                        if (pref) {
                            await studentNotify.studentnotify(notify.College_Code, notify.Course_Code, notify.Role, notify.Title, notify.Notification, notify.Status, pref.userId);
                        }
                    }
                }
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static getNotifications = async (req: any, res: Response, next: NextFunction) => {
        try {
            const notified = await NotificationServices.getAdminNotification();
            if (notified) {
                res.status(200).json({ status: 200, message: 'Data Fetched Successfully!', data: notified });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static studentNotifications = async (req: any, res: Response, next: NextFunction) => {
        try {
            const studentNotifyy = await studentNotify.studentId(req.query.studentId);
            if (studentNotifyy) {
                res.status(200).json({ status: 200, message: 'Data Fetched Successfully!', data: studentNotifyy });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static updateStudent = async (req: any, res: Response, next: NextFunction) => {
        try {
            const updateStudent = await studentNotify.updateStudent(req.body.StudentId);
            if (updateStudent) {
                res.status(200).json({ status: 200, message: 'Data Updated Successfully!', data: updateStudent });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static updateAdmin = async (req: any, res: Response, next: NextFunction) => {
        try {
            const updateAdmin = await NotificationServices.updateAdmin();
            if (updateAdmin) {
                res.status(200).json({ status: 200, message: 'Data Updated Successfully!', data: updateAdmin });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

}