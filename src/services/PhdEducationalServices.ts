import { AppDataSource } from "../data-source";
import { PhdEducationalDetails } from "../entity/PhdEducationalDetails";
const PhdEduDetailsRepository = AppDataSource.getRepository(PhdEducationalDetails);

export class PhdEducationalService {

  public static addEduDetails = async (eduData: PhdEducationalDetails, userId: number, degreeType: string) => {
    return await PhdEduDetailsRepository.save({ ...eduData, userId: userId, admissionType: degreeType });
  };

  public static updateEduDetails = async (eduData: PhdEducationalDetails, userId: number
  ) => {
    const update = await PhdEduDetailsRepository.createQueryBuilder()
      .update(PhdEducationalDetails)
      .set(eduData)
      .where("userId = :userId", { userId: userId })
      .execute();
    return update;
  };

  public static eduDetails = async (userId: number) => {
    const eduDetails = await PhdEduDetailsRepository.findOneBy({ userId });
    return eduDetails;
  };

  public static getEduData = async (userId: number) => {
    return await PhdEduDetailsRepository.findOneBy({
      userId: userId
    });

  };

  public static checkStepper = async (id: number) => {
    const user = await PhdEduDetailsRepository.find({ where: { userId: id } });

    return user;
  };

  public static saveSetDetails = async (EntranceData: any, userId: number) => {
    const data = await this.eduDetails(userId);
    if (!data) {
      return await PhdEduDetailsRepository.save({ setEntranceDetails: [EntranceData], userId: userId });
    } else {
      return await PhdEduDetailsRepository.createQueryBuilder()
        .update(PhdEducationalDetails)
        .set({ setEntranceDetails: [EntranceData] })
        .where("userId = :userId", { userId: userId })
        .execute();
    }
  };

  public static saveMphilDetails = async (EntranceData: any, userId: number) => {
    const data = await this.eduDetails(userId);
    if (!data) {
      return await PhdEduDetailsRepository.save({ mphilEntranceDetails: [EntranceData], userId: userId });
    } else {
      return await PhdEduDetailsRepository.createQueryBuilder()
        .update(PhdEducationalDetails)
        .set({ mphilEntranceDetails: [EntranceData] })
        .where("userId = :userId", { userId: userId })
        .execute();
    }
  };

  public static saveNetDetails = async (EntranceData: any, userId: number) => {
    const data = await this.eduDetails(userId);
    if (!data) {
      return await PhdEduDetailsRepository.save({ netEntranceDetails: [EntranceData], userId: userId });
    } else {
      return await PhdEduDetailsRepository.createQueryBuilder()
        .update(PhdEducationalDetails)
        .set({ netEntranceDetails: [EntranceData] })
        .where("userId = :userId", { userId: userId })
        .execute();
    }
  };

  public static saveGateDetails = async (EntranceData: any, userId: number) => {
    const data = await this.eduDetails(userId);
    if (!data) {
      return await PhdEduDetailsRepository.save({ gateEntranceDetails: [EntranceData], userId: userId });
    } else {
      return await PhdEduDetailsRepository.createQueryBuilder()
        .update(PhdEducationalDetails)
        .set({ gateEntranceDetails: [EntranceData] })
        .where("userId = :userId", { userId: userId })
        .execute();
    }
  };

  public static getEntranceDetails = async (userId: number) => {
    return await PhdEduDetailsRepository.find({ where: { userId: userId } });
  };

  public static deleteEntranceDetails = async (userId: number) => {
    return await PhdEduDetailsRepository.createQueryBuilder()
      .update(PhdEducationalDetails)
      .set({ setEntranceDetails: [], netEntranceDetails: [], gateEntranceDetails: [], mphilEntranceDetails: [] })
      .where("userId = :userId", { userId: userId })
      .execute();
  };

  public static deleteSetEntranceDetails = async (userId: number) => {
    return await PhdEduDetailsRepository.createQueryBuilder()
      .update(PhdEducationalDetails)
      .set({ setEntranceDetails: [] })
      .where("userId = :userId", { userId: userId })
      .execute();
  };

  public static deleteMphilEntranceDetails = async (userId: number) => {
    return await PhdEduDetailsRepository.createQueryBuilder()
      .update(PhdEducationalDetails)
      .set({ mphilEntranceDetails: [] })
      .where("userId = :userId", { userId: userId })
      .execute();
  };

  public static deleteNetEntranceDetails = async (userId: number) => {
    return await PhdEduDetailsRepository.createQueryBuilder()
      .update(PhdEducationalDetails)
      .set({ netEntranceDetails: [] })
      .where("userId = :userId", { userId: userId })
      .execute();
  };

  public static deletegateEntranceDetails = async (userId: number) => {
    return await PhdEduDetailsRepository.createQueryBuilder()
      .update(PhdEducationalDetails)
      .set({ gateEntranceDetails: [] })
      .where("userId = :userId", { userId: userId })
      .execute();
  };

}