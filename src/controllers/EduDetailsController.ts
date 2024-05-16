import { NextFunction, Request, Response } from "express";
import { EducationalServices } from "../services/EducationServices";
import {
  pgEduData,
  ugEduData,
  sscSelectedMarks,
  validationOptions,
  hscSelectedMarks,
  hscSelectedGrade,
  sscSelectedGrade,
  ugSelectedMarks,
  ugSelectedGrade,
  ugQualification,
  ugEntranceExam
} from "../validator/educational";
import logger from "../utils/winston";
import { educationDataSchema } from '../validator/education';
import { ActivityServices } from "../services/ActivityService";
import UserServices from "../services/UserServices";

export default class EduDetailsController {

  /*
 Author: Rutuja Patil.
 Router: /api/education/saveEduData
 Description: this function use for save the Student Educational data in the table of educational_details.
 */
  public static addEduDetails = async (req: Request, res: Response) => {
    try {
      const { id, nameAsOnMarksheet, admissionType, email } = req.user;
      const eduData = req.body.educationalData;
      if (req.user.admissionType === "PG") {
        await pgEduData.validateAsync(req.body, validationOptions);
        if (eduData.ugselectChoice === "marks") {
          await ugSelectedMarks.validateAsync(req.body, validationOptions);
        }
        if (eduData.hscselectChoice === "marks") {
          await hscSelectedMarks.validateAsync(req.body, validationOptions);
        }
        if (eduData.hscselectChoice === "grade") {
          await hscSelectedGrade.validateAsync(req.body, validationOptions);
        }
        if (eduData.ugselectChoice === "grade") {
          await ugSelectedGrade.validateAsync(req.body, validationOptions);
        }
        if (eduData.ugCourseName === "Other") {
          await ugQualification.validateAsync(req.body, validationOptions);
        }
        if (eduData.EntranceExam === "Not Appeared") {
          await ugEntranceExam.validateAsync(req.body, validationOptions);
        }
      } else {
        await ugEduData.validateAsync(req.body, validationOptions);
        if (eduData.sscselectChoice === "marks") {
          await sscSelectedMarks.validateAsync(req.body, validationOptions);
        }
        if (eduData.hscselectChoice === "marks") {
          await hscSelectedMarks.validateAsync(req.body, validationOptions);
        }
        if (eduData.hscselectChoice === "grade") {
          await hscSelectedGrade.validateAsync(req.body, validationOptions);
        }
        if (eduData.sscselectChoice === "grade") {
          await sscSelectedGrade.validateAsync(req.body, validationOptions);
        }
      }
      const eduDetails = await EducationalServices.eduDetails(req.user.id);
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      if (!eduDetails) {
        const user = await EducationalServices.addEduDetails(
          eduData, req.user.id, req.user.admissionType);
        res.status(200).json({
          status: 200,
          message: "Educational Details Added",
          data: user
        });

        const activity = `Educational details filled for ${admissionType} by student ${nameAsOnMarksheet}(${email}).`;

        const data = {
          userId: id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: activity,
          activity_name: 'Educational Details Submission',
          ip_address: IP
        };

        await ActivityServices.saveActivity(data);
      } else {
        const user = await EducationalServices.updateEduDetails(eduData, req.user.id);
        res.status(200).json({
          status: 200,
          message: "Educational Details",
          data: user
        });
        const activity = `Educational details updated for ${admissionType} by student ${nameAsOnMarksheet}(${email}).`;
        const data = {
          userId: id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: activity,
          activity_name: 'Educational Details Updated by student',
          ip_address: IP
        };

        await ActivityServices.saveActivity(data);
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  /*
 Author: Tiffany Correia
 Description: This function is used to get the Student Educational data from the table of educational_details by their userId.
 */
  public static EducationDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.query;
      const education = await EducationalServices.educationDetails(Number(userId));
      if (education) {
        res.json({
          status: 200,
          data: education,
          message: 'Success!'
        });
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

  /*
 Author: Rutuja Patil.
 Router: /api/education/saveEduData
 Description: this function use for get the Student Educational data in the table of educational_details.
 */
  public static getEduData = async (req: Request, res: Response) => {
    try {
      const eduData = await EducationalServices.getEduData(req.user.id);
      res.status(200).json({
        status: 200,
        message: "Get All Educational Details",
        data: eduData
      });
    } catch (error) {
      logger.error(error);
    }
  };

  /*
 Author: Pranali GAmbhir.
 Description: this function is used to get educational details of a particular user by id.
 */
  public static getEducationalData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await educationDataSchema.validateAsync(req.query);
      const userId = parseInt(req.query.userId as string);
      const eduData = await EducationalServices.getEduData(userId);
      if (!eduData) return res.json({
        status: 422,
        message: "Data Not Found",
        data: eduData
      });

      res.json({
        status: 200,
        message: "Get All Educational Details",
        data: eduData
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
Author: Pranali Gambhir and Shivram
Description: Ihis function is used to update educational details of a particular user by id and make an entry of activity in the activity_tracking table.
*/
  public static updateEducationalDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.educationalData.userId;

      delete req.body.educationalData.userId;
      const { id, nameAsOnMarksheet, email } = req.user;
      const eduData = req.body.educationalData;
      if (eduData.admissionType === "PG") {
        delete eduData.admissionType;
       await pgEduData.validateAsync(req.body, validationOptions);
        if (eduData.ugselectChoice === "marks") {
          await ugSelectedMarks.validateAsync(req.body, validationOptions);
        }
        if (eduData.hscselectChoice === "marks") {
          await hscSelectedMarks.validateAsync(req.body, validationOptions);
        }
        if (eduData.hscselectChoice === "grade") {
          await hscSelectedGrade.validateAsync(req.body, validationOptions);
        }
        if (eduData.ugselectChoice === "grade") {
          await ugSelectedGrade.validateAsync(req.body, validationOptions);
        }
        if (eduData.ugCourseName === "Other") {
          await ugQualification.validateAsync(req.body, validationOptions);
        }
        if (eduData.EntranceExam === "Not Appeared") {
          await ugEntranceExam.validateAsync(req.body, validationOptions);
        }
      } else {
        delete eduData.admissionType;
        await ugEduData.validateAsync(req.body, validationOptions);
        if (eduData.sscselectChoice === "marks") {
          await sscSelectedMarks.validateAsync(req.body, validationOptions);
        }
        if (eduData.hscselectChoice === "marks") {
          await hscSelectedMarks.validateAsync(req.body, validationOptions);
        }
        if (eduData.hscselectChoice === "grade") {
          await hscSelectedGrade.validateAsync(req.body, validationOptions);
        }
        if (eduData.sscselectChoice === "grade") {
          await sscSelectedGrade.validateAsync(req.body, validationOptions);
        }
      }
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userData = await UserServices.getPersonalData(userId);
      const activity = ` ${nameAsOnMarksheet}(${email}) has updated the educational details of  student ${userData?.nameAsOnMarksheet}'s(${userData?.email}).`;
      const user = await EducationalServices.updateEduDetails(eduData, userId);
      const data = {
        userId: id,
        name: `${nameAsOnMarksheet}(${email})`,
        activity: activity,
        activity_name: 'Educational Details Updated by admin',
        ip_address: IP
      };

      await ActivityServices.saveActivity(data);
      if (user) res.status(200).json({ status: 200, message: 'Educational Details updated', data: data });
    } catch (error) {
      next(error);
    }

  };

  // Helper function to convert a value to number or null
  public static convertToNumber(value: string | null): number | null {
    if (value !== null && value !== '') {
      const parsedValue = parseFloat(value);
      return isNaN(parsedValue) ? null : parsedValue;
    }
    return null;
  }

  // Type guard to check if the variable is an instance of Error
  public static isError(error: any): error is Error {
    return error instanceof Error;
  }

  // /** 
  //  * @author: Rutuja Patil
  //  * @description: To save biology and math percentage in educational_details.
  //  * Router: /api/education/savePrcentage
  //  */
  // public static savePrcentage = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const savePercentage = await EducationalServices.savePrcentage(req.body.mathPercentage, req.body.bioPercentage, req.user.id);
  //     res.status(200).json({ status: 200, message: 'Marks Added successfully', data: savePercentage });
  //   } catch (err) {
  //     logger.error(err);
  //     next(err);
  //   }
  // };

  /*
Author: Shivram Sahu.
Router: /api/education/addPGDetails
Description: this function use for saving and updating the Student PG Details in the table of pg_details.
*/
  public static addPGDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const pgId = req.body.PGData.id;
      const { id, nameAsOnMarksheet, admissionType, email } = req.user;
      req.body.PGData.userId = id;
      const activity_data: any = {
        userId: id,
        name: `${nameAsOnMarksheet}(${email})`,
        ip_address: IP
      };
      if (!pgId) {
        delete req.body.id;
        const savePGDetail = await EducationalServices.savePGDetails(req.body.PGData);
        if (savePGDetail) res.status(200).json({ status: 200, message: 'PG Details saved successfully' });
        activity_data.activity = `PG details filled for ${admissionType} by student ${nameAsOnMarksheet} (${email}).`;
        activity_data.activity_name = 'PG Details Submission';

        await ActivityServices.saveActivity(activity_data);
      } else {
        delete req.body.userId;
        const updatePGDetails = await EducationalServices.updatePGDetails(req.body.PGData);
        if (updatePGDetails) res.status(200).json({ status: 200, message: 'PG Details updated successfully' });
        activity_data.activity = `PG details updated for ${admissionType} by student ${nameAsOnMarksheet}(${email}).`;
        activity_data.activity_name = 'PG Details Updation',
          await ActivityServices.saveActivity(activity_data);
      }
    } catch (error) {
      next(error);
    }
  };

  /*
  Author: Shivram Sahu.
  Description: this function is used to get PG Details of a particular user by id.
  */
  public static getPGDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const getPGDetails = await EducationalServices.getPGDetails(userId);
      if (!getPGDetails) return res.json({
        status: 404,
        message: "Data Not Found",
        data: getPGDetails
      });

      res.json({
        status: 200,
        message: "Get All Educational Details",
        data: getPGDetails
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
  /*
  Author: Shivram Sahu.
  Description: this function is used to get PG Details of a particular user by id for admin.
  */
  public static getPGDetailById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.query.id as string);
      const getPGDetails = await EducationalServices.getPGDetails(userId);
      if (!getPGDetails) return res.json({
        status: 404,
        message: "Data Not Found",
        data: getPGDetails
      });

      res.json({
        status: 200,
        message: "Get All Educational Details",
        data: getPGDetails
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
  /** 
    * @author: Shivram Sahu
    * @description: To delete  PG Details of student
    * Router: /api/education/deletePGDetails
    */
  public static deletePGDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {


      const id = req.query.id;
      const deletePGDetail = await EducationalServices.deletePGDetails(Number(id));
      if (deletePGDetail.affected == 1) res.status(200).json({ status: 200, message: 'PG Details deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

}
