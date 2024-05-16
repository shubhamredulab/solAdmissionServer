import { Router } from "express";
import UniversityController from "../controllers/UniversityController";
import Protected from "../middlewares/protected";
const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/', UniversityController.getAllUniversities);
router.post('/saveUniversity', UniversityController.saveUniversity);
router.put('/updateUniversity', UniversityController.updateUniversity);
router.get('/universityById', UniversityController.getUniversityById);
router.delete('/deleteUniversityById', UniversityController.deleteUniversityById);
router.get('/getAllUniversityPaginationAndSearch', UniversityController.getAllUniversityPaginationAndSearch);

export default router;