import MenuItem from '../entity/MenuItem';
import { AppDataSource } from '../data-source';
import TabMenu from '../entity/TabMenu';
const accessRepository = AppDataSource.getRepository(MenuItem);
const tabRepository= AppDataSource.getRepository(TabMenu);
export class AccessServices {
  /**
   * @author Moin
   * @description This function is used to retrieve menu names from the tab menu table.
   */

  public static getAccessData = async () => {
    return await tabRepository.find({ select: ['tabName'] });
  };
  /**
   * @author Moin
   * @description This function is used to retrieve user-specific menu names from the menuItem table.
   */

  public static getAccessDataS = async (userId: number) => {
    return await accessRepository.find({ select: ['menuName'], where: { userId: userId } });
  };
  /**
   * @author Moin
   * @description This function is used to retrieve user-specific data from the menuItem table.
   */

  public static findUser = async (id: number) => {
    const findUser = await accessRepository.findOne({ where: { userId: id } });
    return findUser;
  };
  /**
   * @author Moin
   * @description This function is used to update user-specific menu names in the menuItem table.
   */

  public static updateUserData = async (userId: number, viewData: string[]) => {
    const updateResult = await accessRepository.createQueryBuilder()
      .update(MenuItem)
      .set({ menuName: viewData })
      .where('userId = :userId', { userId: userId })
      .execute();
    return updateResult;
  };
  /**
   * @author Moin
   * @description This function is used to create user-specific menus from the menuItem table.
   */

  public static createUserData = async (id: number, role: string, viewData: string[], email: string) => {
    const createRole = await accessRepository.save({ userId: id, role: role, menuName: viewData, email: email });
    return createRole;
  };
  /**
   * @author Moin
   * @description This function is used to update the user-specific degree type in the database.
   */

  public static updateDegree = async (userId: number, degreeType: string[]) => {
    const updateResult = await accessRepository.createQueryBuilder()
      .update(MenuItem)
      .set({ degreeType: degreeType })
      .where('userId = :userId', { userId: userId })
      .execute();
    return updateResult;
  };
  /**
   * @author Moin
   * @description This function saves the user-specific degree type.
   */

  public static createDegreeType = async (id: number, degreeType: string[], adminRole: string, adminEmail: string) => {
    const createDegree = await accessRepository.save({ userId: id, degreeType: degreeType, role: adminRole, email: adminEmail });
    return createDegree;
  };
  /**
   * @author Moin
   * @description This function is used to update user-specific column names in the menuItem table.
   */

public static updateUserColumnData = async (userId: number, viewData: string[]) => {
  const updateResult = await accessRepository.createQueryBuilder()
    .update(MenuItem)
    .set({ columnName: viewData })
    .where('userId = :userId', { userId: userId })
    .execute();
  return updateResult;
};
  /**
   * @author Moin
   * @description This function is used to retrieve user-specific column names from the menuItem table.
   */

public static getColumnNameAccess = async (userId: number) => {
  try {
    const result = await accessRepository
      .createQueryBuilder('access')
      .select(['access.columnName'])
      .where('access.userId = :userId', { userId })
      .getMany();

    return result.map((access) => access.columnName);
  } catch (error) {
    console.error('Error fetching column names:', error);
    throw error; 
  }
};
  /**
   * @author Moin
   * @description This function updates college and course data in the database.
   */

public static updateCollegeAndCourse =async(userId: number, collegeId:number[], courseData:number[])=>{
  const updateCollegeData = await accessRepository.createQueryBuilder()
    .update(MenuItem)
    .set({ courseId: courseData, collegeId:collegeId})
    .where('userId = :userId', { userId: userId })
    .execute();
  return updateCollegeData;
};
  /**
   * @author Moin
   * @description This function is used to add college and course information on a user-specific basis.
   */

public static createCollegeAndCourse = async (id: number, collegeId:number[], courseData: number[], adminRole: string, adminEmail: string) => {
  const createCollegeAndCourse = await accessRepository.save({userId: id, collegeId:collegeId, CourseId: courseData, role: adminRole, email: adminEmail });
  return createCollegeAndCourse;
};
  /**
   * @author Moin
   * @description This function creates college and course data in the database.
   */

public static getCollegeAndCourse = async (userId: number) => {
  try {
    const result = await accessRepository
      .createQueryBuilder('access')
      .select(['access.courseId', 'access.collegeId'])
      .where('access.userId = :userId', { userId })
      .getMany();
    return result.map((access) => ({ courseId: access.courseId, collegeId: access.collegeId }));
  } catch (error) {
    console.error('Error fetching column names:', error);
    throw error; 
  }
};
  /**
   * @author Moin
   * @description Removes the unwanted courseId from the database.
   */
  public static deleteCourse = async (userId: number, courseId: number) => {
    const accessRecord = await accessRepository.findOne({ where: { userId: userId } });
    if (accessRecord) {
      accessRecord.courseId = accessRecord.courseId.filter(id => id !== courseId);

      await accessRepository.save(accessRecord);
    }
    return accessRecord;
  };

  /**
  * @author Moin 
  * @description This function is used to automatically add the tabMenu inside the table after the table is created.
 /*/

  public static findOrCreateMany = async (data: { tabName: string }[])=>{
    const tabs: TabMenu[] = [];
    for (const item of data) {
        let tab = await tabRepository.findOne({
            where: { tabName: item.tabName }
        });

        if (!tab) {
            tab = tabRepository.create(item);
            await tabRepository.save(tab);
        }

        tabs.push(tab);
    }

    return tabs;
};
  /**
  * @author Moin 
  * @description This function is used to get the college detail with user id .
 /*/
public static getAdminWiseCollegeData = async (userId:number)=>{
  return await accessRepository.query(`
  SELECT clg.* FROM master_admission_menuitem as acc LEFT JOIN master_admission_college as clg ON acc.collegeId = clg.id  WHERE acc.userId =${userId}
  `);
};
  /**
  * @author Moin 
  * @description This function is used to get the assign course detail using college id wise .
 /*/
public static findAdminCollegeId = async (collegeId: number) => {
  return await accessRepository.query(`
  SELECT DISTINCT cor.id AS id, cor.course_name_admission FROM master_admission_menuitem AS clgCor JOIN master_admission_college AS clg ON clgCor.collegeId = clg.id JOIN master_admission_course AS cor ON FIND_IN_SET(cor.id, REPLACE(REPLACE(REPLACE(clgCor.courseId, ' ', ''), '[', ''), ']', '')) WHERE clg.id = ${collegeId}`);
};
/*
Author: Moin
Description: this function use to get the  the menu name from tab menu table
*/
public static getAccessDataWithPagination = async (limit: number, offset: number) => {
  let limitOffset = "";
  if (offset !== undefined && limit !== undefined) {
    limitOffset = " LIMIT " + limit + " OFFSET " + offset;
  }
  const query = "SELECT t.tabName FROM `master_admission_tabmenu` as t" + limitOffset;
  const data = await tabRepository.query(query);
  return data;
};
  /**
   * @author Moin
   * @description Removes the unwanted courseId from the database.
   */
  public static deleteCollege = async (userId: number, collegeId: number) => {
    const accessRecord = await accessRepository.findOne({ where: { userId: userId } });
    if (accessRecord) {
      accessRecord.collegeId = accessRecord.collegeId.filter((id: number) => id !== collegeId);
      await accessRepository.save(accessRecord);
    }
    return accessRecord;
  };
  public static updateExistCollegeWiseCourse = async (id: number, courseData: number[]) => {
    const existingData = await accessRepository.findOne({
      where: { userId: id }
  });
    if (!existingData) {
      throw new Error('Record not found');
    }
      // Filter out duplicate course IDs from courseData
      const uniqueCourseData = courseData.filter((courseId) => !existingData.courseId.includes(courseId));
    existingData.courseId.push(...uniqueCourseData);
  
    const updatedData = await accessRepository.save(existingData);
  
    return updatedData;
  };
  public static updateNewCollegeAndCourse = async (id: number, collegeId: number[], courseData: number[]) => {
  
    const existingData = await accessRepository.findOne({
      where: { userId: id }
  });
    if (!existingData) {
      throw new Error('Record not found');
    }
    if (!Array.isArray(existingData.collegeId)) {
      existingData.collegeId = [];
    }
  
    if (!Array.isArray(existingData.courseId)) {
      existingData.courseId = [];
    }
    existingData.collegeId.push(...collegeId);
    existingData.courseId.push(...courseData);
  
    const updatedData = await accessRepository.save(existingData);
  
    return updatedData;
  };

      /*
Author: Moin
Description: this function use to get  the user wise data  from menuItem table
*/
public static findUserCollegeId = async (id: number, userId:number) => {
  const query =`SELECT mu.*
  FROM master_admission_menuitem AS mu
  WHERE mu.collegeId LIKE '%${id}%'
  AND mu.userId = ${userId};`;
    const data = await accessRepository.query(query);
    return data;
  
  };
  
  public static addMoreCollegeAndCourse = async (id: number, collegeId: number[], courseData: number[]) => {
    const createCollegeAndCourse = await accessRepository.save({ userId: id, collegeId: collegeId, CourseId: courseData});
    return createCollegeAndCourse;
  };
  public static findCheckCollegeId = async (id: number) => {
    const query =`SELECT mu.*
    FROM master_admission_menuitem as mu
    WHERE FIND_IN_SET('${id}', REPLACE(REPLACE(mu.collegeId, '[', ''), ']', '')) > 0
   `;
      const data = await accessRepository.query(query);
      return data;
    };
}
