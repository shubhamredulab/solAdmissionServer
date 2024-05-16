import { Preferences } from "../entity/Preferences";
import { AppDataSource } from "../data-source";
const PreferencesRepository = AppDataSource.getRepository(Preferences);
import { IAdmissionType } from '../types/preferences';

export class PreferencesServices {
  /*
  Author: Rutuja Patil.
  Description: this function use for save  preferences which is selected by student in master_admission_preferences table.
  */
  public static savePreferenceData = async (
    collegeId: number,
    userId: number,
    degreeType: IAdmissionType,
    value: boolean
  ) => {
    const existingRecord = await PreferencesRepository.findOneBy({
      userId: userId
    });
    if (existingRecord) {
      // Check if collegeCode is not already in the preferences array
      if (!existingRecord.preferences.includes(collegeId)) {
        existingRecord.preferences.push(collegeId);

        const update = await PreferencesRepository.createQueryBuilder()
          .update(Preferences)
          .set({ preferences: existingRecord.preferences, last_submitted_date: new Date() })
          .where("userId = :userId", { userId: userId })
          .execute();

        return update;
      } else {
        // College code already exists in preferences, no need to update
        return "Duplicate collegeCode";
      }
    } else {
      // Create a new record if it doesn't exist
      return await PreferencesRepository.save({
        userId: userId,
        preferences: [collegeId],
        admissionType: degreeType,
        isSubmitted: value,
        submitted_date: new Date(),
        last_submitted_date: new Date()
      });
    }
  };

  /*
 Author: Rutuja Patil.
 Description: this function use for Stepper.
 */
  public static checkStepper = async (id: number) => {
    const user = await PreferencesRepository.find({ where: { userId: id } });

    return user;
  };

  /*
 Author: Rutuja Patil.
 Description: this function use for get preference data from preference table.
 */
  public static getpreference = async (userID: number) => {
    return PreferencesRepository.findOne({ where: { userId: userID } });

  };

  /*
 Author: Rutuja Patil.
 Description: this function use for get submitted data from master_admission_preferences table.
 */
  public static getSubmitData = async (userId: number) => {
    return PreferencesRepository.find({
      where: {
        userId: userId
      }
    });
  };

  /*
    Author: Rutuja Patil.
    Description: this function use for get students preference details based on the userId.
    */
  public static getPreferencesData = async (userId: number) => {
    return await PreferencesRepository.query(`SELECT
    cam.course_name_admission,
    ca.college_name_admission,
    ca.college_type,
		ca.id AS collegeId,
		cam.id AS courseId,
    cam.degree,
		cam.course_code_admission,
    ca.city,
    ca.state,
    ca.college_code_admission,
    pre.submitted_date,
    pre.last_submitted_date,
    sg.group_combination_admission 
  FROM
  master_admission_preferences AS pre
    JOIN master_admission_college_course AS co ON JSON_CONTAINS(
      pre.preferences,
    JSON_ARRAY( co.id ))
    JOIN master_admission_college AS ca ON ca.id = co.college_id_admission
    JOIN master_admission_course AS cam ON cam.id = co.course_id_admission
    LEFT JOIN master_admission_subject_group AS sg ON sg.course_id_admission = cam.id
  WHERE
    pre.userId = ${userId}`);
  };

  public static admissionTypeCounts = async () => {
    const admissionTypeCounts = await PreferencesRepository.createQueryBuilder('master_admission_preferences')
      .select(['master_admission_preferences.admissionType', 'COUNT(master_admission_preferences.admissionType) as count'])
      .groupBy('master_admission_preferences.admissionType')
      .getRawMany();
    return admissionTypeCounts;
  };

  public static PreferenceNotify = async () => {
    const user = await PreferencesRepository.find();

    return user;
  };

  public static searchingID = async (collegeCode: number) => {

    const user = await PreferencesRepository.query(
      `SELECT * FROM preferences where JSON_CONTAINS(preferences, '${collegeCode}')`

    );
    return user;
  };

  /*
Author: Pranali Gambhir
Description: This function is used to get count of all preferences within selected date range for admin and superadmin dashboard.
*/
  public static getPreferencesInDateRange = async (startDate: string, endDate: string) => {
    return await PreferencesRepository
      .createQueryBuilder('preference')
      .select('preference.admissionType', 'admissionType')
      .addSelect('COUNT(preference.id)', 'count')
      .where('preference.createdAt >= :startDate AND preference.createdAt <= :endDate', { startDate, endDate })
      .groupBy('preference.admissionType')
      .getRawMany();
  };

  /*
Author: Pranali Gambhir
Description: This function is used to get count of all preferences for a selected date for admin and superadmin dashboard.
*/
  public static getPreferencesForDay = async (date: string) => {
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

    return await PreferencesRepository
      .createQueryBuilder('preference')
      .select('preference.admissionType', 'admissionType')
      .addSelect('COUNT(preference.id)', 'count')
      .where('preference.createdAt >= :startOfDay', { startOfDay })
      .andWhere('preference.createdAt < :endOfDay', { endOfDay })
      .groupBy('preference.admissionType')
      .getRawMany();
  };

  public static getPreferences = async (userId: number) => {
    return PreferencesRepository.findOne({ where: { userId: userId } });
  };

}
