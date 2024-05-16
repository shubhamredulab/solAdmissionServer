import { Router } from 'express';
import UserController from '../controllers/UserController';
import Protected from '../middlewares/protected';
const router = Router();
router.get('/getAllPinPurchasedUsers', UserController.getCountByAdmissionType);
router.get('/getStudentData', UserController.getStudentData);
router.get('/getTodaysRegStud', UserController.getTodayRegisteredUsersCount);

// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.put('/updateStudentStatus', UserController.updateStudentStatus);
router.get('/getRoleWiseData', UserController.getRoleWiseData);
router.post('/subAdminRegister', UserController.subAdminRegister, UserController.assignClientRoleToUser);
router.get('/searchData', UserController.searchData);
router.put('/ChangeAdminStatus', UserController.changeAdminStatus);
router.get('/UserRoles', UserController.getUserRoles);
router.put('/saveData', UserController.saveData);
router.get('/userData', UserController.userData);
router.post('/savePersonalData', UserController.addUserDetails);
router.get('/getPersonalData', UserController.getPersonalData);
router.get('/checkStepper', UserController.checkStepper);
router.put('/updateStudentDetails', UserController.updateStudentDetails);
router.get('/getUserDetails', UserController.getUserDetails);
router.get('/getStudentsPersonalData', UserController.getStudentsPersonalData);
router.get('/getSingleUserPersonalEduDocData', UserController.getSingleUserPersonalEduDocData);
router.get('/getStates', UserController.getStates);
router.get('/getCityState', UserController.getCityState);
router.post('/sendEmail', UserController.sendEmail);
router.get('/getAllUsersYearWise', UserController.getAllUsersYearWise);
router.get('/getFilterData', UserController.getfilteredData);
router.get('/getDataCountInDateRange', UserController.getDataInDateRange);
router.get('/getDataCountForDay', UserController.getDataForDay);
router.post('/savePHDPersonalData', UserController.savePHDPersonalData);
router.get('/getYearWiseAdmin', UserController.getYearWiseAdmin);
router.get('/SearchDataYearWise', UserController.SearchDataYearWise);
export default router;


