import { AppDataSource } from "../data-source";
import SubjectPhd from "../entity/SubjectPhd";
const SubjectPhdRepository = AppDataSource.getRepository(SubjectPhd);

export default class SubjectServices {

    /**
     * @author: Priya Sawant
     * @function: Get all PHD Subject
     */
    public static getAllSubPhd = async () => {
        return await SubjectPhdRepository.find();
    };
    
    /**
     * @author: Priya Sawant
     * @function: save PHD Subject
     */
    public static saveSubjectPhd = async (subjectPhd: SubjectPhd) => {
        return await SubjectPhdRepository.save(subjectPhd);
    };

    /**
     * @author: Priya Sawant
     * @function: Get all PHD SubjectById
     */
    public static getSubjectPhdById = async (id: number) => {
        return await SubjectPhdRepository.findOneBy({ id });
    };

    /**
     * @author: Priya Sawant
     * @function: update PHD Subject
     */
    public static updateSubjectPhdById = async (id: number, data: SubjectPhd) => {
        return await SubjectPhdRepository
            .createQueryBuilder()
            .update(SubjectPhd)
            .set(data)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priya Sawant
     * @function: delete PHD Subject
     */
    public static deleteSubjectPhdById = async (id: number) => {
        return await SubjectPhdRepository
            .createQueryBuilder('master_admission_subject_phd')
            .delete()
            .from(SubjectPhd)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priya Sawant
     * @function: Get count PHD Subject
     */
    public static getSubjectsPhdCount = async () => {
        return await SubjectPhdRepository.createQueryBuilder().getCount();
    };

    /**
     * @author: Priya Sawant
     * @function: Get all PHD Subject with limit offset
     */
    public static getSubjectsPhdWithPaginationAndSearch =async (offset:number, limit:number, search:string) => {
        const queryBuilder = SubjectPhdRepository.createQueryBuilder('s');
        if(search !== ''){
            queryBuilder.where(`s.subject_phd_name_admission LIKE :search`, {search:`%${search}%`});
        }
        return await queryBuilder.skip(offset).take(limit).getMany();
    };

    public static getSubjectPhdData = async () => {
        return await SubjectPhdRepository.find();
    };
}