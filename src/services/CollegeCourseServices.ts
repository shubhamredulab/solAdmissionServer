import { AppDataSource } from "../data-source";
import CollegeCourse from "../entity/CollegeCourse";
import { status } from "../types/user";
import ViewCollegeCourse from "../views/VCollegeCourse";
const CollegeCourseRepository = AppDataSource.getRepository(CollegeCourse);
const CollegeCourseView = AppDataSource.getRepository(ViewCollegeCourse);

export default class CollegeCourseServices {

    public static getAll = async () => {
        return await CollegeCourseRepository.query(`CALL get_all_collegeCourses()`);
    };

    public static saveCollegeCourse = async (collegeCourse: CollegeCourse) => {
        return await CollegeCourseRepository.save({ ...collegeCourse, remaining_intake_admission: collegeCourse.intake_admission });
    };

    public static getCollegeCourseById = async (id: number) => {
        return await CollegeCourseView.findOneBy({id:id});
    };

    public static updateCollegeCourseById = async (id: number, collegeCourse: CollegeCourse) => {
        return await CollegeCourseRepository
            .createQueryBuilder()
            .update(CollegeCourse)
            .set(collegeCourse)
            .where('id = :id', { id: id })
            .execute();
    };

    public static deleteCollegeCourseById = async (id: number) => {
        return await CollegeCourseRepository
            .createQueryBuilder('master_admission_college_course')
            .delete()
            .from(CollegeCourse)
            .where('id = :id', { id: id })
            .execute();
    };
    public static getcoureData = async (collegeId: number) => {
        const query =
            "SELECT cor.* FROM master_admission_college_course as clgco JOIN master_admission_course as cor ON clgco.course_id_admission = cor.course_code_admission WHERE clgco.college_id_admission =" + collegeId;
        const courseData = CollegeCourseRepository.query(query);
        return courseData;
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the total collegeCourses count
     */
    public static getCollegeCoursesCount = async () => {
        return await CollegeCourseRepository.createQueryBuilder().getCount();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the collegeCourses with pagination and search
     * @param offset 
     * @param limit 
     * @param search 
     */
    public static getCollegeCoursesPaginationAndSearch = async (offset: number, limit: number, search: string) => {
        return await CollegeCourseRepository.query('CALL college_courses(?,?,?)', [
            limit ? limit : 10,
            offset ? offset : 0,
            search ? search : ''
        ]);
    };

    /**
     * @author: Pranali Gambhir
     * @function: Get the collegeCoursesByCoursesIds with pagination and search
     * @param offset 
     * @param limit 
     * @param search 
     */
    
    public static getCollegeCoursesByCourseIds = async (courseIds: number[], offset: number, limit: number, search: string) => {
        return await CollegeCourseRepository.query('CALL college_courses_by_course_ids(?,?,?,?)', [
            limit ? limit : 10,
            offset ? offset : 0,
            search ? search : '',
            courseIds.join(',')
        ]);
    };


    /*
Author: Rutuja Patil.
Description: this function use for get preference data using college IDs.
*/
    public static getPreferenceData = async (collegeIds: number[]) => {
        return await CollegeCourseRepository.query(`
    SELECT
    clm.college_name_admission,
    cam.course_name_admission,
    clm.college_code_admission,
    clm.college_type,
    cca.id as college_course_id,
    clm.id,
    clm.state,
    clm.city,
    cam.degree,
    sga.group_combination_admission 
  FROM
    master_admission_college_course AS cca
    JOIN master_admission_college AS clm ON clm.id = cca.college_id_admission
    JOIN master_admission_course AS cam ON cam.id = cca.course_id_admission
    LEFT JOIN master_admission_subject_group AS sga ON sga.id = cca.subject_group_id_admission 
WHERE
  cca.id IN(${collegeIds})`);
    };


    /**
     * @author: Priyanka Vishwakarma
     * @description: Update courseStatus by college_id_admission.
     * @param collegeId 
     * @param courseStatus 
     */
    public static updateCollegeCourseStatusByCollegeId = async (collegeId: number, courseStatus: status) => {
        const data = await CollegeCourseRepository
            .createQueryBuilder()
            .update(CollegeCourse)
            .set({ courseStatus: courseStatus })
            .where('college_id_admission = :collegeId', { collegeId: collegeId })
            .execute();
        return data;
    };

    public static getData = async (savedCollegeIds: number[]) => {
        const collegeCourses = await CollegeCourseRepository
            .createQueryBuilder('master_admission_college_course')
            .select([
                'master_admission_college_course.id AS college_course_id',
                'master_admission_college_course.college_id_admission as college_id',
                'master_admission_college_course.course_id_admission as course_id'
            ])
            .where('master_admission_college_course.id IN (:...savedCollegeIds)', { savedCollegeIds })
            .getRawMany();
        return collegeCourses;
    };
    /**
  * @author Moin
  * @description This function finds college-wise course data.
  */

    public static getCollegeIdWiseCourse = async (id: number) => {
        return await CollegeCourseView.find({where: { college_id_admission:id}});
    };

    /**
     * @author: Priya Sawant
     * @description: get university college-course wise sorted data.
     * @param collegeId 
     * @param college_application_status 
     * @param university_application_status 
     */
    public static getUniversityWiseCollegeCourseData = async (college_id: number) => {
        const sortByUniversity = await CollegeCourseRepository.query(`
        SELECT
        COUNT(CASE WHEN clm.college_application_status = 'Accept' AND clm.university_application_status = 'Accept' THEN 1 END) AS AppDone,
        COUNT(CASE WHEN clm.college_application_status = 'Accept' THEN 1 END) AS AppAproveClg,
        COUNT(CASE WHEN clm.college_application_status = 'Accept' AND clm.university_application_status = 'New' THEN 1 END) AS AppAproveclgNotUni,
        COUNT(CASE WHEN clm.college_application_status = 'Accept' AND clm.university_application_status = 'Hold' THEN 1 END) AS UniHold,
        COUNT(CASE WHEN clm.college_application_status = 'Reject' AND clm.university_application_status = 'Reject' THEN 1 END) AS UniReject,
            clm.userId,
            clm.college_id,
            clm.college_course_id,
            clm.college_application_status,
            clm.admission_form_no,
            clm.university_application_status,
            mac.course_name_admission
        FROM
            master_admission_user_course_details AS clm
        JOIN
            master_admission_course AS mac ON mac.id = clm.course_id
            WHERE
            clm.college_id = ${college_id}
            GROUP BY
                clm.userId,
                clm.college_id,
                clm.college_course_id,
                clm.college_application_status,
                clm.admission_form_no,
                clm.university_application_status,
                mac.course_name_admission`);  

        if (sortByUniversity.length === 0) {
            throw new Error('No data found for the specified college_id');
        }

        return sortByUniversity;
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Increment intake_admission and remaining_intake_admission by collegeCourseId, collegeId, courseId, admissionYear, academicYear
     * @param collegeCourseId 
     * @param collegeId 
     * @param courseId 
     * @param admissionYear 
     * @param academicYear 
     * @param incrementIntake 
     */
    public static incrementIntakes = async (collegeCourseId: number, collegeId: number, courseId: number, admissionYear: number, academicYear: string, incrementIntake: number) => {
        const result = await CollegeCourseRepository
            .createQueryBuilder()
            .update(CollegeCourse)
            .set({
                remaining_intake_admission: () => `remaining_intake_admission + ${incrementIntake}`,
                intake_admission: () => `intake_admission + ${incrementIntake}`
            })
            .where('id = :id AND college_id_admission = :collegeId AND course_id_admission = :courseId AND admissionYear = :admissionYear AND academic_year_admission = :academicYear',
                { id: collegeCourseId, collegeId: collegeId, courseId: courseId, admissionYear: admissionYear, academicYear: academicYear })
            .execute();

        return result;
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Decrement intake_admission and remaining_intake_admission by collegeCourseId, collegeId, courseId, admissionYear, academicYear
     * @param collegeCourseId 
     * @param collegeId 
     * @param courseId 
     * @param admissionYear 
     * @param academicYear 
     * @param decrementIntake 
     */
    public static decrementIntakes = async (collegeCourseId: number, collegeId: number, courseId: number, admissionYear: number, academicYear: string, decrementIntake: number) => {
        const result = await CollegeCourseRepository
            .createQueryBuilder()
            .update(CollegeCourse)
            .set({
                remaining_intake_admission: () => `remaining_intake_admission - ${decrementIntake}`,
                intake_admission: () => `intake_admission - ${decrementIntake}`
            })
            .where('id = :id AND college_id_admission = :collegeId AND course_id_admission = :courseId AND admissionYear = :admissionYear AND academic_year_admission = :academicYear',
                { id: collegeCourseId, collegeId: collegeId, courseId: courseId, admissionYear: admissionYear, academicYear: academicYear })
            .execute();

        return result;
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Decrement intake_admission and remaining_intake_admission by collegeCourseId, collegeId, courseId, admissionYear, academicYear
     * @param collegeCourseId 
     * @param collegeId 
     * @param courseId 
     * @param admissionYear 
     * @param academicYear 
     * @param decrementIntake 
     */
    public static seatAllotedDecIntakes = async (collegeCourseId: number, collegeId: number, courseId: number, admissionYear: number, academicYear: string, decrementIntake: number) => {

        const result = await CollegeCourseRepository
            .createQueryBuilder()
            .update(CollegeCourse)
            .set({
                remaining_intake_admission: () => `remaining_intake_admission - ${decrementIntake}`
            })
            .where('id = :id AND college_id_admission = :collegeId AND course_id_admission = :courseId AND admissionYear = :admissionYear AND academic_year_admission = :academicYear',
                { id: collegeCourseId, collegeId: collegeId, courseId: courseId, admissionYear: admissionYear, academicYear: academicYear })
            .execute();

        return result;
    };

}