import { Router } from 'express';
import EduDetailsController from '../controllers/EduDetailsController';
import Protected from '../middlewares/protected';
const router = Router();
router.get('/getEducationalData', EduDetailsController. getEducationalData);
router.get('/EducationDetails', EduDetailsController.EducationDetails);
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.post('/saveEduData', EduDetailsController.addEduDetails);
router.get('/getEduData', EduDetailsController.getEduData); 
router.put('/updateEducationalDetails', EduDetailsController.updateEducationalDetails);
// router.post('/savePrcentage', EduDetailsController.savePrcentage);
router.post('/addPGDetails', Protected, EduDetailsController.addPGDetails); 
router.get('/getPGDetails', Protected, EduDetailsController.getPGDetails);
router.delete('/deletePGDetails', Protected, EduDetailsController.deletePGDetails);
router.get('/getPGDetailById', Protected, EduDetailsController.getPGDetailById);

export default router;