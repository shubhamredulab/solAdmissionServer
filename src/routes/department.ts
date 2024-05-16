import { Router } from "express";
import DepartmentController from "../controllers/DepartmentController";
import Protected from "../middlewares/protected";

const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/', DepartmentController.allDepartments);
router.post('/saveDepartment', DepartmentController.saveDepartment);
router.get('/getDepartmentById', DepartmentController.getDepartmentById);
router.put('/updateDepartmentById', DepartmentController.updateDepartmentById);
router.delete('/deleteDepartmentById', DepartmentController.deleteDepartmentById);
router.get('/getDepartmentsPaginationAndSearch', DepartmentController.getDepartmentsPaginationAndSearch);

export default router;