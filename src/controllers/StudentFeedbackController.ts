import { Request, Response, NextFunction } from 'express';
import logger from '../utils/winston';
import StudentFeedbackServices from '../services/StudentFeedbackService';
export default class StudentFeedbackController {

    /**
     * @author: Rutuja Patil
     * @description: This function used to save student feedback form data in master_admission_student_feedback table.
     * @router : /api/studentfeedback/saveStudentFeedback
    * */
    public static saveStudentFeedback = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;
            const admissionType = req.user.admissionType;
            const studentFeedback = {
                userId,
                admissionType,
                ...req.body
            };
            const saveFeedback = await StudentFeedbackServices.saveStudentFeedback(studentFeedback);
            return res.status(200).json({ status: 200, message: "Student feedback saved successfully", data: saveFeedback });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };


    /**
     * @author: Rutuja Patil
     * @description: This function used to check the entry of student feedback is in master_admission_student_feedback table or not.
     * @router : /api/studentfeedback/checkEntry
    * */
    public static checkEntry = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.query;
            const checkEntryofFeedback = await StudentFeedbackServices.checkEntry(Number(userId));
            return res.status(200).json({ status: 200, message: "Entry check", data: checkEntryofFeedback });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
}