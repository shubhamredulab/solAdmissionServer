import { NextFunction, Request, Response } from 'express';
import logger from '../utils/winston';
import TicketServices from '../services/TicketService';
import UserServices from '../services/UserServices';
import { raiseTicketSchema, checkPage, checkAddTicketComment, checkTicketId, checkSearchTicketData, checkDeleteTicketCommentId, checkYearPage } from '../validator/ticket';
import { ticketComment } from "../types/user";
import { ActivityServices } from '../services/ActivityService';


export default class TicketController {
    /*
    Author: Moin.
    Router: /api/ticket/raiseTicket
    Description: this function use for add the ticket the in the database,
    
    */
    public static raiseTicket = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await raiseTicketSchema.validateAsync(req.body);
            const user = req.user;
            const { registrationNo, email, Grievance, Category, collegeName, courseName } = req.body;
            const ticketStatus: string = 'inProgress';
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const saveData = await TicketServices.saveData(Number(req.user.id), collegeName, courseName, Category, email, Number(registrationNo), Grievance, ticketStatus);
            if (saveData) {
                const users = await UserServices.findUser(req.user.id);
                if (users) {
                    const activity = `Student ${users.nameAsOnMarksheet} (${users.email}) raised a ticket.`;
                    const activity_data = {
                        userId: user.id,
                        name: `${user.nameAsOnMarksheet}(${user.email})`,
                        activity: activity,
                        activity_name: `Student raises a ticket`,
                        ip_address: IP
                    };
                    const activityResult = await ActivityServices.saveActivity(activity_data);
                    if (activityResult) {
                        res.status(200).json({
                            status: 200,
                            data: saveData,
                            message: `Student Raise the Ticket`
                        });
                    } else {
                        res.status(400).json({
                            status: 400,
                            message: `Something went wrong`
                        });
                    }
                }
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    /*
    Author: Moin.
    Router: /api/ticket/getTicket
    Description: this function use for get all ticket the in the database,
    
    */
    public static getTicket = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await checkPage.validateAsync(req.query);
            const OFFSET_LIMIT = 10;
            const { page } = req.query;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
            const allData = await TicketServices.getTicketData(Number(null), Number(null), req.user.id);
            const ticketData = await TicketServices.getTicketData(OFFSET_LIMIT, offsetValue, req.user.id);
            res.json({ status: 200, message: "All ticket data", data: ticketData, totalCount: allData.length });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    /*
    Author: Moin.
    Router: /api/ticket/addTicketComment
    Description: this function use for add the comment on ticket and save in the database,
    
    */
    public static addTicketComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await checkAddTicketComment.validateAsync(req.body);
            const { TicketUserId, TicketId, comment } = req.body;
            const user = req.user;
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            let readComment = ticketComment.FALSE;
            let adminComment = ticketComment.FALSE;
            if (req.user.role == 'STUDENT') {
                readComment = ticketComment.TRUE;
                adminComment = ticketComment.FALSE;

            } else {
                readComment = ticketComment.FALSE;
                adminComment = ticketComment.FALSE;
            }
            const saveData = await TicketServices.saveCommentData(TicketUserId, TicketId, comment, readComment, adminComment);
            if (saveData) {
                if (req.user.role == 'STUDENT') {
                    const ticketStatus: string = 'inProgress';
                    await TicketServices.upDateData(Number(TicketId), String(ticketStatus));
                } else {
                    const ticketStatus: string = 'Done';
                    await TicketServices.upDateData(Number(TicketId), String(ticketStatus));
                }
                const users = await UserServices.findUser(req.user.id);
                if (users) {
                    const activity = `Student ${users.nameAsOnMarksheet} (${users.email}) added a comment on the ticket.`;

                    const activity_data = {
                        userId: user.id,
                        name: `${user.nameAsOnMarksheet}(${user.email})`,
                        activity: activity,
                        activity_name: `Student adds comment on ticket`,
                        ip_address: IP
                    };
                    const activityResult = await ActivityServices.saveActivity(activity_data);
                    if (activityResult) {
                        res.status(200).json({
                            status: 200,
                            data: saveData,
                            message: `Comment added on ticket`
                        });
                    } else {
                        res.status(400).json({
                            status: 400,
                            message: `Something went wrong`
                        });
                    }
                }
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    /*
    Author: Moin.
    Router: /api/ticket/getTicketComment
    Description: this function use for get the comment on ticket ,
    
    */
    public static getTicketComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await checkTicketId.validateAsync(req.query);
            const user = await TicketServices.findUserS(Number(req.query.ticketId));
            if (user) {
                res.status(200).json({
                    status: 200,
                    data: user
                });
            } else {
                res.status(201).json({
                    status: 201,
                    data: user,
                    message: `Comment not added`
                });
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    /*
    Author: Moin.
    Router: /api/ticket/searchTicketData
    Description: this function use for search the data in ticket ,
    
    */
    public static searchTicketData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await checkSearchTicketData.validateAsync(req.body);
            const { values, page } = req.body;
            const OFFSET_LIMIT = 10;
            const offsetValue = (page - 1) * OFFSET_LIMIT;
            const getData = await TicketServices.getTicketData(Number(null), Number(null), req.user.id);
            const searchData = await TicketServices.searchTicketData(values, OFFSET_LIMIT, offsetValue, req.user.role, req.user.id);
            res.status(200).json({ status: 200, message: 'user search successfully', data: searchData, totalCount: getData });

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    /*
    Author: Moin.
    Router: /api/ticket/deleteTicketComment
    Description: this function use for delete the comment on ticket ,
    
    */
    public static deleteTicketComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await checkDeleteTicketCommentId.validateAsync(req.query);
            const { id } = req.query;
            await TicketServices.deleteCommentById(Number(id));
            res.status(200).json({ status: 200, message: 'Comment deleted successfully!!', id: Number(id) });
        } catch (err) {
            logger.error(err);
            next(err);
        }
    };

    /*
  Author: Moin.
  Router: /api/ticket/getYearWiseTicketData
  Description: this function use for get year wise all ticket the in the database,
  
  */
    public static getYearWiseTicketData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await checkYearPage.validateAsync(req.query);
            const OFFSET_LIMIT = 10;
            const { year, page } = req.query;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
            const allData = await TicketServices.getYearWiseTicketDetails(Number(year), Number(null), Number(null), req.user.role, req.user.id);
            const ticketData = await TicketServices.getYearWiseTicketDetails(Number(year), OFFSET_LIMIT, offsetValue, req.user.role, req.user.id);
            res.json({ status: 200, message: "All ticket data", data: ticketData, totalCount: allData.length });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
}
