import { NextFunction, Request, Response } from 'express';
import logger from '../utils/winston';
import AdmissionActionServices from '../services/AdmissionActionServices';
import { activity } from "../utils/functions";
import moment from 'moment';
import SeriesServices from '../services/SeriesServerice';
import { checkId, checkPagination, seriesAndRegistrationRange } from '../validator/admissionAction';
import { ActivityServices } from '../services/ActivityService';

export default class AdmissionActionController {

    /*
    Author: Pranali Gambhir
    Description: This function is used to get the admission schedule for both UG and PG programs.
    */
    public static getAdmissionSchedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const admissionSchedule = await AdmissionActionServices.getSchedule();

            // Convert date and time to string representation using moment
            const formattedSchedule = admissionSchedule.map((schedule: { startTime: moment.MomentInput; endTime: moment.MomentInput; createdAt: moment.MomentInput; updatedAt: moment.MomentInput; }) => ({
                ...schedule,
                startTime: moment(schedule.startTime).format('YYYY-MM-DDTHH:mm:ss'),
                endTime: moment(schedule.endTime).format('YYYY-MM-DDTHH:mm:ss'),
                createdAt: moment(schedule.createdAt).format('YYYY-MM-DDTHH:mm:ss'),
                updatedAt: moment(schedule.updatedAt).format('YYYY-MM-DDTHH:mm:ss')
            }));
            res.send({ status: 400, message: 'Admission Schedule', data: formattedSchedule });
        } catch (err) {
            logger.error(err);
            next(err);
        }
    };

    /* Author: Pranali Gambhir */
    public static getData = async (req: Request, res: Response) => {
        try {
            const getData = await AdmissionActionServices.getData();

            if (getData) {
                res.status(200).json({ status: 200, message: '', data: getData });
            }
        } catch (error) {
            logger.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    };

    /*Author: PriyaSawant */
    public static addAdmissionType = async (req: Request, res: Response) => {
        try {
            const admissionTypeData = req.body;
            const response = await AdmissionActionServices.addAdmissionType(admissionTypeData);
            const activityData = `${req.user.email} Add admission type`;
            await activity(Number(req.user.id), req.user.nameAsOnMarksheet, activityData);
            res.status(201).json({ status: 201, data: response });
        } catch (error) {
            // Handle errors
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    /*Author: PriyaSawant */
    public static updateStatus = async (req: Request, res: Response) => {
        try {
            const { nameAsOnMarksheet, email, role } = req.user;
            const userId = req.user.id;
            const { changeStatus, id } = req.body;
            const actionData = await AdmissionActionServices.getScheduleById(id);
            const admissionType = actionData?.admissionType;

            const updateUser = await AdmissionActionServices.updateStatus(id, changeStatus);
            if (updateUser) {

                const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

                let statusVerb;
                if (changeStatus === 'Start') {
                    statusVerb = 'started';
                } else if (changeStatus === 'Stop') {
                    statusVerb = 'stopped';
                } else {
                    statusVerb = 'changed';
                }

                let roleVerb;
                if (role === 'SUPER_ADMIN') {
                    roleVerb = 'Superadmin';
                } else if (role === 'ADMIN') {
                    roleVerb = 'Admin';
                } else {
                    roleVerb = 'student';
                }

                const activity = `${roleVerb} ${nameAsOnMarksheet}(${email}) has ${statusVerb} the admission for ${admissionType}.`;

                const activity_data = {
                    userId: userId,
                    name: `${nameAsOnMarksheet}(${email})`,
                    activity: activity,
                    activity_name: 'Admission Status Updation',
                    ip_address: IP
                };
                const activityResult = await ActivityServices.saveActivity(activity_data);
                if (activityResult) {
                    res.status(200).json({ status: 200, message: 'Status Updated successfully', data: updateUser });
                }
            } else {
                res.status(400).json({ status: 400, message: 'Status Not Updated' });
            }
        } catch (error) {
            res.status(500).json({ status: 400, message: 'Something went wrong' });
        }
    };


    /*Author: PriyaSawant */
    public static updateAdmissionSchedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const { admissionType } = req.body;
            const { id, nameAsOnMarksheet, email, role } = req.user;

            const scheduleData = await AdmissionActionServices.updateAdmissionSchedule(data);
            const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            let activity;
            if (role === 'SUPER_ADMIN') {
                activity = `Superadmin ${nameAsOnMarksheet}(${email}) has set the admission schedule for ${admissionType}.`;
            } else if (role === 'ADMIN') {
                activity = `Admin ${nameAsOnMarksheet}(${email}) has set the admission schedule for ${admissionType}.`;
            } else {
                activity = `${role} ${nameAsOnMarksheet}(${email}) has set the admission schedule for ${admissionType}.`;
            }
            const activity_data = {
                userId: id,
                name: `${nameAsOnMarksheet}(${email})`,
                activity: activity,
                activity_name: 'Admission Schedule Setting',
                ip_address: IP
            };
            await ActivityServices.saveActivity(activity_data);
            res.status(200).json({ status: 200, message: 'Admission Schedule for UG updated successfully', data: scheduleData });
        } catch (err) {
            logger.error(err);
            next(err);
        }
    };

    /*
Author: Moin
Description: This function is add the range in series and registration .
*/
    public static addSeriesAndRegistrationRange = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await seriesAndRegistrationRange.validateAsync(req.body);
            const { SelectType, range, admissionType, year, rangeId } = req.body;
            const Data = await SeriesServices.addOrUPdateSeriesAndRegistrationRange(SelectType, range, admissionType, year, rangeId);
            if (typeof Data === 'string') {
                return res.status(400).json({ status: 400, message: Data });
            }
            const activityData = `Admin ${req.user.email} added the range of Series And Registration  `;
            await activity(Number(req.user.id), req.user.nameAsOnMarksheet, activityData);
            res.status(200).json({ status: 200, message: 'Admission Schedule updated successfully', data: Data });
        } catch (err) {
            logger.error(err);
            next(err);
        }
    };
    /*
 Author: Moin
 Description: This function is get series table data.
 */
    public static getSeriesAndRegistrationNumberData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await checkPagination.validateAsync(req.query);
            const { page } = req.query;
            const OFFSET_LIMIT = 10;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;

            const DataCount = await SeriesServices.getSeriesAndRegistrationNumberData();
            const Data = await SeriesServices.getSeriesAndRegistrationNumberDataWithPagination(OFFSET_LIMIT, offsetValue);

            res.status(200).json({ status: 200, data: Data, totalCount: DataCount.length });
        } catch (err) {
            logger.error(err);
            next(err);
        }
    };
    /*
   Author: Moin
   Description: This function is delete Series And Registration Range table data.
   */

    public static deleteSeriesAndRegistrationRange = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            await checkId.validateAsync(req.query);
            const { id } = req.query;
            await SeriesServices.deleteSeriesData(Number(id));
            const activity_data = `ADMIN deleted Series And Registration Range ${id} by ${req.user.nameAsOnMarksheet} ( ${req.user.email} )`;
            await activity(req.user.id, req.user.nameAsOnMarksheet, activity_data);
            res.status(200).json({ status: 200, message: ' deleted successfully!!', id: Number(id) });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

}