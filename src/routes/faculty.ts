import { Router } from "express";
import FacultyController from "../controllers/FacultyController";
import Protected from "../middlewares/protected";

const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/', FacultyController.allFaculties);
router.get('/getFacultyById', FacultyController.getFacultyById);
router.post('/saveFaculty', FacultyController.saveFaculty);
router.put('/updateFacultyById', FacultyController.updateFacultyById);
router.delete('/deleteFacultyById', FacultyController.deleteFacultyById);
router.get('/getFacultyWithPaginationAndSearch', FacultyController.getFacultyWithPaginationAndSearch);
export default router;