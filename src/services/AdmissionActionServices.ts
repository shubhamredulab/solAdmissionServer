import { DeepPartial, FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import AdmissionAction from "../entity/AdmissionAction";
const admissionActionRepository = AppDataSource.getRepository(AdmissionAction);

export default class AdmissionActionServices {

  /*Author: PriyaSawant */
  public static addAdmissionType = async (admissionType: DeepPartial<AdmissionAction>) => {
    const admissionTypeSave = await admissionActionRepository.save(admissionType);
    return admissionTypeSave;
  };

  /*Author: PriyaSawant */
  public static updateStatus = async (id: number, change: string) => {
    const updateResult = await admissionActionRepository.createQueryBuilder()
      .update(AdmissionAction)
      .set({ status: change })
      .where('id = :id', { id: id })
      .execute();
    return updateResult;
  };

  /*Author: PriyaSawant */
  public static updateAdmissionSchedule = async (data: any) => {
    const { admissionType } = data;
    delete data.admissionType;
    const startTime = data.startTime;
    const endTime = data.endTime;
    const updatedData = {
      startTime: startTime,
      endTime: endTime
    };
    const mergedData = { ...data, ...updatedData };

    try {
      const updatedSchedule = await admissionActionRepository
        .createQueryBuilder()
        .update(AdmissionAction)
        .set(mergedData)
        .where('admissionType = :admissionType', { admissionType })
        .execute();

      return updatedSchedule;
    } catch (error) {
      console.error('Error updating admission schedule:', error);
    }
  };

  /*
Author: Pranali Gambhir
Description: This function is used to retrieve the admission schedule of UG and PG programs from admission_action table.
*/
  public static getSchedule = async () => {
    return await admissionActionRepository.find();
  };

  public static registerPage = async () => {
    return await admissionActionRepository.find();
  };

  public static getData = async () => {
    return await admissionActionRepository.find();
  };

  public static getScheduleById = async (id: number) => {
    const options: FindOneOptions<AdmissionAction> = {
      where: {
        id: id
      }
    };
    return await admissionActionRepository.findOne(options);
  };

}