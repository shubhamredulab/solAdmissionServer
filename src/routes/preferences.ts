import { Router } from 'express';
import PreferencesController from '../controllers/PreferencesController';
import Protected from '../middlewares/protected';
const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.post('/savePreferenceData', PreferencesController.savePreferenceData); 
// router.delete('/deletePrefrence', Protected, PrefrencesController.deletePrefrence);
router.get('/getSubmitData', PreferencesController.getSubmitData);
router.get('/getPreferencesData', PreferencesController.getPreferencesData);
router.get('/getTotalPreferences', PreferencesController.getTotalPreferences);


export default router;