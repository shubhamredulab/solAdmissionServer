import { Router } from 'express';
import FacultySubjectController from '../controllers/FacultySubjectController';
import Protected from '../middlewares/protected';
const router = Router();

router.use(Protected);
router.get('/getSubjectName', FacultySubjectController.getSubjectName);
router.get('/getFacultySubjectData', FacultySubjectController.getFacultySubjectData);
router.delete('/deleteFacultySubjectById', FacultySubjectController.deleteFacultySubjectById);
router.post('/saveFacultySubject', FacultySubjectController.saveFacultySubject);
router.put('/updateFacultySubject', FacultySubjectController.updateFacultySubject);
router.get('/getFacultySubjectPHDWithPaginationAndSearch', FacultySubjectController.getFacultySubjectPHDWithPaginationAndSearch);

export default router;