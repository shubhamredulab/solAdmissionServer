import { Router } from "express";
import SubjectPhdController from "../controllers/SubjectPhdController";
import Protected from "../middlewares/protected";

const router = Router();
router.use(Protected);

router.get('/', SubjectPhdController.getAllSubPhd);
router.post('/saveSubjectPhd', SubjectPhdController.saveSubjectPhd);
router.get('/getSubjectPhdById', SubjectPhdController.getSubjectPhdById);
router.put('/updateSubjectPhdById', SubjectPhdController.updateSubjectPhdById);
router.delete('/deleteSubjectPhdById', SubjectPhdController.deleteSubjectPhdById);
router.get('/getSubjectsPhdWithPaginationAndSearch', SubjectPhdController.getSubjectsPhdWithPaginationAndSearch);
router.get('/getSubjectPhdData', SubjectPhdController.getSubjectPhdData);
export default router;