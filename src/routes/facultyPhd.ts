import { Router } from "express";
import FacultyPhdController from "../controllers/FacultyPhdController";
import Protected from "../middlewares/protected";

const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/', FacultyPhdController.getAllFacultyPhd);
router.post('/saveFacultyPhd', FacultyPhdController.saveFacultyPhd);
router.put('/updateFacultyPhdById', FacultyPhdController.updateFacultyPhdById);
router.delete('/deleteFacultyPhdById', FacultyPhdController.deleteFacultyPHDById);
router.get('/getFacultyPHDWithPaginationAndSearch', FacultyPhdController.getFacultyPHDWithPaginationAndSearch);
export default router;