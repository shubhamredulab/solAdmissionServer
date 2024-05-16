import { Router } from 'express';
import CollegeController from '../controllers/CollegeController';
import { collegeLogo } from '../utils/multer';
import Protected from '../middlewares/protected';
const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/', CollegeController.getCollegeData); 
router.get('/getCollegeById', CollegeController.getCollegeById);
router.post('/saveCollege', CollegeController.saveCollege);
router.put('/updateCollegeById', CollegeController.updateCollegeById);
router.delete('/deleteCollegeById', CollegeController.deleteCollegeById);
router.post('/uploadCollegeLogo', collegeLogo('college_logo_admission'), CollegeController.uploadCollegeLogo);
router.delete('/deleteCollegeLogoById', CollegeController.deleteCollegeLogoById);
router.get('/getDataByCollegeName', CollegeController.getDataByCollegeName);
router.get('/getCollegeData', CollegeController.getCollegeDatas);
router.get('/getAllCollegesData', CollegeController.getAllCollegesData);
router.get('/getDataOfCollege', CollegeController.getDataOfCollege);
router.get('/getCollegePaginationAndSearch', CollegeController.getCollegePaginationAndSearch);
router.get('/getColleges', CollegeController.getColleges);
router.get('/getDataCollege', CollegeController.getDataCollege);
router.get('/getCollegeDetails', CollegeController.getCollegeDetails);
router.get('/getAdminCollegeData', CollegeController.getAdminCollegeData);
router.get('/getAllCollegeData', CollegeController.getAllCollegeData); 
router.get('/getSfcConvocation', CollegeController.getSfcConvocation); 
router.post('/verifyApplication',CollegeController.verifyApplication);


export default router;