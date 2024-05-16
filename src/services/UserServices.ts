import User from '../entity/User';
import { AppDataSource } from '../data-source';
const UserRepository = AppDataSource.getRepository(User);
import { IAdmissionType, IRoles } from '../types/user';
import { Between } from 'typeorm';
import logger from '../utils/winston';

export default class UserServices {

    public static findUser = async (id: any) => {
        const user = await UserRepository.findOneBy({ id: id });
        return user;
    };


    public static getAllUsers = async () => {
        return await UserRepository.find();
    };

    public static register = async (data: User) => {
        return await UserRepository.save(data);
    };

    public static getUserByEmail = async (email: string) => {
        const user = await UserRepository.findOneBy({ email: email });
        return user;
    };

    public static updateUserRoleAndKeyloackId = async (id: number, role: IRoles, keycloakId: string) => {
        const updatedUser = await UserRepository.update({ id: id }, { role: role, keycloakId: keycloakId });
        return updatedUser;
    };

    public static updateUser = async (id: number, email: string, firstName: string, lastName: string, role: IRoles, keycloakId: string) => {
        const updatedUser = await UserRepository
            .createQueryBuilder()
            .update(User)
            .set({ firstName: firstName, lastName: lastName, role: role, keycloakId: keycloakId })
            .where('id = :id', { id: id })
            .execute();
        return updatedUser;
    };

    public static updateKeycloakId = async (id: number, keycloakId: string) => {

        const updateResult = await UserRepository
            .createQueryBuilder()
            .update(User)
            .set({ keycloakId: keycloakId }) // Specify the updated values
            .where('id = :id', { id: id })
            .execute();

        return updateResult;
    };

    public static saveRoleData = async (email: string, role: IRoles) => {

        const update = await UserRepository
            .createQueryBuilder()
            .update(User)
            .set({ role: role })
            .where('email = :email', { email: email })
            .execute();

        return update;
    };

    static getUserByKeycloakId = async (keycloakId: string) => {
        const result = await UserRepository.findOne({ where: { keycloakId } });
        return result;
    };

    public static findBykeycloakUserId = async (keycloakId: string) => {
        console.log(keycloakId)
        const user = await UserRepository.findOne({ where: { keycloakId: keycloakId } });
        return user;
    };

    public static deleteUserByEmail = async (email: string) => {
        const deleteUser = await UserRepository
            .createQueryBuilder()
            .delete()
            .from(User)
            .where('email = :email', { email: email })
            .execute();
        return deleteUser;
    };



    /*
 Author: Rutuja Patil.
 Description: this function use for save student personal data in user table.
 */
    public static addUserDetails = async (personalData: User, id: number) => {

        const update = await UserRepository
            .createQueryBuilder()
            .update(User)
            .set(personalData)
            .where('id = :id', { id: id })
            .execute();
        return update;

    };


    /*
 Author: Rutuja Patil.
 Description: this function use for get the Student Personal data from the table of user
 */
    public static getPersonalData = async (id: number) => {

        const userData = await UserRepository.findOneBy({ id: id });
        return userData;
    };

    /*
 Author: Rutuja Patil.
 Description: this function use for Stepper.
 */
    public static checkStepper = async (id: number) => {
        const user = await UserRepository.findOneBy({ id: id });
        return user;
    };

    public static getRoleWiseData = async () => {
        const query =
            `SELECT u.*,m.degreeType as Degree FROM master_admission_users as u  LEFT JOIN master_admission_menuitem as m ON u.id = m.userId where u.role = 'ADMIN' OR  u.role = 'UNIVERSITY'
            OR  u.role = 'SUPER_ADMIN'  ORDER BY u.createdAt desc`;

        const adminUsers = await UserRepository.query(query);
        return adminUsers;
    };

    public static TotalRoleWiseData = async (limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + ' OFFSET ' + offset;
        }
        let query =
            `SELECT u.*,m.degreeType as Degree FROM master_admission_users as u  LEFT JOIN master_admission_menuitem as m ON u.id = m.userId where u.role = 'ADMIN'  OR  u.role = 'UNIVERSITY' OR  u.role = 'SUPER_ADMIN' ORDER BY u.createdAt desc `;
        query += limitOffset;
        const totalData = UserRepository.query(query);
        return totalData;

    };

    public static getSearchData = async (value: string, limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query = "SELECT  u.*,m.degreeType as Degree FROM master_admission_users as u  LEFT JOIN master_admission_menuitem as m ON u.id = m.userId where (u.role = 'ADMIN' OR  u.role = 'UNIVERSITY') and  ( u.firstName like '%" + value + "%' or  u.lastName like '%" + value + "%' or u.email like '%" + value + "%') ORDER BY u.createdAt desc ";
        query += limitOffset;
        const data = UserRepository.query(query);
        return data;
    };


    public static updateUserStatus = async (id: number, change: string) => {
        // Update the status
        await UserRepository.createQueryBuilder()
            .update(User)
            .set({ status: change })
            .where('id = :id', { id: id })
            .execute();

        // Retrieve the updated data
        const updatedUser = await UserRepository.createQueryBuilder('user')
            .where('user.id = :id', { id: id })
            .getOne();

        // Return the updated data
        return updatedUser;
    };

    public static admissionTypeCounts = async () => {
        const admissionTypeCounts = await UserRepository.createQueryBuilder('master_admission_users')
            .select(['master_admission_users.admissionType', 'COUNT(master_admission_users.admissionType) as count'])
            .where('master_admission_users.registrationNo IS NOT NULL')
            .groupBy('master_admission_users.admissionType')
            .getRawMany();
        return admissionTypeCounts;
    };

    public static todaysRegStudCount = async () => {
        const currentDate = new Date();

        // Calculate the start and end of the current day
        const startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0); // Start of the day
        const endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);

        // Query for UG students registered today
        const ugCount = await UserRepository.count({
            where: {
                createdAt: Between(startDate, endDate), // Registration date is within the current day
                admissionType: IAdmissionType.UG // Use the enum value
            }
        });

        // Query for PG students registered today
        const pgCount = await UserRepository.count({
            where: {
                createdAt: Between(startDate, endDate), // Registration date is within the current day
                admissionType: IAdmissionType.PG // Use the enum value
            }
        });

        return {
            UG: ugCount,
            PG: pgCount
        };
    };

    /*
 Author: Pranali Gambhir
 Description: This function is used to update student's status(Active/Inactive) from admin in user table.
 */
    public static updateStatus = async (id: number, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            const updateResult = await UserRepository.createQueryBuilder()
                .update(User)
                .set({ status: newStatus })
                .where('id = :id', { id: id })
                .execute();

            return updateResult;
        } catch (error: any) {
            console.error(error);
        }
    };

    /*
 Author: Rutuja Patil.
 Description: this function use for get Latest Registration number.
 */

    public static getLatestRegistrationNumber = async (Year: number) => {
        try {
            const latestRegistrationNumber = `SELECT ur.registrationNo
            FROM master_admission_users as ur
            WHERE  ur.registerYear = ${Year}
            ORDER BY ur.updatedAt DESC
            LIMIT 1;`;
            const data = await UserRepository.query(latestRegistrationNumber);
            if (data != null) {
                if (data[0].registrationNo != null) {
                    return data[0].registrationNo;
                } else {

                    return '100001';
                }
            }
            return '100001';

        } catch (error) {
            logger.error;
            return '100001';
        }
    };

    /*
 Author: Rutuja Patil.
 Description: this function use for save registration number in user table.
 */
    public static saveRegNo = async (nextRegNo: number, Id: number, registerYear: string) => {
        const registerNo = await UserRepository.findOne({ where: { id: Id } });
        if (!registerNo?.registrationNo) {
            const update = await UserRepository
                .createQueryBuilder()
                .update(User)
                .set({ registrationNo: nextRegNo, registerYear: registerYear })
                .where('id = :id', { id: Id })
                .execute();

            return update;
        }
    };

    public static saveDatas = async (firstName: string, lastName: string, mobileno: string, id: number) => {
        const updatedUser = await UserRepository
            .createQueryBuilder()
            .update(User)
            .set({ firstName: firstName, lastName: lastName, mobileno: mobileno })
            .where('id = :id', { id: id })
            .execute();
        return updatedUser;
    };

    public static updateData = async (data: any, id: number) => {
        const updatedUser = await UserRepository
            .createQueryBuilder()
            .update(User)
            .set(data)
            .where('id = :id', { id: id })
            .execute();
        return updatedUser;
    };

    public static getUserDetails = async (id: number) => {
        const user = await UserRepository.findOneBy({ id: id });
        return user;
    };

    // Get single user Personal, Educational and Documents data
    public static getSingleUserPersonalEduDocData = async (id: number) => {
        return await UserRepository.query(`call get_single_userPersonalEduDoc(?);`, [Number(id)]);
    };


    /*
      Author: Rutuja Patil.
      Description: this function use for find student personal data using registrationNo from user table.
      */
    public static getStudentsPersonalData = async (registrationNo: number) => {
        return await UserRepository.findOneBy({ registrationNo: registrationNo });
    };

    public static findingUser = async (id: any) => {
        const user = await UserRepository.find({ where: { id: id } });
        return user;
    };

    public static findingID = async (id: any) => {
        const user = await UserRepository.findOne({ where: { id: id } });
        return user;
    };

    /**
   * @author: Pranali Gambhir
   * @function: This function filters the year wise data with pagination from users table for Superadmin.
   * @param year 
   */
    static getYearWiseData = async (year: number, limit: number, offset: number, degreeType?: string, isSubmitted?: string) => {
        let limitOffset = '';
        let query;
        let isSubmit;
        if (offset !== undefined && limit !== undefined) {
            limitOffset = ` LIMIT ${limit} OFFSET ${offset}`;
        }
        if (degreeType !== 'undefined' && isSubmitted === 'undefined') {
            query = `SELECT u.* FROM master_admission_users AS u 
            WHERE u.registrationNo is NOT Null AND u.academicYear='${year}' AND u.admissionType='${degreeType}' ORDER BY u.id DESC`;
        }
        else if (degreeType == 'undefined' && isSubmitted !== 'undefined') {
            isSubmit = isSubmitted == 'Yes' ? '=1' : ' is Null';
            query = `SELECT u.*,p.isSubmitted FROM master_admission_users AS u 
            LEFT JOIN master_admission_preferences AS p ON u.id = p.userId
            WHERE u.registrationNo is NOT Null AND u.academicYear='${year}' AND p.isSubmitted${isSubmit} ORDER BY u.id DESC`;
        } else if (degreeType !== 'undefined' && isSubmitted !== 'undefined') {
            isSubmit = isSubmitted === 'Yes' ? '=1' : ' is Null';
            query = `SELECT u.*, p.isSubmitted FROM master_admission_users AS u 
                     LEFT JOIN master_admission_preferences AS p ON u.id = p.userId
                     LEFT JOIN master_admission_educational_details AS e ON u.id = e.userId
                     WHERE u.registrationNo is NOT Null AND u.academicYear='${year}' AND u.admissionType='${degreeType}' AND  p.isSubmitted${isSubmit}
                     ORDER BY u.id DESC`;
        } else {
            query = `SELECT u.* FROM master_admission_users AS u 
            LEFT JOIN master_admission_educational_details AS e ON u.id = e.userId
            WHERE u.registrationNo is NOT Null AND u.academicYear='${year}' ORDER BY u.id DESC`;
        }
        query += limitOffset;
        const result = await UserRepository.query(query);
        return result;
    };

    /**
      * @author: Pranali Gambhir
      * @function: This function filters the year wise data from users table for Superadmin.
      * @param year 
      */
    static getYearWiseDataCount = async (year: number, degreeType?: string, isSubmitted?: string) => {
        let isSubmit;
        let query = `SELECT u.*, e.sscObtainedMarks, e.sscOutOf, e.sscPercentage,e.sscBoardName,e.otherSscBoardName, e.sscGrade, e.hscBoardName,e.otherHscBoardName,e.hscCollegeName, e.hscPassingState, e.hscPassingYear, e.hscSeatNo, e.hscMarksObtained, e.hscOutOf, e.hscStream, e.hscGrade, e.hscPercentage, e.biologyPercentage, e.mathPercentage, e.ugCollegename, e.ugCourseName, e.ugPassingYear, e.ugSeatNo, e.ugEntranceMarks, e.EntranceExam, e.EntranceYear,e.hscNoOfAttempt,e.ugNoOfAttempt,
        p.admissionType,p.isSubmitted,p.submitted_date,p.last_submitted_date
        FROM master_admission_users AS u
        LEFT JOIN master_admission_educational_details AS e ON u.id = e.userId
        LEFT JOIN master_admission_preferences AS p ON u.id = p.userId`;

        if (degreeType !== 'undefined' && isSubmitted === 'undefined') {
            query += `  WHERE u.registrationNo is NOT Null AND u.academicYear='${year}' AND u.admissionType='${degreeType}'`;
        } else if (degreeType !== 'undefined' && isSubmitted !== 'undefined') {
            isSubmit = isSubmitted == 'Yes' ? '=1' : ' is Null';
            query += ` WHERE u.registrationNo is NOT Null AND u.academicYear='${year}' AND u.admissionType='${degreeType}' AND p.isSubmitted${isSubmit}`;
        } else if (degreeType == 'undefined' && isSubmitted !== 'undefined') {
            isSubmit = isSubmitted == 'Yes' ? '=1' : ' is Null';
            query += `  WHERE u.registrationNo is NOT Null AND u.academicYear='${year}'  AND p.isSubmitted${isSubmit}`;
        }
        else {

            query += ` WHERE u.registrationNo is NOT Null AND u.academicYear='${year}'`;
        }

        query += ` ORDER BY u.id DESC`;
        const result = await UserRepository.query(query);
        return result;
    };

    /**
    * @author: Pranali Gambhir
    * @function: This function filters the year wise data with pagination from users table for admin.
    * @param year 
    */
    static getYearWiseDataByDegreeType = async (year: number, limit: number, offset: number) => {
        let limitOffset = '';
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + ' OFFSET ' + offset;

        }
        let query = `
    SELECT DISTINCT u.* FROM master_admission_users AS u
JOIN master_admission_menuitem AS m ON JSON_CONTAINS(m.degreeType, JSON_QUOTE(u.admissionType))
WHERE u.academicYear = '${year}' AND u.role='STUDENT'
ORDER BY u.id DESC`;
        query += limitOffset;
        const result = await UserRepository.query(query);
        return result;
    };

    /**
    * @author: Pranali Gambhir
    * @function: This function filters the year wise data from users table for admin.
    * @param year 
    */
    static getYearWiseDataByDegreeTypeCount = async (year: number) => {
        const query = `
    SELECT DISTINCT u.*, e.sscObtainedMarks, e.sscOutOf, e.sscPercentage, e.sscGrade,
    e.hscBoardName, e.hscCollegeName, e.hscPassingState, e.hscPassingYear,
    e.hscSeatNo, e.hscMarksObtained, e.hscOutOf, e.hscStream, e.hscGrade,
    e.hscPercentage, e.biologyPercentage, e.mathPercentage, e.ugCollegename,
    e.ugCourseName, e.ugPassingYear, e.ugSeatNo, e.ugEntranceMarks,
    e.EntranceExam, e.EntranceYear
FROM master_admission_users AS u
JOIN master_admission_menuitem AS m ON JSON_CONTAINS(m.degreeType, JSON_QUOTE(u.admissionType))
LEFT JOIN master_admission_educational_details AS e ON u.id = e.userId
WHERE u.academicYear = '${year}' AND u.role='STUDENT'
ORDER BY u.id DESC`;
        const result = await UserRepository.query(query);
        return result;
    };

    /**
* @author: Pranali Gambhir
* @function: This function filters data based on searching criterias for superadmin with pagination.
* @param year 
*/
    public static getFilteredData = async (searchCriteria: any, searchQuery: any, year: any, limit: number, offset: number, degreeType?: string, isSubmitted?: string) => {
        let limitOffset = '';
        let submitStatus;
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + ' OFFSET ' + offset;
        }
        let query = `
            SELECT 
                u.*,p.isSubmitted
                        FROM 
                            master_admission_users u
                        LEFT JOIN 
                            master_admission_preferences p ON u.id = p.userId`;

        if (searchCriteria && searchQuery && year && degreeType == 'undefined' && isSubmitted == 'undefined') {
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else if (searchCriteria && searchQuery && year && degreeType == 'undefined' && isSubmitted !== 'undefined') {
            submitStatus = isSubmitted == 'Yes' ? '=1' : ' is Null';
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else if (searchCriteria && searchQuery && year && degreeType != 'undefined' && isSubmitted == 'undefined') {
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else if (searchCriteria && searchQuery && year && degreeType != 'undefined' && isSubmitted != 'undefined') {
            submitStatus = isSubmitted == 'Yes' ? '=1' : ' is Null';
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'  AND p.isSubmitted${submitStatus}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'  AND p.isSubmitted${submitStatus}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'  AND p.isSubmitted${submitStatus}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'  AND p.isSubmitted${submitStatus}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'  AND p.isSubmitted${submitStatus}`;
                    break;
                default:
                    query += `  WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else {
            query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
        }

        query += ` ORDER BY u.id DESC`;
        query += limitOffset;
        const filteredData = await UserRepository.query(query);
        return filteredData;
    };

    /**
    * @author: Pranali Gambhir
    * @function: This function filters data based on searching criterias for superadmin.
    * @param year 
    */
    public static getFilteredDataCount = async (searchCriteria: any, searchQuery: any, year: any, degreeType?: string, isSubmitted?: string) => {
        let submitStatus;
        let query = `
        SELECT 
            u.*, p.isSubmitted FROM master_admission_users u
                    LEFT JOIN 
                        master_admission_preferences p ON u.id = p.userId`;

        if (searchCriteria && searchQuery && year && degreeType == 'undefined' && isSubmitted == 'undefined') {
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else if (searchCriteria && searchQuery && year && degreeType != 'undefined' && isSubmitted == 'undefined') {
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else if (searchCriteria && searchQuery && year && degreeType != 'undefined' && isSubmitted != 'undefined') {
            submitStatus = isSubmitted == 'Yes' ? '=1' : ' is Null';
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}' AND  p.isSubmitted${submitStatus}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}' AND p.isSubmitted${submitStatus}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'AND p.isSubmitted${submitStatus}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}' AND p.isSubmitted${submitStatus}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}' AND p.isSubmitted${submitStatus}`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else if (searchCriteria && searchQuery && year && degreeType == 'undefined' && isSubmitted != 'undefined') {
            submitStatus = isSubmitted == 'Yes' ? '=1' : ' is Null';
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND  p.isSubmitted${submitStatus}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        } else {
            query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
        }
        query += ` ORDER BY u.id DESC`;

        const filteredData = await UserRepository.query(query);
        return filteredData;
    };

    /**
    * @author: Pranali Gambhir
    * @function: This function filters data based on searching criterias for admin with pagination.
    * @param year 
    */
    public static getFilteredDataForAdmin = async (searchCriteria: any, searchQuery: any, year: any, limit: number, offset: number, degreeType?: string, isSubmitted?: string) => {
        let limitOffset = '';
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + ' OFFSET ' + offset;
        }
        let submitStatus;
        let query = `
            SELECT 
                u.*,p.isSubmitted
                        FROM 
                            master_admission_users u
                        LEFT JOIN 
                            master_admission_preferences p ON u.id = p.userId`;

        if (searchCriteria && searchQuery && year && degreeType == 'undefined' && isSubmitted == 'undefined') {
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        } else if (searchCriteria && searchQuery && year && degreeType == 'undefined' && isSubmitted !== 'undefined') {
            submitStatus = isSubmitted == 'Yes' ? '=1' : ' is Null';
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else if (searchCriteria && searchQuery && year && degreeType != 'undefined' && isSubmitted == 'undefined') {
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        } else if (searchCriteria && searchQuery && year && degreeType != 'undefined' && isSubmitted != 'undefined') {
            submitStatus = isSubmitted == 'Yes' ? '=1' : ' is Null';
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'  AND p.isSubmitted${submitStatus}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'  AND p.isSubmitted${submitStatus}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'  AND p.isSubmitted${submitStatus}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'  AND p.isSubmitted${submitStatus}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  u.admissionType='${degreeType}'  AND p.isSubmitted${submitStatus}`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        } else if (searchCriteria && searchQuery && year && degreeType == 'undefined' && isSubmitted != 'undefined') {
            submitStatus = isSubmitted == 'Yes' ? '=1' : ' is Null';
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  p.isSubmitted${submitStatus}'`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND  u.academicYear = ${year}   AND p.isSubmitted${submitStatus}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  p.isSubmitted${submitStatus}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  p.isSubmitted${submitStatus}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND  u.academicYear = ${year} AND  p.isSubmitted${submitStatus}'`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else {
            query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
        }

        query += ` ORDER BY u.id DESC`;
        query += limitOffset;
        const filteredData = await UserRepository.query(query);
        return filteredData;
    };

    /**
    * @author: Pranali Gambhir
    * @function: This function filters data based on searching criterias for admin.
    * @param year 
    */
    public static getFilteredDataForAdminCount = async (searchCriteria: any, searchQuery: any, year: any, degreeType?: string, isSubmitted?: string) => {
        let submitStatus;
        let query = `
        SELECT 
            u.*, p.isSubmitted FROM master_admission_users u
                    LEFT JOIN 
                        master_admission_preferences p ON u.id = p.userId`;

        if (searchCriteria && searchQuery && year && degreeType == 'undefined' && isSubmitted == 'undefined') {
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year}`;
                    break;
                default:
                    query += ` u.registrationNo is NOT Null AND WHERE u.academicYear = ${year}`;
                    break;
            }
        }
        else if (searchCriteria && searchQuery && year && degreeType != 'undefined' && isSubmitted == 'undefined') {
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else if (searchCriteria && searchQuery && year && degreeType != 'undefined' && isSubmitted != 'undefined') {
            submitStatus = isSubmitted == 'Yes' ? '=1' : ' is Null';
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}' AND  p.isSubmitted${submitStatus}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}' AND p.isSubmitted${submitStatus}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}'AND p.isSubmitted${submitStatus}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}' AND p.isSubmitted${submitStatus}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND u.admissionType='${degreeType}' AND p.isSubmitted${submitStatus}`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        }
        else if (searchCriteria && searchQuery && year && degreeType == 'undefined' && isSubmitted != 'undefined') {
            submitStatus = isSubmitted == 'Yes' ? '=1' : ' is Null';
            switch (searchCriteria) {
                case 'nameAsOnMarksheet':
                    query += ` WHERE u.registrationNo is NOT Null AND u.nameAsOnMarksheet LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND  p.isSubmitted${submitStatus}`;
                    break;
                case 'email':
                    query += ` WHERE u.registrationNo is NOT Null AND u.email LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'registrationNo':
                    query += ` WHERE u.registrationNo is NOT Null AND u.registrationNo LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'mobileno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.mobileno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                case 'aadharCardno':
                    query += ` WHERE u.registrationNo is NOT Null AND u.aadharCardno LIKE '%${searchQuery}%' AND u.academicYear = ${year} AND p.isSubmitted${submitStatus}`;
                    break;
                default:
                    query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
                    break;
            }
        } else {
            query += ` WHERE u.registrationNo is NOT Null AND u.academicYear = ${year}`;
        }
        query += ` ORDER BY u.id DESC`;

        const filteredData = await UserRepository.query(query);
        return filteredData;
    };

    /*
  Author: Pranali Gambhir
  Description: This function is used to get count of all registered users within selected date range for admin and superadmin dashboard.
  */
    public static getUsersInDateRange = async (startDate: string, endDate: string) => {
        return await UserRepository
            .createQueryBuilder('user')
            .select('user.admissionType', 'admissionType')
            .addSelect('COUNT(user.id)', 'count')
            .where('user.createdAt >= :startDate AND user.createdAt <= :endDate', { startDate, endDate })
            .andWhere('user.role = :role', { role: 'Student' })
            .groupBy('user.admissionType')
            .getRawMany();
    };

    /*
      Author: Pranali Gambhir
      Description: This function is used to get count of all registered users for a selected date for admin and superadmin dashboard.
      */
    public static getUserForDay = async (date: string) => {
        const selectedDate = new Date(date);
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
        return await UserRepository
            .createQueryBuilder('user')
            .select('user.admissionType', 'admissionType')
            .addSelect('COUNT(user.id)', 'count')
            .where('user.createdAt >= :startOfDay', { startOfDay })
            .andWhere('user.createdAt < :endOfDay', { endOfDay })
            .andWhere('user.role = :role', { role: 'Student' })
            .groupBy('user.admissionType')
            .getRawMany();
    };

    public static updateRegistrationNo = async (id: number, registrationNo: number) => {
        const updatedUser = await UserRepository.update({ id: id }, { registrationNo: registrationNo });
        return updatedUser;
    };

    public static YearWiseAdmin = async (year: number) => {
        const query =
            ` SELECT u.*, m.degreeType as Degree 
            FROM master_admission_users as u  
            LEFT JOIN master_admission_menuitem as m ON u.id = m.userId 
            WHERE (u.role = 'ADMIN' OR u.role = 'UNIVERSITY' OR u.role = 'SUPER_ADMIN') 
            AND YEAR(u.createdAt) = ${year}
            ORDER BY u.createdAt DESC;`;
        const adminUsers = await UserRepository.query(query);
        return adminUsers;
    };
    public static getYearWiseAdmin = async (year: number, limit: number, offset: number) => {

        let limitOffset = "";
        let query;
        if (offset != 0 && limit != 0) {
            limitOffset = " LIMIT " + limit + ' OFFSET ' + offset;
        }
        query =
            `SELECT u.*, m.degreeType as Degree 
            FROM master_admission_users as u  
            LEFT JOIN master_admission_menuitem as m ON u.id = m.userId 
            WHERE (u.role = 'ADMIN' OR u.role = 'UNIVERSITY' OR u.role = 'SUPER_ADMIN') 
            AND YEAR(u.createdAt) = ${year}
            ORDER BY u.createdAt DESC `;
        query += limitOffset;
        const adminUsers = await UserRepository.query(query);
        return adminUsers;
    };

    public static SearchDataYearWise = async (year: number, value: string, limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != undefined && limit != undefined) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query =
            `SELECT u.*, m.degreeType as Degree
            FROM master_admission_users as u
            LEFT JOIN master_admission_menuitem as m ON u.id = m.userId
            WHERE (u.role = 'ADMIN' OR u.role = 'UNIVERSITY' OR u.role = 'SUPER_ADMIN')
            AND (u.email LIKE '%${value}%' OR u.firstName LIKE '%${value}%' OR u.lastName LIKE '%${value}%' OR u.role LIKE '%${value}%')
            AND YEAR(u.createdAt) = ${year}
            ORDER BY u.createdAt DESC `;
        query += limitOffset;
        const data = UserRepository.query(query);
        return data;
    };
}