import { log } from "winston";
import { AppDataSource } from "../data-source";
import FacultyPhd from "../entity/FacultyPhd";
const FacultyPhdRepository = AppDataSource.getRepository(FacultyPhd);

export default class FacultyPhdServices {

    /**
     * @author: Priya Sawant
     * @function: Get all PHD faculty
     */
    public static getAllFacultyPhd = async () => {
        return await FacultyPhdRepository.find();
    };

    /**
     * @author: Priya Sawant
     * @function: Save FacultyPhd
     * @param facultyPhd 
     */
    public static saveFacultyPhd = async (facultyPhd: FacultyPhd) => {       
        return await FacultyPhdRepository.save(facultyPhd);
    };

    // /**
    //  * @author: Priya Sawant
    //  * @function: Get faculty by id
    //  * @param id 
    //  */
    public static getFacultyPhdById = async (id: number) => {
        return await FacultyPhdRepository.findOneBy({ id: id });
    };

    // /**
    //  * @author: Priya Sawant
    //  * @function: Update faculty by id
    //  * @param id 
    //  * @param faculty 
    //  */
    public static updateFacultyPhdById = async (id: number, facultyPhd: FacultyPhd) => {
        return await FacultyPhdRepository
            .createQueryBuilder()
            .update(FacultyPhd)
            .set(facultyPhd)
            .where("id = :id", { id: id })
            .execute();
    };

    // /**
    //  * @author: Priya Sawant
    //  * @function: Delete faculty by id
    //  * @param id 
    //  */
    public static deleteFacultyPHDById = async (id: number) => {
        return await FacultyPhdRepository
            .createQueryBuilder('master_admission_faculty_phd')
            .delete()
            .from(FacultyPhd)
            .where("id = :id", { id: id })
            .execute();
    };

    // /**
    //  * @author: Priya Sawant
    //  * @function: Get the total faculty count
    //  */
    public static getFacultyPhdCount = async () => {
        return await FacultyPhdRepository.createQueryBuilder().getCount();
    };

    // /**
    //  * @author: Priya Sawant
    //  * @function: Get the faculty data with pagination and search
    //  * @param offset 
    //  * @param limit 
    //  * @param search 
    //  */
    public static getFacultyPHDWithPaginationAndSearch = async (offset: number, limit: number, search: string) => {
        const queryBuilder = FacultyPhdRepository.createQueryBuilder('f');

        if (search !== '') {
            queryBuilder.where('f.faculty_phd_name_admission LIKE :search', { search: `%${search}%` })
                .orWhere('f.faculty_phd_code_admission LIKE :search', { search: `%${search}%` });
        }
        return await queryBuilder.skip(offset).take(limit).getMany();
    };

}