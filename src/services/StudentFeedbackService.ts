import StudentFeedback from '../entity/StudentFeedback';
import { AppDataSource } from '../data-source';
const StudentFeedbackRepository = AppDataSource.getRepository(StudentFeedback);
export default class StudentFeedbackServices {

    /**
    * @author: Rutuja Patil
    * @description: This function used to save student feedback form data in master_admission_student_feedback table.
   * */
    public static saveStudentFeedback = async (studentFeedback: StudentFeedback) => {
        return await StudentFeedbackRepository.save(studentFeedback);
    };

    /**
     * @author: Rutuja Patil
     * @description: This function used to check the entry of student feedback is in master_admission_student_feedback table or not.
    * */
    public static checkEntry = async (userId: number) => {
        return await StudentFeedbackRepository.findOne({ where: { userId: userId } });
    };
}