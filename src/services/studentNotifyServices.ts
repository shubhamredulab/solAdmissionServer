import { AppDataSource } from "../data-source";
import studentnotification from "../entity/studentNotification";
const NotificationsRepository = AppDataSource.getRepository(studentnotification);

export default class studentNotify {

    public static studentnotify = async (collegeCode: string, courseCode: string, role: string, title: string, notification: string, status: string, StudentId: number) => {
        return await NotificationsRepository.save({ College_Code: collegeCode, Course_Code: courseCode, Role: role, Title: title, Notification: notification, Status: status, StudentId: StudentId });
    };

    public static studentNotifications = async (StudentId: any) => {
        return await NotificationsRepository.findOne({ where: { StudentId: StudentId } });
    };

    public static studentId = async (StudentId: number) => {
        return await NotificationsRepository.find({ where: { StudentId: StudentId, Status: 'True' } });
    };

    static updateStudent = async (StudentId: any) => {
        const updateRole = await NotificationsRepository
            .createQueryBuilder()
            .update(studentnotification)
            .set({ Status: 'False' })
            .where("StudentId = :StudentId", { StudentId: StudentId })
            .execute();
        return updateRole;
    };

}