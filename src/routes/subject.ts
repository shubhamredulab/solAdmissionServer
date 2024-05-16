import { Router } from "express";
import SubjectController from "../controllers/SubjectController";
import Protected from "../middlewares/protected";

const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/', SubjectController.allSubjects);
router.post('/saveSubject', SubjectController.saveSubject);
router.get('/getSubjectById', SubjectController.getSubjectById);
router.put('/updateSubjectById', SubjectController.updateSubjectById);
router.delete('/deleteSubjectById', SubjectController.deleteSubjectById);
router.get('/getSubjectsWithPaginationAndSearch', SubjectController.getSubjectsWithPaginationAndSearch);
router.get('/getSubjectData', SubjectController.getSubjectData);
export default router;