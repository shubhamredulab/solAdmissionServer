import { AppDataSource } from "../data-source";
import Faculty from "../entity/Faculty";
const FacultyRepository = AppDataSource.getRepository(Faculty);

export default class FacultyServices {

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get all faculty
     */
    public static getAllFaculties = async () => {
        return await FacultyRepository.find();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Save faculty data
     * @param faculty 
     */
    public static saveFaculty = async (faculty: Faculty) => {
        return await FacultyRepository.save(faculty);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get faculty by id
     * @param id 
     */
    public static getFacultyById = async (id: number) => {
        return await FacultyRepository.findOneBy({ id: id });
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Update faculty by id
     * @param id 
     * @param faculty 
     */
    public static updateFacultyById = async (id: number, faculty: Faculty) => {
        return await FacultyRepository
            .createQueryBuilder()
            .update(Faculty)
            .set(faculty)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Delete faculty by id
     * @param id 
     */
    public static deleteFacultyById = async (id: number) => {
        return await FacultyRepository
            .createQueryBuilder('master_admission_faculty')
            .delete()
            .from(Faculty)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the total faculty count
     */
    public static getFacultyCount = async () => {
        return await FacultyRepository.createQueryBuilder().getCount();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the faculty data with pagination and search
     * @param offset 
     * @param limit 
     * @param search 
     */
    public static getFacultyWithPaginationAndSearch = async (offset: number, limit: number, search: string) => {
        const queryBuilder = FacultyRepository.createQueryBuilder('f');

        if (search !== '') {
            queryBuilder.where('f.faculty_name_admission LIKE :search', { search: `%${search}%` })
                .orWhere('f.faculty_code_admission LIKE :search', { search: `%${search}%` });
        }
        return await queryBuilder.skip(offset).take(limit).getMany();
    };

}