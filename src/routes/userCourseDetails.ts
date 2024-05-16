import { Router } from 'express';
import UserCourseDetailsController from '../controllers/UserCourseDetailsController';
import Protected from '../middlewares/protected';
const router = Router();

router.use(Protected);
// Routes that will automatically check the middleware
router.get('/getCollegeReport', UserCourseDetailsController.getCollegeReport);
router.get('/getFilteredData', UserCourseDetailsController.filterData);
router.get('/', UserCourseDetailsController.viewApplications);
router.post('/addCommentAndStatus', UserCourseDetailsController.addCommentAndStatus);
router.get('/getTotalApplication', Protected, UserCourseDetailsController.getTotalApplication);
router.get('/getNewApp', Protected, UserCourseDetailsController.getNewApp);
router.get('/getAcceptedApp', Protected, UserCourseDetailsController.getAcceptedApp);
router.get('/getRejectApp', Protected, UserCourseDetailsController.getRejectApp);
router.get('/getHoldApp', Protected, UserCourseDetailsController.getHoldApp);
router.post('/saveAccept', Protected, UserCourseDetailsController.saveAccept);
router.post('/saveReject', Protected, UserCourseDetailsController.saveReject);
router.post('/onHold', Protected, UserCourseDetailsController.onHold);
router.post('/resendApp', Protected, UserCourseDetailsController.resendApp);
router.get('/joinForCollege', Protected, UserCourseDetailsController.joinForCollege);
router.get('/joinForApp', Protected, UserCourseDetailsController.joinForApp);
router.get('/joinForReject', Protected, UserCourseDetailsController.joinForReject);
router.get('/joinForAccept', Protected, UserCourseDetailsController.joinForAccept);
router.get('/joinForHold', Protected, UserCourseDetailsController.joinForHold);
router.post('/addCommentAndStatusForUniversity', UserCourseDetailsController.addCommentAndStatusForUniversity);
router.get('/getApplicationsForUniversity', UserCourseDetailsController.getApplicationsForUniversityTab);
router.post('/readyToPayUserData', Protected, UserCourseDetailsController.readyToPayUserData);
export default router;