import { AppDataSource } from "../data-source";
import Subject from "../entity/Subject";
const SubjectRepository = AppDataSource.getRepository(Subject);

export default class SubjectServices {
    /**
     * @author: Priyanka Vishwakarma
     * @function: Get all subjects
     */
    public static getAll = async () => {
        return await SubjectRepository.find();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Save subject
     * @param university 
     */
    public static saveSubject = async (university: Subject) => {
        return await SubjectRepository.save(university);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get subject by id
     * @param id 
     */
    public static getSubjectById = async (id: number) => {
        return await SubjectRepository.findOneBy({ id });
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Update subject by id
     * @param id 
     * @param data 
     */
    public static updateSubjectById = async (id: number, data: Subject) => {
        return await SubjectRepository
            .createQueryBuilder()
            .update(Subject)
            .set(data)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Delete subject by id
     * @param id 
     */
    public static deleteSubjectById = async (id: number) => {
        return await SubjectRepository
            .createQueryBuilder('master_admission_subject')
            .delete()
            .from(Subject)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get total subject count
     */
    public static getSubjectsCount = async () => {
        return await SubjectRepository.createQueryBuilder().getCount();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get subject data with pagination and search
     * @param offset 
     * @param limit 
     * @param search 
     */
    public static getSubjectsWithPaginationAndSearch =async (offset:number, limit:number, search:string) => {
        const queryBuilder = SubjectRepository.createQueryBuilder('s');
        if(search !== ''){
            queryBuilder.where(`s.subject_name_admission LIKE :search`, {search:`%${search}%`});
        }
        return await queryBuilder.skip(offset).take(limit).getMany();
    };

    public static getSubjectData = async () => {
        return await SubjectRepository.find();
    };
}