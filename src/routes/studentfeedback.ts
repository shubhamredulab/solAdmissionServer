import { Router } from 'express';
import StudentFeedbackController from '../controllers/StudentFeedbackController';
import Protected from '../middlewares/protected';
const router = Router();

router.use(Protected);
router.post('/saveStudentFeedback', StudentFeedbackController.saveStudentFeedback);
router.get('/checkEntry', StudentFeedbackController.checkEntry);
export default router;