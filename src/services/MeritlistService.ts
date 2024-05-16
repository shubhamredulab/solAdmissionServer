import { AppDataSource } from '../data-source';
import CollegeCourse from '../entity/CollegeCourse';
import MeritList from '../entity/MeritList';
import { SendExcelStatus, verifationStatus } from '../types/user';
const collegeCourseRepository = AppDataSource.getRepository(CollegeCourse);
const meritListRepository = AppDataSource.getRepository(MeritList);
export default class MeritListServices {
    /**
     * @author Moin
     * @description This function is used to retrieve college-wise courses from the merit List table.
     */

    static getCourseData = async (collegeId: number) => {
        const query =
            "SELECT DISTINCT cor.* FROM master_admission_college_course as clgco JOIN master_admission_college as clg ON clgco.college_id_admission = clg.id JOIN master_admission_course as cor ON clgco.course_id_admission = cor.id WHERE clg.id=" + collegeId;
        const courseData = collegeCourseRepository.query(query);
        return courseData;
    };
    /**
     * @author Moin
     * @description This function is used to display selected value-wise merit list on the client side table.
     */

    static getUserData = async (CollegeCtrl: string, CourseCtrl: string, PercentageCtrl: string, categoryCtr: string, limit: number, offset: number, groupId: number[], courseName: string, collegeName : string, subjectType :string) => {
        let query = "";
        let params = [];
        if (subjectType === "BA" && categoryCtr !== 'Others') {
            params = [CollegeCtrl || " ", CourseCtrl || " ", PercentageCtrl || " ", categoryCtr || " ", groupId || " ", collegeName || " "];
        } else if (subjectType === "BA" && categoryCtr === 'Others') {
            params = [CollegeCtrl || " ", CourseCtrl || " ", PercentageCtrl || " ", groupId || " ", collegeName || " "];
        }
        else if (subjectType != 'IT' && subjectType !== 'BA' && categoryCtr === 'Others') {

            params = [CollegeCtrl || " ", CourseCtrl || " ", PercentageCtrl || " ", collegeName || " "];
        }
         else {
            params = [CollegeCtrl || " ", CourseCtrl || " ", PercentageCtrl || " ", categoryCtr || " ", collegeName || " "];

        }

        if (subjectType === "IT" && categoryCtr != 'Others' && categoryCtr != 'InHouse') {
            
            query = 'CALL getBscItMeritListDataWithoutGroupIdWithCategory(?, ?, ?, ?, ?)';

        } else if (subjectType === "IT" && categoryCtr === 'Others') {

            query = 'CALL getBscItMeritListDataWithoutGroupIdWithOtherCategory(?, ?, ?, ?)';

        } else if (subjectType === "IT" && categoryCtr === 'InHouse') {

            query = 'CALL getBscItMeritListDataWithoutGroupIdWithInhouseCategory(?, ?, ?, ?, ?)';

        }
        else if (subjectType === "BA" && categoryCtr != 'Others' && categoryCtr != 'InHouse') {
           
            query = `CALL getMeritListDataBAWithCategory(?, ?, ?, ?, '[?]',?)`;

        } else if (subjectType === "BA" && categoryCtr === 'Others') {
            query = `CALL getMeritListDataBAWithOtherCategory(?, ?, ?,'[?]',?)`;
        } else if (subjectType === "BA" && categoryCtr === 'InHouse') {
            query = `CALL getMeritListDataBAWithInHouseCategory(?, ?, ?, ?, '[?]',?)`;

        }
        else if (subjectType != "IT" && subjectType != "BA" && categoryCtr != 'Others' && categoryCtr != 'InHouse') {
            query = 'CALL getMeritListDataWithoutGroupIdWithCategory(?, ?, ?, ?, ?)';

        } else if (subjectType != 'IT' && subjectType !== 'BA' && categoryCtr === 'Others') {

            query = 'CALL getMeritListDataWithoutGroupIdWithOtherCategory(?, ?, ?, ?)';

        } else if (subjectType != 'IT' && subjectType !== 'BA' && categoryCtr === 'InHouse') {

            query = 'CALL getMeritListDataWithoutGroupIdWithInhouseCategory(?, ?, ?, ?, ?)';

        }

        try {
            const [rows] = await collegeCourseRepository.query(query, params);
            // Apply LIMIT and OFFSET to the result set
            const startIndex = offset || 0;
            const endIndex = startIndex + (limit || rows.length);

            const paginatedResult = rows.slice(startIndex, endIndex);
            return paginatedResult;
        } catch (error) {
            console.error("Error executing the stored procedure:", error);
            throw error;
        }
    };
    
    /**
     * @author Moin
     * @description This function is used to search for specific data in the merit list table.
     */


    static searchData = async (valueS: string, CollegeCtrl: string, CourseCtrl: string, PercentageCtrl: string, categoryCtr: string, limit: number, offset: number, groupId: number, courseName: string, collegeName : string, subjectType :string) => {
        let query = "";
        let params = [];
        if (subjectType === "BA" && categoryCtr !== 'Others') {
            params = [CollegeCtrl || " ", CourseCtrl || " ", PercentageCtrl || " ", categoryCtr || " ", valueS || " ", groupId || " ", collegeName || " "];
        } else if (subjectType === "BA" && categoryCtr === 'Others') {
            params = [CollegeCtrl || " ", CourseCtrl || " ", PercentageCtrl || " ", valueS || " ", groupId || " ", collegeName || " "];
        }
        else if (subjectType != 'IT' && subjectType !== 'BA' && categoryCtr === 'Others') {

            params = [CollegeCtrl || " ", CourseCtrl || " ", PercentageCtrl || " ", valueS || " ", collegeName || " "];
        }
        else if (subjectType == 'IT' && categoryCtr === 'Others') {

            params = [CollegeCtrl || " ", CourseCtrl || " ", PercentageCtrl || " ", valueS || " ", collegeName || " "];
        }
        else {
            params = [CollegeCtrl || " ", CourseCtrl || " ", PercentageCtrl || " ", categoryCtr || " ", valueS || " ", collegeName || " "];
        }


        if (subjectType === "IT" && categoryCtr != 'Others' && categoryCtr != 'InHouse') {

            query = 'CALL searchBscItMeritListDataWhithoutGroupIdWithCategory(?, ?, ?, ?, ?,?)';


        } else if (subjectType === 'IT' && categoryCtr === 'InHouse') {

            query = 'CALL searchBscItMeritListDataWhithoutGroupIdWithInHouseCategory(?, ?, ?, ?, ?,?)';

        } else if (subjectType === 'IT' && categoryCtr === 'Others') {
            query = 'CALL searchBscItMeritListDataWhithoutGroupIdWithOthersCategory(?, ?, ?, ?, ?)';
        }
        else if (subjectType === "BA" && categoryCtr != 'Others' && categoryCtr != 'InHouse') {
            query = `CALL searchMeritListDataBAWithCategory(?, ?, ?, ?, ?,'[?]',?)`;

        } else if (subjectType === "BA" && categoryCtr === 'InHouse') {
            query = `CALL searchMeritListDataBAWithInHouseCategory(?, ?, ?, ?, ?,'[?]',?)`;


        } else if (subjectType === "BA" && categoryCtr === 'Others') {
            query = `CALL searchMeritListDataBAWithOtherCategory(?, ?, ?, ?,'[?]',?)`;
        }
        else if (subjectType != "IT" && subjectType != "BA" && categoryCtr != 'Others' && categoryCtr != 'InHouse') {
            query = 'CALL searchMeritListDataWithoutGroupIdWithCategory(?, ?, ?, ?,?,?)';
        } else if (subjectType != 'IT' && subjectType !== 'BA' && categoryCtr === 'Others') {

            query = 'CALL searchMeritListDataWithoutGroupIdWithOtherCategory(?, ?, ?, ?,?)';

        } else if (subjectType != 'IT' && subjectType !== 'BA' && categoryCtr === 'InHouse') {

            query = 'CALL searchMeritListDataWithoutGroupIdWithInHouseCategory(?, ?, ?, ?,?,?)';
        }
        try {
            const [rows] = await collegeCourseRepository.query(query, params);

            // Apply LIMIT and OFFSET to the result set
            const startIndex = offset || 0;
            const endIndex = startIndex + (limit || rows.length);

            const paginatedResult = rows.slice(startIndex, endIndex);
            return paginatedResult;
        } catch (error) {
            console.error("Error executing the stored procedure:", error);
            throw error;
        }
    };

    /**
     * @author Moin
     * @description This function is used to check if the user exists in the table with selected values.
     */

    public static findTheUser = async (id: number, registrationNo: number, collegeId: number, courseId: number, typeOfMeritList: string) => {
        const user = await meritListRepository.findOneBy({ userId: id, collegeId: collegeId, registrationNo: registrationNo, courseId: courseId, typeOfMeritList: typeOfMeritList });
        return user;
    };
    /**
     * @author Moin
     * @description This function is used to save data in the merit List table.
     */

    public static saveData = async (userId: number, collegeId: number, courseId: number, categoryName: string, typeOfMeritList: string, currentDate: string, nameAsOnMarksheet: string, email: string, registrationNo: number, mobileNo: string, revoke: string, groupId: number[], percentage: string, sendExcelStatus: SendExcelStatus, validDateTime: Date) => {
        const currentYear = new Date();
        const saveData = await meritListRepository.save({ userId: userId, collegeId: collegeId, courseId: courseId, categoryName: categoryName, typeOfMeritList: typeOfMeritList, date: currentDate, Name: nameAsOnMarksheet, email: email, registrationNo: registrationNo, mobileno: mobileNo, revoke: revoke, groupId: groupId, percentage: percentage, sendExcelStatus: sendExcelStatus, academicYear:  currentYear.getFullYear(), validDateTime: validDateTime});
        return saveData;
    };
    /**
     * @author Moin
     * @description This function is used to retrieve merit list data with their merit list type, and college with course-wise, for revoking or downloading the PDF of their merit list type.
     */

    public static getMeritData = async (limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != 0 && limit != 0) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query=`SELECT m.typeOfMeritList, m.collegeId, m.groupId, m.courseId, cor.course_name_admission, sb.group_combination_admission, clg.college_name_admission
        FROM master_admission_meritlist AS m
        LEFT JOIN master_admission_course AS cor ON m.courseId = cor.id
        LEFT JOIN master_admission_subject_group AS sb ON REPLACE(REPLACE(REPLACE(m.groupId, ' ', ''), '[', ''), ']', '') LIKE CONCAT('%', sb.id, '%')
        LEFT JOIN master_admission_college AS clg ON m.collegeId = clg.id
        WHERE m.revoke = 'false' AND m.meritType = 'MERIT'
        GROUP BY m.typeOfMeritList, m.collegeId, m.groupId, m.courseId, cor.course_name_admission, sb.group_combination_admission, clg.college_name_admission `;
      
        query += limitOffset;
        
        const data = meritListRepository.query(query);
        return data;
    };
    /**
     * @author Moin
     * @description This function is used to update the revoke status in the merit list table data.
     */

    public static updateRevoke = async (typeOfMeritList:string, collegeId: number, courseId: number, groupId: number, revoke: string) => {
        const updateResult = await meritListRepository.createQueryBuilder()
            .update(MeritList)
            .set({ revoke: revoke })
            .where('collegeId = :collegeId AND courseId = :courseId AND groupId = :groupId AND typeOfMeritList = :typeOfMeritList', { collegeId: collegeId, courseId: courseId, groupId: groupId, typeOfMeritList:typeOfMeritList})
            .execute();

        return updateResult;
    };

/*
  Author: Rutuja Patil.
  Description: this function use for check userId is already in master_admission_meritlist table or not.
  */     
    public static checkData = async (userId:number) => {
        return await meritListRepository.findOneBy({userId});
    };

 /*
  Author: Rutuja Patil.
  Description: this function use for add data which is assign college to student by admin in master_admission_meritlist table if data is already not in table.
  */    
    public static addAssignCollege = async (data : MeritList, userId: number, excelSendStatus:SendExcelStatus) => {
       return await meritListRepository.save({...data, userId: userId, sendExcelStatus:excelSendStatus});
    };

 /*
  Author: Rutuja Patil.
  Description: this function use for update data which is assign college to student by admin in master_admission_meritlist table if data is already in table.
  */      
    public static updateAssignCollege = async (data : MeritList, userId:number) => {
        return await meritListRepository.createQueryBuilder()
      .update(MeritList)
      .set(data)
      .where("userId = :userId", { userId: userId })
      .execute();
    };

    public static getAllMeritData = async ()=>{
        return await meritListRepository.find();
    };

    /**
    * @author: Priyanka Vishwakarma
    * @function: This function use to get All meritlist count whos feesPaid is true
    * @returns return the count
    */
    public static getTotalCountOfFeesPaid = async () => {
        return await meritListRepository
            .createQueryBuilder()
            .where("feesPaid = :paid", { paid: 'true' })
            .getCount();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: This function is used to get data of meritlist for verification tab.
     * @param offset 
     * @param limit 
     * @param search 
     * @returns  Those who paid the fees with pagination and search.
     */
    public static getAllMerilistForVerificationTab = async (offset: number, limit: number, search: string) => {
        let query = `select m.*, clg.college_name_admission as college, cou.course_name_admission as course from master_admission_meritlist as m left join master_admission_college as clg on m.collegeId = clg.id left join master_admission_course as cou on m.courseId = cou.id where m.feesPaid = 'true'`;
        if (search !== '') {
            query += `  AND (m.Name like '%${search}%' OR m.email like '%${search}%' OR m.registrationNo like '%${search}%' OR clg.college_name_admission like '%${search}%' OR cou.course_name_admission like '%${search}%' )`;
        }
        query += ` limit ${limit} offset ${offset}`;
        return await meritListRepository.query(query);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: This function is used to change status. 
     * @param status status having enum value. 
     * @enum status: NEW,VERIFY,PENDING
     * NEW: New default value,
     * VERIFY: If the document is correct
     * PENDING: If there is any issue in documents
     * @param id 
     * @returns 
     */
    public static changeStatus = async (status: verifationStatus, id: number) => {
        return await meritListRepository
            .createQueryBuilder()
            .update(MeritList)
            .set({ status: status })
            .where('id = :id AND feesPaid = true', { id: id })
            .execute();
    };

    /**
    * @author: Tiffany Correia
    * @function: This function is used to find college code
    */
    public static searchID = async (collegeCode: number) => {
        const user = await collegeCourseRepository.find({
            where: { college_id_admission: collegeCode }
        });

        return user;
    };

    /**
    * @author: Tiffany Correia
    * @function: This function is used to find data in the meritList table as per their userId
    */
    public static asPerFees = async (userId: number) => {
        return await meritListRepository.find({ where: { userId: userId } });
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Add remark by meritlist id
     * @param id 
     * @param remark 
     */
    public static addRemark = async (id: number, remark: string) => {
        return await meritListRepository.createQueryBuilder()
            .update(MeritList)
            .set({ remark: remark })
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: If all the documents of the student is verified then change the status to VERIFY
     * @param registrationNo 
     * @param collegeId 
     * @param courseId 
     * @param status 
     */
    public static verifyStatusIfAllDocumentsVerified = async (registrationNo: number, collegeId: number, courseId: number, status: verifationStatus) => {
        const result = await meritListRepository
            .createQueryBuilder()
            .update(MeritList)
            .set({ status: status })
            .where(`registrationNo = :registrationNo AND collegeId = :collegeId AND courseId = :courseId AND feesPaid = 'true'`, { registrationNo: registrationNo, collegeId: collegeId, courseId: courseId })
            .execute();

        return result;
    };

    /**
     * @author Moin
     * @description This function is used to retrieve year-wise merit data with their merit list type and college with course-wise, for revoking or downloading the PDF of their merit list type.
     */

    public static getYearWiseMeritData = async (year: number, limit: number, offset: number) => {
        let limitOffset = "";
        if (offset != 0 && limit != 0) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query = `SELECT m.typeOfMeritList, m.collegeId, m.groupId, m.courseId, cor.course_name_admission, sb.group_combination_admission, clg.college_name_admission
    FROM master_admission_meritlist AS m
    LEFT JOIN master_admission_course AS cor ON m.courseId = cor.id
    LEFT JOIN master_admission_subject_group AS sb ON REPLACE(REPLACE(REPLACE(m.groupId, ' ', ''), '[', ''), ']', '') LIKE CONCAT('%', sb.id, '%')
    LEFT JOIN master_admission_college AS clg ON m.collegeId = clg.id
    WHERE m.revoke = 'false' AND m.meritType = 'MERIT' AND m.academicYear=${year}
    GROUP BY m.typeOfMeritList, m.collegeId, m.groupId, m.courseId, cor.course_name_admission, sb.group_combination_admission, clg.college_name_admission `;
        query += limitOffset;
        const data = meritListRepository.query(query);
        return data;
    };

    /**
  * @author Moin 
  * @description This function is used to retrieve merit list data for the year verification tab.
  */

    public static getAllYearWiseMeritListVerificationTab = async (year: number, offset: number, limit: number, search: string) => {
        let query = `select m.*, clg.college_name_admission as college, cou.course_name_admission as course from master_admission_meritlist as m left join master_admission_college as clg on m.collegeId = clg.id left join master_admission_course as cou on m.courseId = cou.id where m.feesPaid = 'true' AND m.academicYear=${year} `;
        if (search !== '') {
            query += `  AND (m.Name like '%${search}%' OR m.email like '%${search}%' OR m.registrationNo like '%${search}%' OR clg.college_name_admission like '%${search}%' OR cou.course_name_admission like '%${search}%' )`;
        }
        query += ` limit ${limit} offset ${offset}`;
        return await meritListRepository.query(query);
    };
}
