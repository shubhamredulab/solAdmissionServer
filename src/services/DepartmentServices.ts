import { AppDataSource } from "../data-source";
import Department from "../entity/Department";
const DepartmentRepository = AppDataSource.getRepository(Department);

export default class DepartmentServices {
    /**
     * @author: Priyanka Vishwakarma
     * @function: Get all departments
     */
    public static getAllDepartments = async () => {
        return await DepartmentRepository.find();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Save department
     * @param department: Department 
     */
    public static saveDepartment = async (department: Department) => {
        return await DepartmentRepository.save(department);
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the department by id
     * @param id 
     */
    public static getDepartmentById = async (id: number) => {
        return await DepartmentRepository.findOneBy({ id: id });
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Update department data by id
     * @param id 
     * @param department 
     */
    public static updateDepartmentById = async (id: number, department: Department) => {
        return await DepartmentRepository
            .createQueryBuilder()
            .update(Department)
            .set(department)
            .where("id = :id", { id: id })
            .execute();
    };

    public static deleteDepartmentById = async (id: number) => {
        return await DepartmentRepository
            .createQueryBuilder('master_admission_department')
            .delete()
            .from(Department)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the departments count
     */
    public static getDepartmentsCount = async () => {
        return await DepartmentRepository.createQueryBuilder().getCount();
    };

    /**
     * @author: Priyanka Vishwakarma
     * @function: Get the departments data with pagination and search
     * @param offset 
     * @param limit 
     * @param search 
     */
    public static getDepartmentsPaginationAndSearch = async (offset: number, limit: number, search: string) => {
        const queryBuilder = DepartmentRepository.createQueryBuilder('d');

        if (search !== '') {
            queryBuilder.where(`d.department_name_admission LIKE :search`, { search: `%${search}%` })
                .orWhere(`d.department_code_admission LIKE :search`, { search: `${search}` });
        }
        return await queryBuilder.skip(offset).take(limit).getMany();
    };
    
}