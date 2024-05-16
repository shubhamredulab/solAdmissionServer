import { Router } from 'express';
import AccessController from '../controllers/AccessController';
import Protected from '../middlewares/protected';
const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/getAccessData', AccessController.getAccessUsersData);
router.post('/allowMenuAccessToAdmin', AccessController.allowMenuAccessToAdmin);
router.put('/changeDegree', AccessController.changeDegree);
router.post('/allowColumnAccessToAdmin', AccessController.allowColumnAccessToAdmin);
router.put('/saveCollegeAndCourse', AccessController.saveCollegeAndCourse);
router.delete('/deleteCourse', AccessController.deleteCourse);
router.post('/deleteCollege', Protected, AccessController.deleteCollege);
export default router;