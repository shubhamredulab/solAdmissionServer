import { AppDataSource } from '../data-source';
import { ActivityTracking } from '../entity/ActivityTracking';
const activityRepository = AppDataSource.getRepository(ActivityTracking);
export class ActivityServices {
    /**
    * @author Moin
    * @description This function is used to save activity data in the table.
    */
    public static createData = async (id: number, name: string, data: string) => {
        const createData = await activityRepository.save({ userId: id, name: name, activity: data });
        return createData;
    };
    /**
   * @author Moin
   * @description Gets the activity data for the client side.
   */

    public static getActivityData = async () => {
        const query =
            "SELECT * FROM master_admission_activity_tracking as a  ORDER BY a.createdAt DESC ";

        const adminUsers = activityRepository.query(query);
        return adminUsers;
    };
    /**
     * @author Moin
     * @description Gets the total activity data from the table.
     */

    public static TotalGetActivityData = async (limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + ' OFFSET ' + offset;
        }
        let query =
            "SELECT * FROM master_admission_activity_tracking as a  ORDER BY a.createdAt DESC ";
        query += limitOffset;
        const totalData = activityRepository.query(query);
        return totalData;

    };
    /**
     * @author Moin
     * @description This function is used to search data in the activity tables.
     */

    public static getSearchData = async (value: string, limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query = "SELECT  u.* FROM `master_admission_activity_tracking` as u  WHERE ( u.activity like '%" + value + "%' or  u.name like '%" + value + "%' or u.userId like '%" + value + "%')";
        query += limitOffset;
        const data = activityRepository.query(query);
        return data;
    };

    /*
    Author: Priya Sawant
    Description: this function use to search Name the data in the activity tables 
    */
    public static onSearchName = async (value: string, limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query = "SELECT  u.* FROM `master_admission_activity_tracking` as u  WHERE ( u.name like '%" + value + "%')";
        query += limitOffset;
        const data = activityRepository.query(query);
        return data;
    };

    /*
    Author: Priya Sawant
    Description: this function use to search Activity Name the data in the activity tables 
    */
    public static onSearchActivityName = async (value: string, limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query = "SELECT  u.* FROM `master_admission_activity_tracking` as u  WHERE ( u.activity_name like '%" + value + "%')";
        query += limitOffset;
        const data = activityRepository.query(query);
        return data;
    };

    /*
    Author: Priya Sawant
    Description: this function use to search Date the data in the activity tables 
    */
    public static onSearchDate = async (value: string, limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query = "SELECT  u.* FROM `master_admission_activity_tracking` as u  WHERE ( u.updatedAt like '%" + value + "%')";
        query += limitOffset;
        const data = activityRepository.query(query);   
        return data;
    };

    /*
    Author: Pranali Gambhir
    Description: This function is used to save all activities of admin side in table 
    */
    public static saveActivity = async (data: object) => {
        return await activityRepository.save(data);
    };

    /**
     * @author Moin
     * @description Gets the year-wise activity data for the client side.
     */

    public static getYearWiseActivityData = async (year: number, limit: number, offset: number) => {
        let limitOffset = "";
        let query; 
        if (offset != null && limit != null) {
            limitOffset = " LIMIT " + limit + ' OFFSET ' + offset;
        }

        query =
            'SELECT * FROM master_admission_activity_tracking as a  where YEAR(a.createdAt)=' + year + ' ORDER BY a.createdAt DESC ';

        query += limitOffset;
        const adminUsers = activityRepository.query(query);
        return adminUsers;
    };
  /**
     * @author Moin
     * @description This function is get the activity by year wise.
     */
    public static YearWiseActivityData = async (year: number) => {
        const query =
            'SELECT * FROM master_admission_activity_tracking as a  where YEAR(a.createdAt)=' + year + ' ORDER BY a.createdAt DESC ';
        const adminUsers = activityRepository.query(query);
        return adminUsers;
    };

    /**
     * @author Moin
     * @description This function is used to search for year-wise data in the activity tables.
     */

    public static searchYearWiseData = async (year: number, value: string, limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query = "SELECT  u.* FROM `master_admission_activity_tracking` as u  WHERE ( u.activity like '%" + value + "%' or  u.name like '%" + value + "%' or u.userId like '%" + value + "%') AND YEAR(u.createdAt) like '%" + year + "%'";
        query += limitOffset;
        const data = activityRepository.query(query);
        return data;
    };
}
