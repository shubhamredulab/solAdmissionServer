import { Router } from "express";
import SubjectGroupController from "../controllers/SubjectGroupController";
import Protected from "../middlewares/protected";
const router = Router();
router.get('/getGroupData', SubjectGroupController.getGroupData);

// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/', SubjectGroupController.allSubjectGroups);
router.post('/saveSubjectGroup', SubjectGroupController.saveSubjectGroup);
router.put('/updateSubjectGroupById', SubjectGroupController.updateSubjectGroupById);
router.get('/getSubjectGroupById', SubjectGroupController.getSubjectGroupById);
router.delete('/deleteSubjectGroupById', SubjectGroupController.deleteSubjectGroupById);
router.get('/getSubjectGroupByCourseId', SubjectGroupController.getSubjectGroupByCourseId);
router.get('/getGroupDetails', SubjectGroupController.getGroupDetails);
router.get('/getSubjectGroupsWithPaginationAndSearch', SubjectGroupController.getSubjectGroupsWithPaginationAndSearch);
export default router;