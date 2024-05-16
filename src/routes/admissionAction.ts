import { Router } from 'express';
import AdmissionAction from '../controllers/AdmissionAction';
import Protected from '../middlewares/protected';
const router = Router();

// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.get('/getAdmissionSchedule', AdmissionAction.getAdmissionSchedule);
router.get('/getData', AdmissionAction.getData);

/*Author: PriyaSawant
Description: This router add the addmission type from admin side */
router.post('/addAdmissionType', AdmissionAction.addAdmissionType);

/*Author: PriyaSawant
Description: This router update the addmission status from admin side */
router.post('/updateStatus', AdmissionAction.updateStatus);

/*Author: PriyaSawant
Description: This router set the addmission Schedule (start date to end date) from admin side*/
router.post('/updateAdmissionSchedule', AdmissionAction.updateAdmissionSchedule);
/*Author: Moin
Description: This router  add Series And Registration Range*/
router.post('/addSeriesAndRegistrationRange', AdmissionAction.addSeriesAndRegistrationRange);
/*Author: Moin
Description: This router  get Series And Registration Number Data*/
router.get('/getSeriesAndRegistrationNumberData', AdmissionAction.getSeriesAndRegistrationNumberData);
/*Author: Moin
Description: This router  delete Series And Registration Number Data*/
router.delete('/deleteSeriesAndRegistrationRange', AdmissionAction.deleteSeriesAndRegistrationRange);
export default router;