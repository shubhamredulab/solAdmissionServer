import { EducationalDetails } from "./../entity/EductionalDetails";
import { AppDataSource } from "../data-source";
import { PGDetails } from "../entity/PGDetails";
import { DeepPartial } from "typeorm";
const EducationalRepository = AppDataSource.getRepository(EducationalDetails);
const PGDetailsRepository=AppDataSource.getRepository(PGDetails);
export class EducationalServices {
  
   /*
 Author: Rutuja Patil.
 Description: this function use for check data already in educational_details table or not using userId
 */
  public static eduDetails = async (userId: number) => {
    const eduDetails = await EducationalRepository.findOneBy({ userId });
    return eduDetails;
  };

  public static educationDetails = async (userId: number) => {
    const educationDetails = await EducationalRepository.find({where:{userId: userId}});
    return educationDetails;
  };

   /*
 Author: Rutuja Patil.
 Description: this function use for add student educational data if that student data is not already in educational_details.
 */
  public static addEduDetails = async (
    eduData: EducationalDetails,
    userId: number,
    degreeType: string
    
  ) => {
    return await EducationalRepository.save({
      ...eduData,
      userId:userId,
      admissionType: degreeType
    });
  };

  /*
 Author: Rutuja Patil.
 Description: this function use for update student educational data if that student data is  already in educational_details.
 */
  public static updateEduDetails = async (
    eduData: EducationalDetails,
    userId: number
  ) => {
    const update = await EducationalRepository.createQueryBuilder()
      .update(EducationalDetails)
      .set(eduData)
      .where("userId = :userId", { userId: userId })
      .execute();
    return update;
  };

  public static getEduData = async (userId: number) => {
   return await EducationalRepository.findOneBy({
      userId: userId
    });
   
  };

   /*
 Author: Rutuja Patil.
 Description: this function use for Stepper.
 */
  public static checkStepper = async (id: number) => {
    const user = await EducationalRepository.findOneBy({ userId: id });
    return user;
  };

  public static updateData = async (eduData: any, userId: number) => {
    const updatedData = await EducationalRepository
        .createQueryBuilder()
        .update(EducationalDetails)
        .set(eduData)
        .where('userId = :userId', { userId: userId })
        .execute();
    return updatedData;
};
  static geteducationdata = async (userId: number) => {
    const user = await EducationalRepository.findOneBy({ userId: userId });
    return user;

  };

  /**
   *@author:Rutuja Patil
   *@description:To save biology and math percentage in table educational_details.
   */
  public static savePrcentage = async (mathPercentage:number, bioPercentage:number, userId: number) => {
   return await EducationalRepository.createQueryBuilder()
      .update(EducationalDetails)
      .set({biologyPercentage: bioPercentage, mathPercentage:mathPercentage})
      .where("userId = :userId", { userId: userId })
      .execute();
  };

  /*
  Author: Shivram Sahu.
  Description: this function use for saving PG Details
  */
  public static savePGDetails = async (details: DeepPartial<PGDetails>) => {
    const pgDetails = await PGDetailsRepository.save(details);
    return pgDetails;
  };

  /*
 Author: Shivram Sahu.
 Description: this function use for updating student PG Details.
 */
  public static updatePGDetails = async (
    pgDetails: DeepPartial<PGDetails>,
    id = pgDetails.id
  ) => {
    const update = await PGDetailsRepository.createQueryBuilder()
      .update(PGDetails)
      .set(pgDetails)
      .where("id = :id", { id: id })
      .execute();
    return update;
  };

  /*
  Author: Shivram Sahu.
  Description: this function use for updating student PG Details.
  */
  static deletePGDetails = async (id: number) => {
    const result = await PGDetailsRepository.delete({ id: id });
    return result;

  };

  /**
     *@author:Shivram Sahu
     *@description:To function is to get PG Details for a paticular user.
     */
  public static getPGDetails = async (userId: number) => {
    const result = await PGDetailsRepository.find({ where: { userId: userId } });
    return result;

  };



}
