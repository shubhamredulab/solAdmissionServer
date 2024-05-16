import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import Course from "../entity/Course";
// import { Degree } from "../types/user";
const CourseRepository = AppDataSource.getRepository(Course);

export default class CourseServices {

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get all courses.
     */
    public static getAllCourses = async () => {
        return await CourseRepository.find();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Save courses.
     * @param course: course data
     */
    public static saveCourse = async (course: Course) => {
        return await CourseRepository.save(course);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get course by id.
     * @param id: course id
     */
    public static getCourseById = async (id: number) => {
        return await CourseRepository.findOneBy({ id: id });
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Update course by id
     * @param id: course id
     * @param course 
     */
    public static updateCourseById = async (id: number, course: Course) => {
        return await CourseRepository
            .createQueryBuilder()
            .update(Course)
            .set(course)
            .where('id = :id', { id: id })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Delete course by id
     * @param id 
     */
    public static deleteCourseById = async (id: number) => {
        return await CourseRepository
            .createQueryBuilder('master_admission_course')
            .delete()
            .from(Course)
            .where('id = :id', { id: id })
            .execute();
    };

   
/*
 Author: Rutuja Patil.
 Description: this function use for get the data by using course Id.
 */
    public static getDataByCourseName = async (id : number) => {
        return await CourseRepository.query(`
        SELECT 
        ca.course_name_admission,
          sga.group_combination_admission,
          cam.college_name_admission,
          cam.city,
          cam.state,
          cam.college_type
      FROM
           master_admission_course as ca
           JOIN master_admission_college_course as cca on cca.course_id_admission = ca.id
           LEFT Join master_admission_subject_group as sga on sga.id = cca.subject_group_id_admission
           Join master_admission_college as cam on cam.id = cca.college_id_admission
           where ca.id=${id}
        `);
    };



    public static getDegreeDataUg = async () => {
        const ugDegrees = ['Bachelor', 'Diploma'];
        const data1 = ugDegrees.map(value => `'${value}'`).join(', ');
        return await CourseRepository.query(`
        select DISTINCT ac.*, cca.courseStatus from master_admission_course as ac
join master_admission_college_course as cca on cca.course_id_admission = ac.id where ac.degree in(${data1}) AND cca.courseStatus='active';
        `);
    };


    public static getDegreeDataPg = async () => {
        const pgDegrees = ['Master'];
        return await CourseRepository.query(`
        select DISTINCT ac.*, cca.courseStatus from master_admission_course as ac
join master_admission_college_course as cca on cca.course_id_admission = ac.id where ac.degree in('${pgDegrees}') AND cca.courseStatus='active';
        `);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get courses count
     */
    public static getCoursesCount = async () => {
        return await CourseRepository.createQueryBuilder().getCount();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the courses data with pagination and search
     * @param offset 
     * @param limit 
     * @param search 
     */
    public static getCoursesWithPaginationAndSearch = async (offset: number, limit: number, search: string, courseId?: number[]) => {
        const queryBuilder = CourseRepository.createQueryBuilder('c');
        if (courseId) {
            if (courseId?.length == 0 || courseId == null) {
                return [];
            } else {
                queryBuilder.andWhere(`c.id IN (:...courseId)`, { courseId: courseId });
                if (search !== '') {
                    queryBuilder.andWhere(`(c.course_code_admission LIKE :search 
                                        OR c.course_name_admission LIKE :search 
                                        OR c.course_type_admission LIKE :search 
                                        OR c.degree LIKE :search)`, { search: `%${search}%` });
                }
            }
        } else {
            if (search !== '') {
                queryBuilder.where(`c.course_code_admission LIKE :search`, { search: `%${search}%` })
                    .orWhere(`c.course_name_admission LIKE :search`, { search: `%${search}%` })
                    .orWhere(`c.course_type_admission LIKE :search`, { search: `%${search}%` })
                    .orWhere(`c.degree LIKE :search`, { search: `%${search}%` });
            }
        }
        return await queryBuilder.skip(offset).take(limit).getMany();
    };
    

 /*
    Author: Tiffany Correia.
    Description: This function is used for getting all Course Details.
    */
    public static gettingCourseData = async () => {
        return await CourseRepository.find();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get courses by given ids
     * @param courseIds: array of course ids
     */
    public static getCourses = async (courseIds: number[]) => {
        return await CourseRepository.find({ where: { id: In(courseIds) } });
    };

    public static getCourseDetails = async (courseId: number) => {
        return await CourseRepository.find({ where: { id:courseId} });
    };

}