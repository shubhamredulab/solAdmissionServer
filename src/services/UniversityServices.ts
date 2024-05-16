import { AppDataSource } from "../data-source";
import University from "../entity/University";
const UniversityRepository = AppDataSource.getRepository(University);

export default class UniversityServices {

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get all university
     */
    public static getAllUniversities = async () => {
        return await UniversityRepository.find();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Save university data
     * @param university 
     */
    public static saveUniversity = async (university: University) => {
        return await UniversityRepository.save(university);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the university by id
     * @param id 
     */
    public static getUniversityById = async (id: number) => {
        return await UniversityRepository.findOneBy({ id });
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Update university by id
     * @param id 
     * @param data 
     */
    public static updateUniversityById = async (id: number, data: University) => {
        return await UniversityRepository
            .createQueryBuilder()
            .update(University)
            .set(data)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Delete university by id
     * @param id 
     */
    public static deleteUniversityById = async (id: number) => {
        return await UniversityRepository
            .createQueryBuilder('master_admission_university')
            .delete()
            .from(University)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
    * @author: Priyanka Vishwakarma
    * @function: Get the total university count
    */
    public static getUniversityCount = async () => {
        return await UniversityRepository.createQueryBuilder().getCount();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the university data with pagination and search
     * @param offset 
     * @param limit 
     * @param search 
     */
    public static getUniversityWithPaginationAndSearch = async (offset: number, limit: number, search: string) => {

        const queryBuilder = UniversityRepository.createQueryBuilder('u');

        if (search !== '') {
            queryBuilder.where(`u.university_name_admission LIKE :search`, { search: `%${search}%` })
                .orWhere(`u.university_code_admission LIKE :search`, { search: `%${search}%` })
                .orWhere(`u.university_address_admission LIKE :search`, { search: `%${search}%` });
        }

        return await queryBuilder.skip(offset).take(limit).getMany();
    };
    
}