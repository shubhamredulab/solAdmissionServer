import { Request, Response, NextFunction } from 'express';
import UserCourseDetailsServices from '../services/UserCourseDetailsService';
import logger from '../utils/winston';
import { AccessServices } from '../services/AccessService';
import { IRoles, applicationStatus, universityStatus } from '../types/user';
import { activity } from '../utils/functions';
import { AddCommentAndStatusForUniSchema, AddCommentAndStatusSchema, validationOptions } from '../validator/userCourseDetails';
import { Application } from '../types/userCourseDetails';
import CollegeCourseServices from '../services/CollegeCourseServices';
import UserServices from '../services/UserServices';
import { ActivityServices } from '../services/ActivityService';
import CollegeServices from '../services/CollegeServices';
import CourseServices from '../services/CourseServices';
import MenuItemServices from '../services/MenuItemService';

export default class UserCourseDetailsController {

  /**
   * @author: Rutuja Patil
   * @description:Used to get College Report Data.
   * Router: /api/userCourseDetails/getCollegeReport
  /*/
  public static getCollegeReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const collegeReportData = await UserCourseDetailsServices.getCollegeReport(userId);
      if (collegeReportData) {
        res.status(200).json({ status: 200, message: 'College Report get successfully', data: collegeReportData });
      } else {
        res.status(404).json({ status: 404, message: 'Data not found' });
      }
    }
    catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
* @author: Pranali Gambhir
* @description: This route is used to get filtered data from userCourseDetails and user table.
* Router: /api/userCourseDetails/filterData
*/
  public static filterData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { college, course, collegeStatus, universityStatus, academicYear } = req.query;
      if (user.role === 'SUPER_ADMIN' || user.role === 'UNIVERSITY') {
        const filteredData = await UserCourseDetailsServices.getDownloadsFilteredData(college, course, collegeStatus, universityStatus, academicYear);
        res.status(200).json({ status: 200, message: 'All Filtered Data Fetched Sucessfully', data: filteredData });
      } else {
        const menuItemData = await MenuItemServices.getMenuItemByUserId(user.id);
        if (!menuItemData) {
          return res.status(400).json({ status: 400, message: 'User data not found' });
        }
        const filteredData = await UserCourseDetailsServices.getDownloadsFilteredData(menuItemData.collegeId, course, collegeStatus, universityStatus, academicYear);
        res.status(200).json({ status: 200, message: 'All Filtered Data Fetched Sucessfully', data: filteredData });

      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
  * @author: Priyanka Vishwakarma
  * @description: Get
  * Router: /api/userCourseDetails/
  */
  public static viewApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { course_id, college_application_status, page, limit } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const user = req.user;
      let applications = [];
      if (user.role === IRoles.SUPER_ADMIN) {
        const count = await UserCourseDetailsServices.getCountViewApplications(user.role, undefined, undefined, college_application_status);
        if (college_application_status) {
          applications = await UserCourseDetailsServices.viewApplications(user.role, Number(limit), offset, college_application_status as applicationStatus);
        } else {
          applications = await UserCourseDetailsServices.viewApplications(user.role, Number(limit), offset);
        }
        return res.status(200).json({ status: 200, data: applications, count: count });
      } else {
        const access_details = await AccessServices.findUser(user.id);
        const { collegeId, degreeType, courseId } = access_details || {};

        const count = await UserCourseDetailsServices.getCountViewApplications(user.role, collegeId, courseId, college_application_status);
        if (college_application_status !== 'undefined' || college_application_status !== undefined) {
          applications = await UserCourseDetailsServices.viewApplications(user.role, Number(limit), offset, college_application_status as applicationStatus, collegeId, degreeType, courseId);

        } else {
          applications = await UserCourseDetailsServices.viewApplications(user.role, Number(limit), offset, 'undefined', collegeId, degreeType, courseId);
        }

        if (course_id !== null && course_id !== 'undefined') {

          const data = applications.filter((application: Application) => application.course_id === Number(course_id));
          return res.status(200).json({ status: 200, data: data, count: count });
        } else {

          return res.status(200).json({ status: 200, data: applications, count: count });
        }

      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };


  /**
   * @author: Priyanka Vishwakarma
   * @description: Add college_comments and update college_application_status by id
   * Router: /api/userCourseDetails/addCommentAndStatus
   */
  public static addCommentAndStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AddCommentAndStatusSchema.validateAsync(req.body, validationOptions);
      const { appId, college_comments, college_application_status, academic_year_admission, admissionYear, boardNameForPayment } = req.body;
      const user = req.user;
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const { id, nameAsOnMarksheet, email } = req.user;
      const existApplication: Application | null = await UserCourseDetailsServices.getApplicationById(appId);

      if (!existApplication) return res.status(204).json({ status: 204, message: 'Application Not found' });
   
      const userData = await UserServices.findUser(existApplication.userId);

      const data = await UserCourseDetailsServices.addCommentAndStatus(appId, college_comments, college_application_status, boardNameForPayment);

      if (data.affected !== 1) return res.status(500).json({ status: 500, message: 'Unexpected error occurred' });

      // If college_application_status Accept then decrease by 1 intake of collegeCourseId
      if (college_application_status === 'Accept') {
        if (existApplication !== null) {
          const { college_course_id, college_id, course_id } = existApplication;
          const result = await CollegeCourseServices.seatAllotedDecIntakes(college_course_id, college_id, course_id, admissionYear, academic_year_admission, 1);
          const collegeData = await CollegeServices.getCollegeById(college_id);
          let collegeName: string | undefined;
          let courseName: string | undefined;
          if (collegeData) {
            collegeName = collegeData.college_name_admission;
            const courseData = await CourseServices.getCourseById(college_id);
            if (courseData) {
              courseName = courseData.course_name_admission;
              if (result.affected === 1) {
                let roleVerb;
                if (user.role === 'SUPER_ADMIN') {
                  roleVerb = 'superadmin';
                } else if (user.role === 'ADMIN') {
                  roleVerb = 'admin';
                } else {
                  roleVerb = 'student';
                }
                const activity = `Decremented intakes of collegeCourse[College: ${collegeName}, Course: ${courseName}] by ${roleVerb} ${nameAsOnMarksheet} (${email}).`;

                const activity_data = {
                  userId: id,
                  name: `${nameAsOnMarksheet}(${email})`,
                  activity: activity,
                  activity_name: `Decrease intakes`,
                  ip_address: IP
                };
                await ActivityServices.saveActivity(activity_data);
              }
            }
          }
        }
      }
      if (userData) {
        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const activity = `Application no.(${existApplication.admission_form_no}) of student ${userData.nameAsOnMarksheet}(${userData.email}) is ${college_application_status} by admin ${nameAsOnMarksheet} (${email}).`;

        const activity_data = {
          userId: id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: activity,
          activity_name: `Update application status by College`,
          ip_address: IP
        };
        await ActivityServices.saveActivity(activity_data);
      }
      return res.status(200).json({ status: 200, message: 'Updated successfully!!' });


    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: Add university_comments and update university_application_status by id
   * Router: /api/userCourseDetails/addCommentAndStatus
   */
  public static addCommentAndStatusForUniversity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AddCommentAndStatusForUniSchema.validateAsync(req.body);

      const { appId, university_comments, university_application_status } = req.body;
      const { id, nameAsOnMarksheet, email } = req.user;

      const existApplication: Application | null = await UserCourseDetailsServices.getApplicationById(appId);
      if (existApplication) {
        res.status(200).json({ status: 200, message: "Existing Applications" });
      } else {
        throw new Error("Application not found");
      }
      const userData = await UserServices.findUser(existApplication.userId);

      if (!existApplication) return res.status(204).json({ status: 204, message: 'Application Not found' });

      const data = await UserCourseDetailsServices.addCommentAndStatusForUniversity(appId, university_comments, university_application_status);

      if (data.affected !== 1) return res.status(500).json({ status: 500, message: 'Unexpected error occurred' });

      if (userData) {
        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const activity = `Application no.(${existApplication.admission_form_no}) of student ${userData.nameAsOnMarksheet}(${userData.email}) is ${university_application_status} by ${nameAsOnMarksheet} (${email}).`;

        const activity_data = {
          userId: id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: activity,
          activity_name: `Update application status by University`,
          ip_address: IP
        };
        await ActivityServices.saveActivity(activity_data);
      }
      return res.status(200).json({ status: 200, message: 'Updated successfully!!' });

    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
  * @author: Tiffany Correia
  * @function: Get total data from the table - user_admission_course_details
  */
  public static getTotalApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const total = await UserCourseDetailsServices.getTotalApplication(applicationStatus['ACCEPT']);
      if (total) {
        res.status(200).json({ status: 200, message: "Total Application Data Successfully Fetched!", data: total });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Get new application data from the table - user_admission_course_details
    */
  public static getNewApp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newApp = await UserCourseDetailsServices.getByStatus(applicationStatus['ACCEPT'], universityStatus['NEW']);
      if (newApp) {
        res.status(200).json({ status: 200, message: "New Application Data Successfully Fetched!", data: newApp });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Get accepted application data from the table - user_admission_course_details
    */
  public static getAcceptedApp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newApp = await UserCourseDetailsServices.getByStatus(applicationStatus['ACCEPT'], universityStatus['ACCEPT']);
      if (newApp) {
        res.status(200).json({ status: 200, message: "Accepted Application Data Successfully Fetched!", data: newApp });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Get rejected application data from the table - user_admission_course_details
    */
  public static getRejectApp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getRejectApp = await UserCourseDetailsServices.getByStatus(applicationStatus['ACCEPT'], universityStatus['REJECT']);
      if (getRejectApp) {
        res.status(200).json({ status: 200, message: "Reject Application Data Successfully Fetched!", data: getRejectApp });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Get hold application data from the table - user_admission_course_details
    */
  public static getHoldApp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getHoldApp = await UserCourseDetailsServices.getByStatus(applicationStatus['ACCEPT'], universityStatus['HOLD']);
      if (getHoldApp) {
        res.status(200).json({ status: 200, message: "Hold Application Data Successfully Fetched!", data: getHoldApp });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Save notes in the table when the click on Accept
    */
  public static saveAccept = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const saveAccept = await UserCourseDetailsServices.saveAccept(req.body.id, req.body.notes);
      await UserCourseDetailsServices.getTotalApplication(applicationStatus['ACCEPT']);
      // const collegeIds = total.map(details => details.id);
      const forActivity = await UserCourseDetailsServices.joinForCollege(req.body.id);
      if (saveAccept) {
        const activityData = `${req.user.email} has accepted the application of ${forActivity[0].nameAsOnMarksheet}.`;
        await activity(Number(req.user.id), req.user.nameAsOnMarksheet, activityData);
        res.status(200).json({ status: 200, message: "Your Application Has Been Accepted!", data: saveAccept });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Save notes in the table when the click on Reject
    */
  public static saveReject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const saveReject = await UserCourseDetailsServices.saveReject(req.body.id, req.body.notes);
      await UserCourseDetailsServices.getTotalApplication(applicationStatus['ACCEPT']);
      // const collegeIds = total.map(details => details.id);
      const forActivity = await UserCourseDetailsServices.joinForCollege(req.body.id);
      if (saveReject) {
        const activityData = `${req.user.email} has rejected the application of ${forActivity[0].nameAsOnMarksheet}.`;
        await activity(Number(req.user.id), req.user.nameAsOnMarksheet, activityData);
        res.status(200).json({ status: 200, message: "Your Application Has Been Rejected!", data: saveReject });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Save notes in the table when the click on Hold
    */
  public static onHold = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const onHold = await UserCourseDetailsServices.onHold(req.body.id, req.body.notes);
      await UserCourseDetailsServices.getTotalApplication(applicationStatus['ACCEPT']);
      // const collegeIds = total.map(details => details.id);
      const forActivity = await UserCourseDetailsServices.joinForCollege(req.body.id);
      if (onHold) {
        const activityData = `${req.user.email} has kept the application of ${forActivity[0].nameAsOnMarksheet} on hold.`;
        await activity(Number(req.user.id), req.user.nameAsOnMarksheet, activityData);
        res.status(200).json({ status: 200, message: "Your Application Is On Hold!", data: onHold });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Join data for Total Application
    */
  public static joinForCollege = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const total = await UserCourseDetailsServices.getTotalApplication(applicationStatus['ACCEPT']);
      const count = await UserCourseDetailsServices.Count();
      const collegeIds = total.map(details => details.id);
      const joinForCollege = await UserCourseDetailsServices.joinForCollege(collegeIds);

      if (joinForCollege) {
        res.status(200).json({ status: 200, message: "Success!", data: joinForCollege, count: count });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Join data for New Application
    */
  public static joinForApp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const total = await UserCourseDetailsServices.getByStatus(applicationStatus['ACCEPT'], universityStatus['NEW']);
      const count = await UserCourseDetailsServices.Count();
      const collegeIds = total.map(details => details.id);
      const joinForApp = await UserCourseDetailsServices.joinForCollege(collegeIds);
      if (joinForApp) {
        res.status(200).json({ status: 200, message: "Success!", data: joinForApp, count: count });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Join data for Rejected Application
    */
  public static joinForReject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const total = await UserCourseDetailsServices.getByStatus(applicationStatus['ACCEPT'], universityStatus['REJECT']);
      const count = await UserCourseDetailsServices.Count();
      const collegeIds = total.map(details => details.id);
      const joinForReject = await UserCourseDetailsServices.joinForCollege(collegeIds);
      if (joinForReject) {
        res.status(200).json({ status: 200, message: "Success!", data: joinForReject, count: count });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Join data for Accepted Application
    */
  public static joinForAccept = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const total = await UserCourseDetailsServices.getByStatus(applicationStatus['ACCEPT'], universityStatus['ACCEPT']);
      const count = await UserCourseDetailsServices.Count();
      const collegeIds = total.map(details => details.id);
      const joinForAccept = await UserCourseDetailsServices.joinForCollege(collegeIds);
      if (joinForAccept) {
        res.status(200).json({ status: 200, message: "Success!", data: joinForAccept, count: count });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Join data for on Hold Application
    */
  public static joinForHold = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const total = await UserCourseDetailsServices.getByStatus(applicationStatus['ACCEPT'], universityStatus['HOLD']);
      const count = await UserCourseDetailsServices.Count();
      const collegeIds = total.map(details => details.college_id);
      const joinForHold = await UserCourseDetailsServices.joinForCollege(collegeIds);
      if (joinForHold) {
        res.status(200).json({ status: 200, message: "Success!", data: joinForHold, count: count });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
    * @author: Tiffany Correia
    * @function: Resend any application to New Applications tab.
    */
  public static resendApp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resendApp = await UserCourseDetailsServices.resendApp(req.body.id);
      if (resendApp) {
        res.status(200).json({ status: 200, message: "Successfully Resent To New Application", data: resendApp });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: Get applications for university where college_application_status always 'Accept' and university_application_status can be New, Hold, Reject, Accept
   */
  public static getApplicationsForUniversityTab = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { university_application_status, page, limit, filterByCollege, filterByCourse } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const data = await UserCourseDetailsServices.getApplicationsForUniversity(Number(limit), offset, university_application_status as universityStatus, filterByCollege as string, filterByCourse as string);

      const count = await UserCourseDetailsServices.getCountForUniApplications(university_application_status as universityStatus);

      res.status(200).json({ status: 200, data: data, count: count });

    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
  /**
   * @author: moin 
   * @description: this function provide the ready to pay student data in user course details table and change update data
   */
  public static readyToPayUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const details = req.body.data;
      for (const data of details) {
        const resendApp = await UserCourseDetailsServices.checkUser(data.accessValue.userId);
        if (resendApp) {
          await UserCourseDetailsServices.updateUserData(data.accessValue.userId, 'ReadyToPay');
        }
      }
      res.status(200).json({ status: 200, message:'User Status Updated Successfully' });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}