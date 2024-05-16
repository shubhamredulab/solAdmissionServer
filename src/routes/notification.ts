import { Router } from "express";
import NotificationController from "../controllers/NotificationController";
import Protected from "../middlewares/protected";

const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.post('/notifications', NotificationController.notifications);
router.get('/getNotifications', NotificationController.getNotifications);
router.get('/studentNotifications', NotificationController.studentNotifications);
router.post('/updateStudent', NotificationController.updateStudent);
router.post('/updateAdmin', NotificationController.updateAdmin);

export default router;