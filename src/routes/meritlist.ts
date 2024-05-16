import { Router } from 'express';
import MeritListController from '../controllers/MeritlistController';
import Protected from '../middlewares/protected';

const router = Router();
router.get('/getMeritData', MeritListController.getMeritData);
router.post('/searchData', MeritListController.searchData);
router.get('/getYearWiseMeritData', MeritListController.getYearWiseMeritData);
router.get('/getAllYearWiseMeritListVerificationTab', MeritListController.getAllYearWiseMeritListVerificationTab);


// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.post('/getMeritList', MeritListController.getMeritList);
router.post('/saveMeritListData', MeritListController.saveMeritListData);
router.post('/uploadExcel', MeritListController.uploadExcels);
router.post('/uploadPDF', MeritListController.uploadPDFs);
router.put('/revokeData', MeritListController.revokeData);
router.post('/addAssignCollege', MeritListController.addAssignCollege);
router.get('/getAllMeritListForVerificationTab', MeritListController.getAllMerilistForVerificationTab);
router.get('/changeStatus', MeritListController.changeStatus);
router.post('/addRemark', MeritListController.addRemark);

export default router;