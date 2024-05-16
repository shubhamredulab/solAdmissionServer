import UserCourseDetails from '../entity/UserCourseDetails';
import { AppDataSource } from "../data-source";
import { IRoles, applicationStatus, universityStatus } from '../types/user';
const UserCourseDetailsRepository = AppDataSource.getRepository(UserCourseDetails);

export default class UserCourseDetailsServices {

    /**
     * @author: Rutuja Patil
     * @description:To save data in master_admission_user_course_details table.
    /*/
    public static saveUserCourseDetails = async (userId: number, college_id: number, course_id: number, college_course_id: number, admission_form_no: string) => {
        return await UserCourseDetailsRepository.save({ userId, college_id, course_id, college_course_id, admission_form_no });
    };


    /**
     * @author: Rutuja Patil
     * @description:To check Maximum Application Number in table. 
    /*/
    public static getLatestApplicationNumber = async (userId: number) => {
        const latestApplicationNo = await UserCourseDetailsRepository.findOne(
            {
                where: {
                    userId: userId
                },
                order: {
                    admission_form_no: 'DESC'
                }
            }
        );
        if (latestApplicationNo) {
            return latestApplicationNo.admission_form_no;
        }
        return '00000';

    };

    /**
    * @author: Rutuja Patil
    * @description:To get College Report Data. 
   /*/
    public static getCollegeReport = async (userId: number) => {
        return await UserCourseDetailsRepository.query(`
        SELECT
        ac.course_name_admission,
        ac.id,
        SUM( CASE WHEN ucd.college_application_status = 'Accept' AND ucd.university_application_status = 'Accept' THEN 1 ELSE 0 END ) AS done_by_college_university_count,
        SUM( CASE WHEN ucd.college_application_status = 'New' THEN 1 ELSE 0 END ) AS new_application_count,
        SUM( CASE WHEN ucd.college_application_status = 'Accept' THEN 1 ELSE 0 END ) AS accept_by_college_count,
        SUM( CASE WHEN ucd.college_application_status = 'Reject' THEN 1 ELSE 0 END ) AS reject_by_college_count,
        SUM( CASE WHEN ucd.college_application_status = 'Hold' THEN 1 ELSE 0 END ) AS hold_by_college_count,
        SUM( CASE WHEN ucd.college_application_status = 'Cancel' THEN 1 ELSE 0 END ) AS cancel_by_college_count,
        SUM( CASE WHEN ucd.college_application_status = 'Accept' AND ucd.university_application_status = 'New' THEN 1 ELSE 0 END ) AS approved_by_collegeonly_count,
        SUM( CASE WHEN ucd.college_application_status = 'Accept' AND ucd.university_application_status = 'Hold' THEN 1 ELSE 0 END ) AS approved_by_college_hold_by_university_count,
        SUM( CASE WHEN ucd.college_application_status = 'Accept' AND ucd.university_application_status = 'Reject' THEN 1 ELSE 0 END ) AS approved_by_college_reject_by_university_count 
        FROM
        master_admission_menuitem AS am
        JOIN master_admission_user_course_details AS ucd ON JSON_CONTAINS( am.CourseId, CAST( ucd.course_id AS JSON ), '$' )
        AND ucd.college_id = am.collegeId
        JOIN master_admission_course AS ac ON ac.id = ucd.course_id
        WHERE am.userId = ${userId}
        GROUP BY
        ac.course_name_admission,
        ac.id;`);
    };

    /**
    * @author: Pranali Gambhir
    * @description:To filter data from master_admission_user_course_details and user table according to value from FE.
   /*/
    public static getDownloadsFilteredData = async (college: any, course: any, collegeStatus: any, universityStatus: any, academicYear: any) => {

        let query = `SELECT cd.university_application_status as universityAppStatus, 
    cd.college_application_status as clgAppStatus,
    cd.admission_form_no as application_form_no,
    u.registrationNo as reg_no,
    u.id as userid,
    u.email, u.mobileno, u.nameAsOnMarksheet as name,
    u.academicYear,
    c.course_name_admission as course,
    cl.college_name_admission as college
     FROM master_admission_user_course_details as cd
    LEFT JOIN master_admission_users as u ON cd.userId = u.id
    LEFT JOIN master_admission_course as c ON cd.course_id = c.id
    LEFT JOIN master_admission_college as cl ON cd.college_id = cl.id
     WHERE 1=1`;


        if (college !== undefined && college !== 'undefined' && college !== null && college !== 'null') {
            query += ` AND cd.college_id = ${college}`;
        }
        if (course !== undefined && course !== 'undefined' && course !== null && course !== 'null') {
            query += ` AND cd.course_id = ${course}`;
        }
        if (collegeStatus !== undefined && collegeStatus !== 'undefined' && collegeStatus !== null && collegeStatus !== 'null') {
            query += ` AND cd.college_application_status = '${collegeStatus}'`;
        }
        if (universityStatus !== undefined && universityStatus !== 'undefined' && universityStatus !== null && universityStatus !== 'null') {
            query += ` AND cd.university_application_status = '${universityStatus}'`;
        }
        if (academicYear !== undefined && academicYear !== 'undefined' && academicYear !== null && academicYear !== 'null') {
            query += ` AND u.academicYear = '${academicYear}'`;
        }
        return await UserCourseDetailsRepository.query(query);
    };


    /**
     * @author: Priyanka Vishwakarma
     * @function: 
     * @param collegeId 
     */
    public static getApplicationsByCollegeId = async (collegeId: number) => {
        return await UserCourseDetailsRepository
            .createQueryBuilder()
            .where('college_id = :collegeId', { collegeId })
            .getMany();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get applications
     * @param collegeId 
     */
    public static viewApplications = async (role: IRoles, limit: number, offset: number, college_application_status?: applicationStatus | string, collegeId?: number[], degreeType?: string[], courseId?: number[]) => {

        let query = `
    SELECT
	uc.*,
    uc.college_application_status,
    c.college_name_admission AS college_name_admission,
	cour.course_name_admission AS course_name_admission,
	cour.course_code_admission AS course_code_admission,
	u.firstName AS firstName,
	u.nameAsOnMarksheet AS nameAsOnMarksheet,
	u.email AS email,
	u.mobileno AS mobileno,
	u.registrationNo AS registrationNo,
	u.admissionType AS admissionType,
    clgcour.admissionYear, 
    clgcour.academic_year_admission 
FROM
	master_admission_user_course_details as uc
    LEFT JOIN master_admission_college_course as clgcour ON uc.college_course_id = clgcour.id
	LEFT JOIN master_admission_users as u ON uc.userId = u.id
    LEFT JOIN master_admission_college as c ON uc.college_id = c.id
	LEFT JOIN master_admission_course as cour ON uc.course_id = cour.id 
`;
 
        if (role === IRoles.ADMIN) {
            if (collegeId) {
                query += `where  uc.college_id IN(${collegeId}) AND u.admissionType IN('${(degreeType ?? []).join("','")}') AND uc.course_id IN(${courseId})`;
            }

            if (college_application_status !== undefined && college_application_status !== 'undefined') {
                query += ` AND uc.college_application_status = '${college_application_status}'`;
            }
        } else {
            if (college_application_status !== undefined && college_application_status !== 'undefined') {
                query += ` where uc.college_application_status = '${college_application_status}'`;
            }
        }
        query+=`AND (uc.ready_to_pay IS NULL OR uc.ready_to_pay = '' OR uc.ready_to_pay = 'undefined')`;
        query += ` limit ${limit} offset ${offset}`;
        const data = await UserCourseDetailsRepository.query(query);
        return data;
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get user_course_details by id
     * @param id 
     */
    public static getApplicationById = async (id: number) => {
        return await UserCourseDetailsRepository.findOne({ where: { id: id } });
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Add collegeComments and change status by id
     * @param appId 
     * @param comment 
     * @param application_status 
     */
   public static addCommentAndStatus = async (appId: number, comment: string, application_status: applicationStatus, boardNameForPayment:string) => {
    
        return await UserCourseDetailsRepository
            .createQueryBuilder()
            .update()
            .set({ college_comments: comment, college_application_status: application_status, boardNameForPayment:boardNameForPayment })
            .where("id = :id", { id: appId })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Add universityComment and change status by id
     * @param appId 
     * @param comment University comments
     * @param university_application_status 
     */
    public static addCommentAndStatusForUniversity = async (appId: number, comment: string, university_application_status: universityStatus) => {
        return await UserCourseDetailsRepository
            .createQueryBuilder()
            .update()
            .set({ university_comments: comment, university_application_status: university_application_status })
            .where("id = :id", { id: appId })
            .execute();
    };

    /**
     * @author: Tiffany Correia
     * @description: To find all the data whose application_status is Accepted from master_admission_user_course_details table.
    /*/
    public static getTotalApplication = async (application_status: applicationStatus) => {
        return await UserCourseDetailsRepository.find({ where: { college_application_status: application_status } });
    };

    /**
    * @author: Tiffany Correia
    * @description: To find all the data whose application_status is Accepted and university_application_status is New from master_admission_user_course_details table.
   /*/
    public static getByStatus = async (application_status: applicationStatus, university_application_status: universityStatus) => {
        return await UserCourseDetailsRepository.find({ where: { college_application_status: application_status, university_application_status: university_application_status } });
    };

    /**
    * @author: Tiffany Correia
    * @description: To update and save the data for accept along with notes.
   /*/
    public static saveAccept = async (id: number, notes: string) => {
        return await UserCourseDetailsRepository
            .createQueryBuilder()
            .update(UserCourseDetails)
            .set({ university_application_status: universityStatus['ACCEPT'], university_comments: notes })
            .where('id = :id', { id: id })
            .execute();
    };

    /**
  * @author: Tiffany Correia
  * @description: To update and save the data for reject along with notes.
 /*/
    public static saveReject = async (id: number, notes: string) => {
        return await UserCourseDetailsRepository
            .createQueryBuilder()
            .update(UserCourseDetails)
            .set({ university_application_status: universityStatus['REJECT'], university_comments: notes })
            .where('id = :id', { id: id })
            .execute();
    };

    /**
 * @author: Tiffany Correia
 * @description: To update and save the data for reject along with notes.
/*/
    public static onHold = async (id: number, notes: string) => {
        return await UserCourseDetailsRepository
            .createQueryBuilder()
            .update(UserCourseDetails)
            .set({ university_application_status: universityStatus['HOLD'], university_comments: notes })
            .where('id = :id', { id: id })
            .execute();
    };

    /**
* @author: Tiffany Correia
* @description: To update and resend the data in New Applicatiom.
/*/
    public static resendApp = async (id: number) => {
        return await UserCourseDetailsRepository
            .createQueryBuilder()
            .update(UserCourseDetails)
            .set({ university_application_status: universityStatus['NEW'] })
            .where('id = :id', { id: id })
            .execute();
    };

    /**
* @author: Tiffany Correia
* @description: Joins 3 tables for getting data of college, course and their ID's.
/*/
    public static joinForCollege = async (id: number[]) => {
        const user = await UserCourseDetailsRepository.query(
            `SELECT *
             FROM master_admission_college AS college
             JOIN master_admission_user_course_details AS user_details ON college.id = user_details.college_id
             JOIN master_admission_course AS course ON user_details.course_id = course.id
             JOIN master_admission_users AS users ON users.id = user_details.userId
             JOIN master_admission_college_course AS macc ON user_details.college_course_id = macc.id
             WHERE user_details.id IN (?)`,
            [id]
        );
        return user;
    };

    /**
    * @author: Tiffany Correia
    * @function: Get join data's count
    */
    public static Count = async () => {
        return await UserCourseDetailsRepository.createQueryBuilder().getCount();
    };
    /**
     * @author: Moin 
     * @description: this function get the user id wise college Details and course Details with user name . 
    /*/
    public static getCollegeAndCourseName = async (userId: number) => {
        return await UserCourseDetailsRepository.query(`SELECT u.*,clg.college_name_admission as collegeName ,cor.course_name_admission as courseName,users.firstName FROM master_admission_user_course_details as u LEFT JOIN master_admission_college as clg ON u.college_id=clg.id LEFT JOIN master_admission_course as cor ON u.course_id = cor.id LEFT JOIN master_admission_users as users ON u.userId=users.id WHERE u.userId=${userId} `);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get applications for university where college_application_status always 'Accept' and university_application_status can be New, Hold, Reject, Accept
     * @param university_application_status 
     */
   public static getApplicationsForUniversity = async (limit: number, offset: number, university_application_status?: universityStatus | string,
        filterByCollege?: string, filterByCourse?: string) => {
        const queryBuilder = UserCourseDetailsRepository
            .createQueryBuilder('uc')
            .select([
                'clgcour.academic_year_admission AS clgcour_academic_year_admission',
                'clgcour.admissionYear AS clgcour_admissionYear',
                'clgcour.id AS clgcour_id',
                'uc.*',
                'uc.college_application_status',
                'uc.university_application_status',
                'c.college_name_admission AS college_name_admission',
                'cour.course_name_admission AS course_name_admission',
                'cour.course_code_admission AS course_code_admission',
                'u.firstName AS firstName',
                'u.nameAsOnMarksheet AS nameAsOnMarksheet',
                'u.email AS email',
                'u.mobileno AS mobileno',
                'u.registrationNo AS registrationNo',
                'u.admissionType AS admissionType'
            ])
            .leftJoin('master_admission_college_course', 'clgcour', 'uc.college_course_id = clgcour.id')
            .leftJoin('master_admission_users', 'u', 'uc.userId = u.id')
            .leftJoin('master_admission_college', 'c', 'uc.college_id = c.id')
            .leftJoin('master_admission_course', 'cour', 'uc.course_id = cour.id')
            .where('uc.college_application_status = :college_application_status', { college_application_status: 'Accept' });

        if (university_application_status !== 'Total') {
            queryBuilder.andWhere('uc.university_application_status = :university_application_status', { university_application_status });
        }

        if (filterByCollege !== 'undefined') {
            queryBuilder.andWhere('c.college_name_admission like :filterByCollege', { filterByCollege: `%${filterByCollege}%` });
        }

        if (filterByCourse !== 'undefined') {
            queryBuilder.andWhere('cour.course_name_admission like :filterByCourse', { filterByCourse: `%${filterByCourse}%` });
        }

        const result = await queryBuilder.take(limit).skip(offset).getRawMany();
        return result;
   };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the count of the application for view university applications
     * @param university_application_status 
     */
    public static getCountForUniApplications = async (university_application_status?: universityStatus | string) => {
        const queryBuilder = UserCourseDetailsRepository.createQueryBuilder().where(`college_application_status = 'Accept'`);
        if (university_application_status !== 'Total') {
            queryBuilder.andWhere(`university_application_status = :status`, { status: university_application_status });
        }
        const result = await queryBuilder.getCount();
        return result;
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the count for view application
     * @param role 
     * @param collegeId 
     * @param courseIds 
     * @param college_application_status 
     */
    public static getCountViewApplications = async (role: IRoles, collegeId?: number[] | undefined, courseIds?: number[] | undefined, college_application_status?: unknown) => {
        const queryBuilder = UserCourseDetailsRepository
            .createQueryBuilder();
        if (role === IRoles.ADMIN) {
            queryBuilder.where("college_id IN(:collegeId) AND course_id IN(:courseIds) ", { collegeId: collegeId, courseIds: courseIds });
        }

        if (college_application_status !== undefined && college_application_status !== 'undefined') {
            queryBuilder.andWhere(`college_application_status = :status`, { status: college_application_status });
        }
      
            queryBuilder.andWhere(`(ready_to_pay IS NULL OR ready_to_pay = '' OR ready_to_pay = 'undefined')`);
        const result = await queryBuilder.getCount();
        return result;

    };
   /**
     * @author: Moin
     * @function: this function use to check the user is exist or not in the database
     * @param id 
     */
    public static checkUser = async (id: number) => {
        const findUser = await UserCourseDetailsRepository.findOne({ where: { userId: id } });
        return findUser;
      };
   /**
     * @author: Moin
     * @function: this function use to update the student ready to pay in the data base 
     
     */
      public static updateUserData = async (userId: number, viewData: string) => {
        const updateResult = await UserCourseDetailsRepository.createQueryBuilder()
          .update(UserCourseDetails)
          .set({ ready_to_pay: viewData })
          .where('userId = :userId', { userId: userId })
          .execute();
        return updateResult;
      };
}