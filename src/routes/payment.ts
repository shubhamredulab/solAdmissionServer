import { Router } from 'express';
import PaymentController from '../controllers/Payment';
import Protected from '../middlewares/protected';
const router = Router();

// router.post('/success-redirect-url', PaymentController.paymentSuccess);
// router.post('/cancel-redirect-url', PaymentController.paymentCancel);
router.get('/getTransaction', PaymentController.getTransactionByOrderId);
router.get('/getPaymentReceipt', PaymentController.getPaymentReceipt);
router.get('/downloadFiles', PaymentController.downloadFiles);
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
// router.get('/downloadRecipt', PaymentController.downloadRecipt);

export default router;