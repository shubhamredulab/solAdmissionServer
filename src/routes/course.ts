import { Router } from "express";
import CourseController from "../controllers/CourseController";
import Protected from "../middlewares/protected";
const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.get('/getDataByCourseName', CourseController.getDataByCourseName);
router.get('/getAdminWiseCourse', CourseController.getAdminWiseCourse);

router.use(Protected);
// Routes that will automatically check the middleware
router.get('/', CourseController.allCourses);
router.post('/saveCourse', CourseController.saveCourse);
router.get('/getCourseById', CourseController.getCourseById);
router.put('/updateCourseById', CourseController.updateCourseById);
router.delete('/deleteCourseById', CourseController.deleteCourseById);
router.get('/getsubjectgroup', CourseController.getsubjectgroup);
router.get('/getDegreeData', CourseController.getDegreeData);
router.get('/getCoursesWithPaginationAndSearch', CourseController.getCoursesWithPaginationAndSearch);
router.get('/getCourseData', CourseController.getCourseData); 
router.get('/getAssignedCourses', CourseController.getAssignedCourses);
router.get('/getAllCourseData', CourseController.getAllCourseData);
router.get('/getCourseDetails', CourseController.getCourseDetails);

export default router;