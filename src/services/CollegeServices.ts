import { College } from "./../entity/College";
import { AppDataSource } from "../data-source";
import { In, Like } from 'typeorm';
const CollegeRepository = AppDataSource.getRepository(College);
const SERVERL_URL = process.env.SERVER_URL;

export default class CollegeServices {
  /**
   * @author: Priyanka Vishwakarma
   * @function: get all college data.
   */
  public static getCollegeData = async () => {
    return await CollegeRepository.find();
  };


  /**
   * @author: Priyanka Vishwakarma
   * @function: save college data.
   * @param college: college data
   */
  public static saveCollege = async (college: College) => {
    return await CollegeRepository.save(college);
  };

  /**
   * @author: Priyanka Vishwakarma
   * @function: Get college data by id 
   * @param id : collge Id 
   */
  public static getCollegeById = async (id: number) => {
    let data = {};
    const college = await CollegeRepository.findOneBy({ id: id });
    data = {
      id: college?.id,
      college_name_admission: college?.college_name_admission,
      college_address_admission: college?.college_address_admission,
      college_code_admission: college?.college_code_admission,
      college_logo_admission: college?.college_logo_admission,
      college_logo_link: college?.college_logo_admission ? `${SERVERL_URL}/api/uploads/collegeLogo/${college.id}/${college.college_logo_admission}` : null,
      university_code_admission: college?.university_code_admission,
      college_type: college?.college_type,
      city: college?.city,
      state: college?.state,
      collegeStatus: college?.collegeStatus
    };
    return data as College;
  };

  /**
   * @author: Priyanka Vishwakarma
   * @function: update college by id
   * @param id : college id
   * @param college: college data you want to update 
   */
  public static updateCollegeById = async (id: number, college: College) => {
    return await CollegeRepository
      .createQueryBuilder()
      .update(College)
      .set(college)
      .where("id = :id", { id: id })
      .execute();
  };

  /**
   * @author: Priyanka Vishwakarma
   * @function: Delete college by id
   * @param id : college id
   */
  public static deleteCollegeById = async (id: number) => {
    return await CollegeRepository
      .createQueryBuilder('master_admission_college')
      .delete()
      .from(College)
      .where("id = :id", { id: id })
      .execute();
  };

  /**
   * @author: Priyanka Vishwakarma
   * @function: update college logo by id
   * @param id: colllege id
   * @param college_logo_admission: college logo file name 
   */
  public static collegeLogoByCollegeId = async (id: number, college_logo_admission: string) => {
    return await CollegeRepository
      .createQueryBuilder()
      .update(College)
      .set({ college_logo_admission: college_logo_admission })
      .where('id = :id', { id: id })
      .execute();
  };

  /*
 Author: Rutuja Patil.
 Description: this function use for get the  Data by using college name.
 */
  public static getDataByCollegeName = async (id: number) => {
    return await CollegeRepository.query(`
    SELECT
    ca.*,
    cam.course_name_admission,
    sg.group_combination_admission
    FROM 
     master_admission_college as ca
     JOIN master_admission_college_course as cca on cca.college_id_admission=ca.id
     JOIN master_admission_course as cam on cam.id = cca.course_id_admission
     LEFT JOIN master_admission_subject_group as sg on sg.course_id_admission = cca.course_id_admission
     where 
     ca.id = ${id}
    `);
  };

  /*
Author: Rutuja Patil.
Description: this function use for get All College Data.
*/
  public static getCollegeDatas = async (where_collegeName: string, where_courseName: string, where_groupName: string, where_collegeType: string, where_city: string, where_state: string, where_degreeType: string) => {
    let query = `
  SELECT
    clm.college_name_admission,
    cam.course_name_admission,
    clm.college_code_admission,
    clm.id,
    cca.id AS college_course_id,
    clm.college_type,
    clm.city,
    clm.state,
    cam.degree 
  FROM
    master_admission_course AS cam
    JOIN master_admission_college_course AS cca ON cam.id = cca.course_id_admission
    JOIN master_admission_college AS clm ON clm.id = cca.college_id_admission
    LEFT JOIN master_admission_subject_group AS sga ON sga.id = cca.subject_group_id_admission
  WHERE 
    cam.degree IN (${where_degreeType})`;
    if (where_collegeName !== '') {
      query += ` AND clm.college_name_admission LIKE "%${where_collegeName}%" `;
    }
    if (where_courseName !== '') {
      query += ` AND cam.course_name_admission LIKE "%${where_courseName}%" `;
    }
    if (where_groupName !== '') {
      query += ` AND sga.group_combination_admission LIKE "%${where_groupName}%" `;
    }
    if (where_collegeType !== '') {
      query += ` AND clm.college_type LIKE "%${where_collegeType}%" `;
    }
    if (where_city !== '') {
      query += ` AND clm.city LIKE "%${where_city}%" `;
    }
    if (where_state !== '') {
      query += ` AND clm.state LIKE "%${where_state}%" `;
    }
    return await CollegeRepository.query(query);
  };

  public static getAllCollegesData = async (degree: string[]) => {
    const data1 = degree.map(value => `'${value}'`).join(', ');
    return await CollegeRepository.query(`
    select Distinct ca.id,ca.college_name_admission,ca.college_code_admission from master_admission_college AS ca 
    JOIN master_admission_college_course AS cma ON cma.college_id_admission = ca.id
    JOIN master_admission_course AS cam ON cam.id = cma.course_id_admission
    where cam.degree IN(${data1})`);
  };

  /**
   * @author: Priyanka Vishwakarma
   * @function: Get the college count
   */
  public static getCollegeCount = async () => {
    return await CollegeRepository.createQueryBuilder().getCount();
  };

  /**
   * Author: Priyanka Vishwakarma
   * @function: This function is used to get college and search data.
   * @param offset 
   * @param limit 
   * @param search 
   */
  public static getCollegeDataWithPaginationAndSearch = async (offset: number, limit: number, search: string) => {
    const queryBuilder = CollegeRepository.createQueryBuilder('c');
    if (search !== '') {
      queryBuilder.where(`c.college_name_admission LIKE :search`, { search: `%${search}%` })
        .orWhere(`c.college_code_admission LIKE :search`, { search: `%${search}%` })
        .orWhere(`c.college_address_admission LIKE :search`, { search: `%${search}%` });
    }
    return await queryBuilder.skip(offset).take(limit).getMany();
  };

  public static getColleges = async () =>{
    return await CollegeRepository.find({where: [
      { college_name_admission: Like('%KC College%') },
      { college_name_admission: Like('%HR College%') }
    ]});
  };

  public static findCollegeNameBYId = async (collegeIds:number) => {
    // return await CollegeRepository.createQueryBuilder('master_admission_college')
    //         .select('DISTINCT(master_admission_college.college_name_admission)', 'college_name_admission')
    //         .where({ id: In([collegeIds]) })
    //         .getRawMany();
    return await CollegeRepository.find({ where: { id : In([collegeIds])} });
  };
  
  /*
    Author: Tiffany Correia.
    Description: This function is used for getting all College Details.
    */
    public static getDataCollege = async () => {
      return await CollegeRepository.find();
    };

    /*
  Author: Rutuja Patil.
  Description: this function use for get course details based on the college Name.
  */        
  public static getCollegeDetails = async (collegeId : number) => {
    return await CollegeRepository.find({where:{id:collegeId}});
};
}
