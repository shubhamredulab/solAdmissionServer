import { Router } from 'express';
import excelDownloadController from '../controllers/excelDownloadControllers';
import Protected from '../middlewares/protected';
const router = Router();

// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);

router.post('/saveExcels', excelDownloadController.saveExcels);

export default router;