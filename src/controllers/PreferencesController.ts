import { NextFunction, Request, Response } from "express";
import { PreferencesServices } from "../services/PreferencesServices";
import { savePreference, getPreferencesData } from "../validator/preferences";
import logger from "../utils/winston";
import { generateAdmissionFormNumber, sendMsgAndEmail } from "../utils/functions";
import { admissionTypeCount } from '../types/preferences';
import UserCourseDetailsServices from '../services/UserCourseDetailsService';
import CollegeCourseServices from "../services/CollegeCourseServices";
import { ActivityServices } from "../services/ActivityService";

export default class PrefrencesController {
  /**
   * @author: Rutuja Patil
   *@description: save preferences which is selected by students in master_admission_preferences and also individual entry in new table master_admission_user_course_details table with college_id, course_id, college_course_id, and generate the application form no and save in the same table..
   * Router: /api/preferences/savePreferenceData
   */
  public static savePreferenceData = async (req: Request, res: Response) => {
    try {
      await savePreference.validateAsync(req.body);
      const collegeIds = req.body.collegeId; // Assuming collegeId is an array
      const userId = req.user.id;
      const admissionType = req.user.admissionType;
      const { nameAsOnMarksheet, email } = req.user;

      // Loop through the collegeIds array and save each value in the database
      const savedCollegeIds = [];
      for (const collegeId of collegeIds) {
        await PreferencesServices.savePreferenceData(collegeId, userId, admissionType, req.body.value);
        savedCollegeIds.push(collegeId);

      }
      if (savedCollegeIds.length > 0) {
        const dataOfCollegeCourse = await CollegeCourseServices.getData(savedCollegeIds);
        for (const data of dataOfCollegeCourse) {
          let admission_form_no;
          if (req.user.admissionType.toUpperCase() === 'UG') {
            admission_form_no = await generateAdmissionFormNumber('UG');
          } else if (req.user.admissionType.toUpperCase() === 'PG') {
            admission_form_no = await generateAdmissionFormNumber('PG');
          } else {
            throw new Error('Invalid admission type');
          }
          await UserCourseDetailsServices.saveUserCourseDetails(
            userId,
            data.college_id,
            data.course_id,
            data.college_course_id,
            admission_form_no
          );
        }
      }
      await sendMsgAndEmail(req.user);

      const activity = `Submitted Admission form of ${req.user.admissionType} by student ${nameAsOnMarksheet} and selected preferences are ${req.body.collegeCourse}`;
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const data = {
        userId: userId,
        name: `${nameAsOnMarksheet}(${email})`,
        activity: activity,
        activity_name: 'Form Submission',
        ip_address: IP
      };

      const activityResult = await ActivityServices.saveActivity(data);

      if (activityResult) {
        res.status(200).json({ status: 200, message: "College IDs saved", data: savedCollegeIds });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };



  public static getSubmitData = async (req: Request, res: Response) => {
    try {
      const submitData = await PreferencesServices.getSubmitData(req.user.id);
      res.status(200).json({ status: 200, message: "value get", data: submitData });
    } catch (error) {
      logger.error(error);
    }
  };

  /*
    Author: Rutuja Patil.
    Router: /api/preferences/getPreferencesData
    Description: this function use for get students preference details based on the userId.
    */
  public static getPreferencesData = async (req: Request, res: Response) => {
    try {
      await getPreferencesData.validateAsync(req.query);
      const { userId } = req.query;
      const preferenceData = await PreferencesServices.getPreferencesData(Number(userId));
      res.status(200).json({ status: 200, message: "Preference Data", data: preferenceData });
    } catch (error) {
      logger.error(error);
    }
  };
  /*
      Author: Pranali Gambhir
      Description: This function retrieves and calculates the total preferences counts for admission types (UG and PG).
      */
  public static getTotalPreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admissionTypeCounts = await PreferencesServices.admissionTypeCounts();
      const result = {
        UG: 0,
        PG: 0
      };

      admissionTypeCounts.forEach((count: admissionTypeCount) => {
        if (count.master_admission_preferences_admissionType === 'UG') {
          result.UG = parseInt(count.count);
        } else if (count.master_admission_preferences_admissionType === 'PG') {
          result.PG = parseInt(count.count);
        }
      });
      res.status(200).json({ message: 'Admission type counts', data: result });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
