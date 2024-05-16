import { Router } from 'express';
import Protected from '../middlewares/protected';
import TicketController from '../controllers/TicketController';
const router = Router();
// Moin
// This function is used when you use middleware in the router. You need to write the route after this function. If you do not require middleware, you can write the route before this function.
router.use(Protected);
// Routes that will automatically check the middleware
router.post('/raiseTicket', TicketController.raiseTicket);
router.get('/getTicket', TicketController.getTicket);
router.post('/addTicketComment', TicketController.addTicketComment);
router.get('/getTicketComment', TicketController.getTicketComment);
router.post('/searchTicketData', TicketController.searchTicketData);
router.delete('/deleteTicketComment', TicketController.deleteTicketComment);
router.get('/getYearWiseTicketData', TicketController.getYearWiseTicketData);

export default router;