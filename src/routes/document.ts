import { Router } from 'express';
import DocumentController from '../controllers/DocumentController';
import Protected from '../middlewares/protected';
import{extraDocFile, fileUploads} from '../utils/multer';
const router = Router();
router.post('/uploadExtraDoc', extraDocFile('file'), DocumentController.uploadExtraDoc);
router.delete('/deleteDocc', DocumentController.deleteDocc);
router.get('/getImage', DocumentController.getImage);
router.post('/downloadAdmissionForm', DocumentController.downloadAdmissionForm);
router.post('/downloadPhdAdmissionForm', DocumentController.downloadPhdAdmissionForm);

// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function. 
router.use(Protected);
// Routes that will automatically check the middleware
router.post('/uploadDocuments', fileUploads('file'), DocumentController.addDocDetails); 
router.get('/getDocuments', DocumentController.getDocuments);
router.delete('/deleteDoc', DocumentController.deleteDoc);
router.get('/getDocumentsData/:userId', DocumentController.getDocumentsData);
router.post('/setDocErrata', DocumentController.setDocErrata);
router.get('/getReqDocuments', DocumentController.getReqDocuments);
router.get('/getTotalPhotos', DocumentController.getTotalPhotosCount);
router.get('/forErrata', DocumentController.forErrata);
router.get('/searchDocData', DocumentController.searchDocData);
router.post('/verifyDocument', DocumentController.verifyDocumentById);
router.post('/uploadErrataDocuments', fileUploads('file'), DocumentController.uploadErrataDocuments); 
router.post('/downloadApplicationForm', DocumentController.downloadApplicationForm);

export default router;

