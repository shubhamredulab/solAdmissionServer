import { Router } from 'express';
import PhdEduDetailsController from '../controllers/PhdEduDetailsController';
import Protected from '../middlewares/protected';
const router = Router();

router.use(Protected);
// Routes that will automatically check the middleware
router.post('/savePhdEduData', PhdEduDetailsController.savePhdEduData);
router.get('/getPhdEduData', PhdEduDetailsController.getPhdEduData);
router.post('/saveEntranceDetails', PhdEduDetailsController.saveEntranceDetails);
router.get('/getEntranceDetails', PhdEduDetailsController.getEntranceDetails);
router.delete('/deleteEntranceDetails', PhdEduDetailsController.deleteEntranceDetails);

export default router;


