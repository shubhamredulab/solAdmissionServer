import { AppDataSource } from "../data-source";
import SubjectGroup from "../entity/SubjectGroup";
const SubjectGroupRepository = AppDataSource.getRepository(SubjectGroup);

export default class SubjectGroupServices {

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get all subjectGgroups
     */
    public static getAll = async () => {
        return await SubjectGroupRepository.query(`CALL get_all_subjectGroups()`);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Save subjectGroup
     * @param subjectGroup 
     */
    public static saveSubjectGroup = async (subjectGroup: SubjectGroup) => {
        return await SubjectGroupRepository.save(subjectGroup);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get subjectGroup data by id
     * @param id 
     */
    public static getSubjectGroupById = async (id: number) => {
        return await SubjectGroupRepository.query(`CALL get_single_subjectGroup(?)`, [id ? id : 0]);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Update subjectGroup by id
     * @param id 
     * @param subjectGroup 
     */
    public static updateSubjectGroupById = async (id: number, subjectGroup: SubjectGroup) => {
        return await SubjectGroupRepository
            .createQueryBuilder()
            .update(SubjectGroup)
            .set(subjectGroup)
            .where('id = :id', { id: id })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Delete subjectGroup by id
     * @param id 
     */
    public static deleteSubjectGroupById = async (id: number) => {
        return await SubjectGroupRepository
            .createQueryBuilder('master_admission_subject_group')
            .delete()
            .from(SubjectGroup)
            .where('id = :id', { id: id })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function:  Get subjectGroup by courseId
     * @param courseId 
     */
    public static getSubjectGroupByCourseId = async (courseId: number) => {
        return await SubjectGroupRepository.find({ where: { course_id_admission: courseId } });
    };
    public static getsubjectlist = async (courseId: number) => {
        return await SubjectGroupRepository.query(`
        SELECT DISTINCT sb.* FROM master_admission_subject_group AS sg LEFT JOIN master_admission_subject AS sb ON FIND_IN_SET(sb.id, REPLACE(REPLACE(REPLACE(sg.subject_ids_admission, ' ', ''), '[', ''), ']', '')) > 0 WHERE sg.id = ${courseId};`);
    };
    public static getGroupData = async () => {
        return await SubjectGroupRepository.find();
    };

/*
  Author: Rutuja Patil.
  Description: this function use for get course details based on the college Name from master_admission_course.
  */        
    public static getGroupDetails = async (courseId:number) => {
        return await SubjectGroupRepository.query(`select co.course_name_admission,co.course_code_admission,co.subjectType,sg.group_combination_admission,sg.id from master_admission_course AS co 
        LEFT Join master_admission_subject_group AS sg ON sg.course_id_admission = co.id
        where co.id= ${courseId}`);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the total subjectgroup count
     */
    public static getSubjectGroupsCount =async () => {
        return await SubjectGroupRepository.createQueryBuilder().getCount();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function:  Get the subjectGroup with pagination and search
     * @param offset 
     * @param limit 
     * @param search 
     */
    public static getSubjectGroupsWithPaginationAndSearch = async (offset: number, limit: number, search: string) => {
        return await SubjectGroupRepository.query(`CALL subject_groups(?,?,?)`, [
            limit ? limit : 10,
            offset ? offset : 0,
            search ? search : ''
        ]);
    };

}