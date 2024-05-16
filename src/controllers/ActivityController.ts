import { Response, Request } from 'express';
import { ActivityServices } from '../services/ActivityService';
import { YearWiseActivity, pageId, searchData, searchYearWiseData } from '../validator/activity';

export default class ActivityController {
    /*
    Author: Moin.
    Router: /api/activity/getAllActivity
    Description: this function use for get the All activity data ,
    */
    public static getAllActivity = async (req: Request, res: Response) => {
        try {
            await pageId.validateAsync(req.query);
            const OFFSET_LIMIT = 10;
            const { page } = req.query;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
            const user = await ActivityServices.getActivityData();
            const userData = await ActivityServices.TotalGetActivityData(OFFSET_LIMIT, offsetValue);
            res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user.length });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    };
    /*
    Author: Moin.
    Router: /api/activity/searchData
    Description: this function use for search  activity which you want ,
    */
    public static searchData = async (req: Request, res: Response) => {
        try {
            await searchData.validateAsync(req.query);
            const OFFSET_LIMIT = 10;
            const { value, page } = req.query;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
            const user = await ActivityServices.getActivityData();
            const userData = await ActivityServices.getSearchData(String(value), OFFSET_LIMIT, offsetValue);
            res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user });
        } catch (error) {
            res.status(400).json({ message: 'Something went wrong' });
        }
    };

    /*
    Author: Priya Sawant.
    Router: /api/activity/onSearchName
    Description: this function use for search Name activity which you want ,
    */
    public static onSearchName = async (req: Request, res: Response) => {
        try {
            await searchData.validateAsync(req.query);
            const OFFSET_LIMIT = 10;
            const { value, page } = req.query;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
            const user = await ActivityServices.getActivityData();
            const userData = await ActivityServices.onSearchName(String(value), OFFSET_LIMIT, offsetValue);
            res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user });
        } catch (error) {
            res.status(400).json({ message: 'Something went wrong' });
        }
    };

    /*
    Author: Priya Sawant.
    Router: /api/activity/onSearchActivityName
    Description: this function use for search Activity Name activity which you want ,
    */
    public static onSearchActivityName = async (req: Request, res: Response) => {
        try {
            await searchData.validateAsync(req.query);
            const OFFSET_LIMIT = 10;
            const { value, page } = req.query;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
            const user = await ActivityServices.getActivityData();
            const userData = await ActivityServices.onSearchActivityName(String(value), OFFSET_LIMIT, offsetValue);
            res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user });
        } catch (error) {
            res.status(400).json({ message: 'Something went wrong' });
        }
    };

    /*
    Author: Priya Sawant.
    Router: /api/activity/onSearchName
    Description: this function use for search Date activity which you want ,
    */
    public static onSearchDate = async (req: Request, res: Response) => {
        try {
            await searchData.validateAsync(req.query);
            const OFFSET_LIMIT = 10;
            const { value, page } = req.query;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
            const user = await ActivityServices.getActivityData();
            const userData = await ActivityServices.onSearchDate(String(value), OFFSET_LIMIT, offsetValue);
            res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user });
        } catch (error) {
            res.status(400).json({ message: 'Something went wrong' });
        }
    };

    /*
       Author: Pranali Gambhir
       Router: /api/activity/saveActivity
       Description: This function used to save activity after download the application form at Admin side.
       */
    public static saveActivity = async (req: Request, res: Response) => {
        try {
            const user = req.user;
            const userData = req.body.data;
            const formattedActivity = ` Downloaded Application form of ${userData.admissionType} student ${userData.nameAsOnMarksheet}(${userData.email})`;
            const data = {
                userId: user.id,
                name: `${user.nameAsOnMarksheet}(${user.email})`,
                activity: formattedActivity
            };
            await ActivityServices.saveActivity(data);
        } catch (error) {
            res.status(400).json({ message: 'Something went wrong' });
        }
    };

    /*
  Author: Moin.
  Router: /api/activity/getYearWiseActivity
  Description: this function use for get the All activity  data on year wise ,
  */
    public static getYearWiseActivity = async (req: Request, res: Response) => {
        try {
            await YearWiseActivity.validateAsync(req.query);
            const { year, page } = req.query;
            const OFFSET_LIMIT = 10;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
            const user = await ActivityServices.YearWiseActivityData(Number(year));
            const userData = await ActivityServices.getYearWiseActivityData(Number(year), OFFSET_LIMIT, offsetValue);
            res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user.length });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    };

    /*
    Author: Moin.
    Router: /api/activity/searchYearWiseData
    Description: this function use for search year wise activity which you want ,
    */
    public static searchYearWiseData = async (req: Request, res: Response) => {
        try {
            await searchYearWiseData.validateAsync(req.query);
            const OFFSET_LIMIT = 10;
            const { year, value, page } = req.query;
            const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
            const user = await ActivityServices.getYearWiseActivityData(Number(year), Number(null), Number(null));
            const userData = await ActivityServices.searchYearWiseData(Number(year), String(value), OFFSET_LIMIT, offsetValue);
            res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user });
        } catch (error) {
            res.status(400).json({ message: 'Something went wrong' });
        }
    };
}
