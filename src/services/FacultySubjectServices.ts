import { AppDataSource } from '../data-source';
import FacultySubject from '../entity/FacultySubject';
const FacultySubjectRepository = AppDataSource.getRepository(FacultySubject);

export default class FacultySubjectServices {

    public static getSubjectName = async (facultyName: string) => {
        return await FacultySubjectRepository.query(`SELECT
        sub.subject_phd_name_admission,
        fs.faculty_phd_id_admission AS faculty_id,
        fs.subject_phd_id_admission AS subject_id 
    FROM
        master_admission_subject_phd AS sub
        JOIN master_admission_faculty_subject AS fs ON fs.subject_phd_id_admission = sub.id
        JOIN master_admission_faculty_phd AS fac ON fac.id = fs.faculty_phd_id_admission
    WHERE
    fac.faculty_phd_name_admission like '%${facultyName}%' `);
    };

    /**
     * @author: Priya Sawant
     * @function: Get all PHD faculty Subject
     */
    public static getFacultyPhdName = async (subjectName: string) => {
        return await FacultySubjectRepository.query(`SELECT
        fac.faculty_phd_name_admission,
        sub.subject_phd_name_admission,
        fs.faculty_phd_id_admission AS faculty_id,
        fs.subject_phd_id_admission AS subject_id 
    FROM 
        master_admission_faculty_subject AS sub
        JOIN master_admission_faculty_subject AS fs ON fs.subject_phd_id_admission = sub.id
        JOIN master_admission_faculty_phd AS fac ON fac.id = fs.faculty_phd_id_admission 
    WHERE
        sub.subject_phd_name_admission like '%${subjectName}%' `);
    };

    /**
     * @author: Priya Sawant
     * @function: Get all PHD faculty Subject for limit offset
     */
    public static getFacultySubjectData = async (offset: number, limit: number, search: string) => {
        try {
            const query = `
                SELECT
                    fs.id,
                    f.faculty_phd_name_admission,
                    s.subject_phd_name_admission 
                FROM
                    master_admission_faculty_subject AS fs
                    LEFT JOIN master_admission_faculty_phd AS f ON fs.faculty_phd_id_admission = f.id
                    LEFT JOIN master_admission_subject_phd AS s ON fs.subject_phd_id_admission = s.id 
                WHERE
                fs.subject_phd_id_admission = s.id `;
    
            const parameters = [
                limit ? limit : 10,
                offset ? offset : 0,
                search ? `%${search}%` : '' // assuming search is used in a LIKE clause
            ];
    
            return await FacultySubjectRepository.query(query, parameters);
        } catch (error: any) { // Explicitly type error as any
            throw new Error(`Error in getFacultySubjectData service: ${(error as Error).message}`);
        }
    };

    /**
     * @author: Priya Sawant
     * @function: save PHD faculty Subject
     */
    public static saveFacultySubject = async (facultySubject: FacultySubject) => {
        try {
            const savedFacultySubject = await FacultySubjectRepository.save(facultySubject);
            return savedFacultySubject;
        } catch (error) {
            throw new Error(`Failed to save faculty subject: ${error}`);
        }
    };

    /**
     * @author: Priya Sawant
     * @function: update PHD faculty Subject
     */
    public static updateFacultySubject = async (id: number, facultySubject: FacultySubject) => {
        return await FacultySubjectRepository
            .createQueryBuilder()
            .update(FacultySubject)
            .set(facultySubject)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priya Sawant
     * @function: get all faculty Subject by id
     */
    public static getFacultySubjectById = async (id: number) => {
        return await FacultySubjectRepository.findOneBy({id:id});
    };

    /**
     * @author: Priya Sawant
     * @function: delete PHD faculty Subject
     */
    public static deleteFacultySubjectById = async (id: number) => {
    
        return await FacultySubjectRepository
            .createQueryBuilder('master_admission_faculty_subject')
            .delete()
            .from(FacultySubject)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
     * @author: Priya Sawant
     * @function: Get the total faculty subject count
     */
    public static getFacultySubjectCount = async () => {
        return await FacultySubjectRepository.createQueryBuilder().getCount();
    };

    /**
     * @author: Priya Sawant
     * @function: Get the faculty subject data with pagination and search
     * @param offset 
     * @param limit 
     * @param search 
     */
    public static getFacultySubjectPHDWithPaginationAndSearch = async (offset: number, limit: number, search: string) => {
        const queryBuilder = FacultySubjectRepository.createQueryBuilder('fs');

        if (search !== '') {
            queryBuilder.where('fs.faculty_phd_name_admission LIKE :search', { search: `%${search}%` })
                .orWhere('fs.subject_phd_name_admission LIKE :search', { search: `%${search}%` });
        }
        return await queryBuilder.skip(offset).take(limit).getMany();
    };

}