import notifications from "../entity/notifications";
import { AppDataSource } from "../data-source";
const NotificationsRepository = AppDataSource.getRepository(notifications);

export default class NotificationServices {

    public static notification = async (collegeCode: string, courseCode: string, role: string, title: string, notification: string, status: string) => {
        return await NotificationsRepository.save({ College_Code: collegeCode, Course_Code: courseCode, Role: role, Title: title, Notification: notification, Status: status });
    };

    public static getAdminNotification = async () => {
        return await NotificationsRepository.find({ where: { Status: 'True' } });
    };

    static updateAdmin = async () => {
        const updateRole = await NotificationsRepository
            .createQueryBuilder()
            .update(notifications)
            .set({ Status: 'False' })
            .where("Status = :Status", { Status: 'True' })
            .execute();
        return updateRole;
    };

}