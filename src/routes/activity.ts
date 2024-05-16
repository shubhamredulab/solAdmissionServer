import { Router } from 'express';
import ActivityController from '../controllers/ActivityController';
import Protected from '../middlewares/protected';
const router = Router();
router.get('/getYearWiseActivity', ActivityController.getYearWiseActivity);
router.get('/searchYearWiseData', ActivityController.searchYearWiseData);
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/getAllActivity', ActivityController.getAllActivity);
router.get('/searchData', ActivityController.searchData);
router.get('/onSearchName', Protected, ActivityController.onSearchName);
router.get('/onSearchActivityName', Protected, ActivityController.onSearchActivityName);
router.get('/onSearchDate', Protected, ActivityController.onSearchDate);
router.post('/saveActivity', ActivityController.saveActivity);
export default router;

