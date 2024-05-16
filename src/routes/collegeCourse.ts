import { Router } from "express";
import CollegeCourseController from "../controllers/CollegeCourseController";
import Protected from "../middlewares/protected";

const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/', CollegeCourseController.allCollegCourse);
router.get('/getCollegeCourseById', CollegeCourseController.getCollegeCourseById);
router.post('/saveCollegeCourse', CollegeCourseController.saveCollegeCourse);
router.put('/updateCollegeCourseById', CollegeCourseController.updateCollegeCourseById);
router.delete('/deleteCollegeCourseById', CollegeCourseController.deleteCollegeCourseById);
router.get('/getcourse', CollegeCourseController.getCorseCollegeWise); 
router.get('/getCollegeCoursesPaginationAndSearch', CollegeCourseController.getCollegeCoursesPaginationAndSearch);
router.get('/getPreferenceData', CollegeCourseController.getPreferenceData);
router.get('/getCollegeWiseCourse', CollegeCourseController.getCollegeWiseCourse);
router.get('/getUniversityWiseCollegeCourseData', Protected, CollegeCourseController.getUniversityWiseCollegeCourseData);
router.post('/incrementIntakes', CollegeCourseController.incrementIntakes);
router.post('/decrementIntakes', CollegeCourseController.decrementIntakes);

export default router;