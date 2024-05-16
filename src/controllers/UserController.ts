
import { Request, Response, NextFunction } from 'express';
import UserServices from '../services/UserServices';
import logger from '../utils/winston';
import { EducationalServices } from '../services/EducationServices';
import { DocumentServices } from '../services/DocumentServices';
import KeycloakApi, { IPayload } from '../utils/keycloak';
import ApiError from '../utils/api-error';
import RoleServices from '../services/RoleServices';
import { IkeycloakRole, admissionTypeCount, StateName, Values, ManageRole, ITypeName } from '../types/user';
import { personalDataSchema, savePersonal, updateStudentSchema, updateStudentStatusSchema, findByRegistrationNo, userId, validationOptions } from '../validator/user';
import { SubAdminRegisterSchema, changeAdminStatus, checkeUserId, pagination, paginationWithValue, saveDetails } from '../validator/auth';
import { PreferencesServices } from '../services/PreferencesServices';
import { sendEmailToCreated, sendEmailWithTextAndAttachment, sendSms } from '../utils/emails';
import { ActivityServices } from '../services/ActivityService';
import fetch from 'node-fetch';
import EmailTemplates from '../services/EmailTemplates';
import * as fs from 'fs/promises';
import SeriesServices from '../services/SeriesServerice';
import { PhdEducationalService } from '../services/PhdEducationalServices';
import getYear from '../utils/getYear';

interface AdmissionType {
  UG: number;
  PG: number;
}

export default class UserController {
  /*
Author: Rutuja Patil and Moin
Router: /api/user/savePersonalData
Description: this function use for save the Student Personal data in the table of user.
*/
  public static addUserDetails = async (req: Request, res: Response) => {
    try {
      await savePersonal.validateAsync(req.body, validationOptions);
      const personalData = req.body.personalData;
      const degreeType = req.user.admissionType;
      const userId = req.user.id;
      const currentYear = new Date().getFullYear();
      const typeName = 'registrationNo';
      // let admissionType;
      const rangeStart = await SeriesServices.checkSerialExists(currentYear, typeName as ITypeName);
      const latestRegisterNo = await UserServices.getLatestRegistrationNumber(Number(rangeStart?.Year));
      let nextRegNo: any;
      if (rangeStart != null) {
        if (latestRegisterNo == '100001') {
          nextRegNo = rangeStart?.StartRange;
        } else {
          const parsedLatestRegNo = parseInt(String(latestRegisterNo));
          const parsedStartRange = parseInt(rangeStart?.StartRange || '0');
          if (parsedLatestRegNo === parsedStartRange) {
            // If the latest serial number is within the specified range, increment it.
            nextRegNo = parsedLatestRegNo + 1;
          } else {
            nextRegNo = parsedLatestRegNo + 1;
          }
        }
      }
      // if (req.user.admissionType == 'UG') {
      //   admissionType = 'UG(Under-Graduate/Bachelors)';
      // } else if (req.user.admissionType == 'PG') {
      //   admissionType = 'PG(Post-Graduate/Masters)';
      // }
      // const textData = {
      //   receiverName: personalData.nameAsOnMarksheet,
      //   nextRegNo: nextRegNo,
      //   receiverEmail: personalData.email,
      //   subjectEmail: `Your Registration Details for ${admissionType} `,
      //   senderEmail: process.env.senderEmail
      // };
      // if (req.user.registrationNo == null) {
      //   await registerEmail(textData);
      // } else {
      //   logger.info('No Email Sent!');
      // }
      const registrationNo = await UserServices.saveRegNo(nextRegNo, req.user.id, String(currentYear));
      const userDetails = await UserServices.addUserDetails(personalData, req.user.id);
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const activity = `Personal details filled  for ${degreeType} by student ${personalData.nameAsOnMarksheet}(${personalData.email})`;
      const data = {
        userId: userId,
        name: `${personalData.nameAsOnMarksheet}(${personalData.email})`,
        activity: activity,
        activity_name: 'Personal Details',
        ip_address: IP
      };
      await ActivityServices.saveActivity(data);
      res.status(200).json({ status: 200, message: 'User added successfully', data: userDetails, registrationNo });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  /*
 Author: Rutuja Patil.
 Router: /api/user/getPersonalData
 Description: this function use for get the Student Personal data from the table of user
 */
  public static getPersonalData = async (req: Request, res: Response) => {
    try {
      const userData = await UserServices.getPersonalData(req.user.id);
      res.status(200).json({ status: 200, message: 'User Data get successfully', data: userData });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  /*
Author: Pranali Gambhir
Description: This function is used to get the personal data of a student by id.
*/
  public static getStudentData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await personalDataSchema.validateAsync(req.query);
      const { id } = req.query;
      const userData = await UserServices.getPersonalData(Number(id));
      res.json({ status: 200, message: 'User Data get successfully', data: userData });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
 Author: Rutuja Patil.
 Router: /api/user/checkStepper
 Description: this function use for stepper.
 */
  public static checkStepper = async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = {};
      obj['tab1'] = false,
        obj['tab2'] = false,
        obj['tab3'] = false,
        obj['tab4'] = false;
      const personalDetails = await UserServices.checkStepper(req.user.id);
      const educationalDetails = await EducationalServices.checkStepper(req.user.id);
      const uploadDocument = await DocumentServices.checkStepper(req.user.id);
      const PreferencesDetails = await PreferencesServices.checkStepper(req.user.id);
      const PhdEduDetails = await PhdEducationalService.checkStepper(req.user.id);
      if (personalDetails) {
        if (personalDetails.dob !== null) {
          obj['tab1'] = true;
        } else {
          obj['tab1'] = false;
        }
      }

      if (personalDetails?.admissionType === 'PHD') {
        if (PhdEduDetails && PhdEduDetails.length > 0 && PhdEduDetails[0].subjectName !== null) {
          obj['tab2'] = true;
        } else {
          obj['tab2'] = false;
        }
      } else {
        if (educationalDetails) {
          obj['tab2'] = true;
        } else {
          obj['tab2'] = false;
        }
      }

      if (personalDetails?.admissionType === 'PHD') {
        if (uploadDocument) {
          if (
            (personalDetails?.petExam === 'No' ? uploadDocument.some((data) => data.documentType === 'Entrance Exam Marksheet') : true)
            && (personalDetails?.admissionCategory === 'Reserved' ? uploadDocument.some((data) => data.documentType === 'Caste Certificate') : true)
            && (personalDetails?.speciallyAbled === 'Yes' ? uploadDocument.some((data) => data.documentType === 'Disability Certificate') : true)
            && (personalDetails?.nonCreamy === 'Yes' ? uploadDocument.some((data) => data.documentType === 'Non-Creamy Certificate') : true)
            && (['Photo', 'Sign', 'UGMarksheet', 'PGMarksheet'].every(
              (type) => uploadDocument.some((doc) => doc.documentType === type)))
          ) {
            obj['tab3'] = true;
          } else {
            obj['tab3'] = false;
          }
        }
      } else {
        if (uploadDocument) {
          if (uploadDocument.length == 4) {
            obj['tab3'] = true;
          } else {
            obj['tab3'] = false;
          }
        }
      }

      if (PreferencesDetails.length > 0) {
        obj['tab4'] = true;
      } else {
        obj['tab4'] = false;
      }

      res.status(200).json({
        status: 200,
        message: 'Sending Tab Status',
        data: obj
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  /*
  Author: Moin.
  Router: /api/user/subAdminRegister
  Description: this function use for add the subAdmin register on keyclock and add the data in the database with assign the role also ,
  */
  // public static subAdminRegister = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     await SubAdminRegisterSchema.validateAsync(req.body);
  //     const user = req.user;
  //     const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  //     const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  //     const { firstName, lastName,
  //       mobileno, email, academicYear, role, admissionType } = req.body;
  //     const status = 'ACTIVE';
  //     const registerUser = await UserServices.getUserByEmail(email);
  //     if (registerUser) return res.status(409).json({ status: 409, message: 'Already registered with this email.' });
  //     if (!req.headers.authorization) return ApiError.unAuthorized();
  //     const nameAsOnMarksheet = firstName + ' ' + lastName;
  //     let newUser;
  //     const currentPath = process.cwd();
  //     const currentDate = new Date();
  //     const currentMonth = currentDate.getMonth();
  //     let registerYear;
  //     if (currentMonth >= 0 && currentMonth <= 9) {
  //       registerYear = currentDate.getFullYear();
  //     } else {
  //       registerYear = currentDate.getFullYear() + 1;
  //     }

  //     if (role != 'STUDENT') {
  //       const admissionType = null;
  //       newUser = await UserServices.register({ ...req.body, firstName, lastName, mobileno, nameAsOnMarksheet, email, academicYear, status, admissionType });
  //     } else {
  //       const regNo = await RegNoGenerate.generateRegNo();
  //       newUser = await UserServices.register({ ...req.body, firstName, lastName, mobileno, nameAsOnMarksheet, email, academicYear, status, registerYear, admissionType });
  //       await UserServices.updateRegistrationNo(newUser.id, Number(regNo));
  //     }
  //     const data = JSON.stringify({
  //       enabled: true,
  //       firstName: firstName,
  //       lastName: lastName,
  //       email,
  //       username: email,
  //       credentials: [
  //         {
  //           type: 'password',
  //           value: 'Test@123',
  //           temporary: true
  //         }
  //       ],
  //       attributes: {
  //         AddUserId: newUser.id
  //       }
  //     });
  //     const activity = `Superadmin ${user.nameAsOnMarksheet}(${user.email}) added user ${firstName} ${lastName} with role ${role}.`;

  //     const activity_data = {
  //       userId: user.id,
  //       name: `${user.nameAsOnMarksheet}(${user.email})`,
  //       activity: activity,
  //       activity_name: `Registration by Superadmin`,
  //       ip_address: IP
  //     };
  //     await ActivityServices.saveActivity(activity_data);
  //     const keycloakUser = await KeycloakApi.register(data, req.headers.authorization);
  //     let emailData;
  //     let mailData;
  //     const filePath = currentPath + "/src/public/upload/Pdf/" + 'testing_file.pdf';
  //     const fileData = await fs.readFile(filePath);
  //     const fileDetails = [{
  //       "filename": 'testing_file.pdf',
  //       "path": filePath
  //     }];
  //     const textData = {
  //       receiverName: nameAsOnMarksheet,
  //       receiverEmail: email,
  //       password: 'Test@123',
  //       subjectEmail: `Your Registration Details`,
  //       senderEmail: process.env.senderEmail,
  //       cc: String(process.env.cc),
  //       bcc: String(process.env.bcc)
  //     };
  //     if (role != 'STUDENT') {

  //       const text = {
  //         receiverName: nameAsOnMarksheet,
  //         receiverEmail: email,
  //         password: 'Test@123',
  //         subjectEmail: `Your Registration Details`,
  //         senderEmail: String(process.env.senderEmail),
  //         mobileNo: Number(mobileno),
  //         cc: String(process.env.cc),
  //         bcc: String(process.env.bcc)
  //       };
  //       mailData = {
  //         "details": text
  //       };
  //       await sendEmailToCreated(mailData);
  //     } else {
  //       emailData = EmailTemplates.sendEmailTextWithAttachment(
  //         textData.receiverName,
  //         textData.receiverEmail,
  //         textData.password
  //       );
  //       mailData = {
  //         "data": emailData,
  //         "file": fileDetails,
  //         "details": textData
  //       };
  //       await sendEmailWithTextAndAttachment(mailData, fileData);
  //     }
  //     const SMSData: {
  //       to: number;
  //     } = {
  //       to: Number(user.mobileno)
  //     };
  //     await sendSms(SMSData);
  //     if (keycloakUser.status === 201) {
  //       res.status(201).json({ status: 201, message: 'You are registered successfully' });
  //       next();
  //     } else {
  //       await UserServices.deleteUserByEmail(email);
  //       res.status(400).json({ status: 400, message: 'Unable to register.' });
  //     }
  //   } catch (error) {
  //     logger.error(error);
  //     next(error);
  //   }

  // };



  public static subAdminRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) return ApiError.forbidden();
      const token = req.headers.authorization;
      await SubAdminRegisterSchema.validateAsync(req.body);

      const userData = await UserServices.getUserByEmail(req.body.email);

      if (userData) {
        return res.status(409).json({ status: 409, message: "Duplicate entry with this email" });
      }

      const user = req.user;

      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const year = getYear();

      const { firstName, lastName,
        mobileno, email, academicYear, role } = req.body;
      const nameAsOnMarksheet = firstName + ' ' + lastName;
      const status = 'ACTIVE';
      const activity = `Superadmin ${user.nameAsOnMarksheet}(${user.email}) added user ${firstName} ${lastName} with role ${role}.`;

      const activity_data = {
        userId: user.id,
        name: `${user.nameAsOnMarksheet}(${user.email})`,
        activity: activity,
        activity_name: `Registration by Superadmin`,
        ip_address: IP
      };


      const payLoad: IPayload = {
        firstName,
        lastName,
        email,
        password: "Test@123"
      };

      const text = {
        receiverName: nameAsOnMarksheet,
        receiverEmail: email,
        password: 'Test@123',
        subjectEmail: `Your Registration Details`,
        senderEmail: String(process.env.senderEmail),
        mobileNo: Number(mobileno),
        cc: String(process.env.cc),
        bcc: String(process.env.bcc)
      };

      await KeycloakApi.registerAll(payLoad, token);

      const data = await KeycloakApi.getUserByEmail(email, token);

      await KeycloakApi.assignRoleByName(data[0].id, role, token);

      const userPayload = {
        ...req.body,
        registerYear: String(year),
        keycloakId: data[0].id,
        academicYear,
        status,
        nameAsOnMarksheet,
        admissionType: null
      };

      const result = await UserServices.register(userPayload);

      await KeycloakApi.updateUser({
        attributes: {
          admission_userId: result.id
        }
      }, result.keycloakId, token);

      await sendEmailToCreated({
        "details": text
      });

      await ActivityServices.saveActivity(activity_data);

      return res.status(201).json({ status: 201, mesage: "Admin created successfully " });
    } catch (error) {
      return next(error);
    }
  };

  public static assignClientRoleToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = [];
      const data1 = [];
      const adminData = [];
      const user = await UserServices.getUserByEmail(req.body.email);
      if (!user) return res.status(400).json({ status: 400, message: 'User Not Found' });

      const response = await KeycloakApi.getClientToken();

      if (!response) return res.status(403).json({ status: 403, message: "Token not found" });
      const token = response.access_token;
      let keycloakId;
      if (user.keycloakId === null) {
        try {

          const keycloakUser = await KeycloakApi.getUserByEmail(req.body.email, `Bearer ${token}`);

          keycloakId = keycloakUser[0].id;

          await UserServices.updateKeycloakId(user.id, keycloakId);

        } catch (error) {
          logger.error(error);
          return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });

        }
      }

      const roleData = await RoleServices.getRoleByRoleName(req.body.role);
      if (!roleData) return res.status(400).json({ status: 400, error: 'Role Not Found' });
      if (roleData.roleId === null) {
        // Fetch the Role ID from the keycloak
        try {

          const keycloakRoles = await KeycloakApi.getKeycloakRole(`Bearer ${token.access_token}`);
          const keycloakRoleData = keycloakRoles
            .filter((currentRole: IkeycloakRole) => currentRole.name === roleData.roleName);
          roleData.roleId = keycloakRoleData[0].id;
          await RoleServices.updateRoleId(roleData);

        } catch (e) {
          return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
        }

      }

      const manageRoles: ManageRole[] = [];
      // const manageRolesResponse = await KeycloakApi.getRoleManage(`Bearer ${token.access_token}`);
      // if (manageRolesResponse.status === 200) {
      //   manageRoles = await manageRolesResponse.json();
      // }

      if (user.role == 'SUPER_ADMIN') {
        try {
          const keycloakRRoles = await KeycloakApi.getKeycloakRole(`Bearer ${token.access_token}`);
          for (const key of manageRoles) {
            if (key.name == 'realm-admin' || key.name == 'manage-users') {
              await adminData.push({ id: key.id, name: key.name });
            }
          }
          for (const key of keycloakRRoles) {
            if (key.name == 'SUPER_ADMIN') {
              await data1.push({ id: key.id, name: key.name });
            }
          }

        } catch (e) {
          return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
        }
        await UserServices.saveRoleData(req.body.email, req.body.role);

      } else if (user.role == 'ADMIN') {
        try {
          for (const key of manageRoles) {
            if (key.name == 'manage-users') {
              await adminData.push({ id: key.id, name: key.name });
            }
          }
          const keycloakRRoles = await KeycloakApi.getKeycloakRole(`Bearer ${token.access_token}`);
          for (const key of keycloakRRoles) {
            if (key.name == 'ADMIN') {
              await data1.push({ id: key.id, name: key.name });
            }
          }

        } catch (e) {
          return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
        }
        await UserServices.saveRoleData(req.body.email, req.body.role);

      } else if (user.role == 'UNIVERSITY') {
        try {
          const keycloakRRoles = await KeycloakApi.getKeycloakRole(`Bearer ${token.access_token}`);
          for (const key of manageRoles) {
            if (key.name == 'manage-users') {
              await adminData.push({ id: key.id, name: key.name });
            }
          }
          for (const key of keycloakRRoles) {
            if (key.name == 'UNIVERSITY') {
              await data1.push({ id: key.id, name: key.name });
            }
          }

        } catch (e) {
          return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
        }
        await UserServices.saveRoleData(req.body.email, req.body.role);
      }
      else {
        /*
            Preparing the data for calling the keycloak api
          */
        await data.push({ id: roleData.roleId, name: roleData.roleName });

        /*
            Update the new role for the user
          */
        await UserServices.saveRoleData(req.body.email, req.body.role);
      }



      try {
        // Assign role in keycloak

        if (user.role == 'SUPER_ADMIN' || user.role == 'UNIVERSITY') {

          await KeycloakApi.assignRole(data1, keycloakId, `Bearer ${token.access_token}`);
          await KeycloakApi.assignDefaultRoleS(adminData, keycloakId, `Bearer ${token.access_token}`);

        } else if (user.role == 'ADMIN') {
          await KeycloakApi.assignRole(data1, keycloakId, `Bearer ${token.access_token}`);
          await KeycloakApi.assignDefaultRoleS(adminData, keycloakId, `Bearer ${token.access_token}`);


        } else {
          await KeycloakApi.assignRole(data, keycloakId, `Bearer ${token.access_token}`);

        }
      } catch (e) {
        // Rollbacking to the default role
        await UserServices.saveRoleData(req.body.email, user.role);
      }

    } catch (error) {
      return next(error);
    }
  };

  public static getRoleWiseData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await pagination.validateAsync(req.query);
      const OFFSET_LIMIT = 10;
      const { pages } = req.query;
      const offsetValue = (Number(pages) - 1) * OFFSET_LIMIT;
      const user = await UserServices.getRoleWiseData();
      const userData = await UserServices.TotalRoleWiseData(OFFSET_LIMIT, offsetValue);
      res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public static searchData = async (req: Request, res: Response) => {
    try {
      await paginationWithValue.validateAsync(req.query);
      const OFFSET_LIMIT = 10;
      const { value, page } = req.query;
      const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
      const user = await UserServices.getRoleWiseData();
      const userData = await UserServices.getSearchData((value as string), OFFSET_LIMIT, offsetValue);
      res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user });
    } catch (error) {
      res.status(400).json({ message: 'Something went wrong' });
    }
  };

  public static changeAdminStatus = async (req: Request, res: Response) => {
    try {
      await changeAdminStatus.validateAsync(req.body);
      let enabled;
      const token = req.headers.authorization?.substring(7);
      const { changeStatus, id } = req.body;
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const user = await UserServices.findUser(id);
      if (user) {
        const updateUser = await UserServices.updateUserStatus(user.id, changeStatus);
        if (updateUser) {
          // Check the updated status to determine 'enabled'
          if (updateUser.status === 'ACTIVE') {
            enabled = true;
          } else {
            enabled = false;
          }
          const data = {
            enabled: enabled
          };
          const keycloakId = updateUser.keycloakId;
          await KeycloakApi.updateUser(data, keycloakId, `Bearer ${token}`);
          if (user) {
            const activity = `Changed the status to ${updateUser.status} of admin ${user.nameAsOnMarksheet}(${user.email}) by superadmin ${req.user.nameAsOnMarksheet}(${req.user.nameAsOnMarksheet}).`;

            const activity_data = {
              userId: req.user.id,
              name: `${req.user.nameAsOnMarksheet}(${req.user.email})`,
              activity: activity,
              activity_name: `Change the Status of Admin`,
              ip_address: IP
            };
            const activityResult = await ActivityServices.saveActivity(activity_data);
            if (activityResult) {
              res.status(200).json({ status: 200, message: 'Status Updated successfully', data: updateUser });
            }
          }
        } else {
          res.status(400).json({ status: 400, message: 'Status Not Update' });
        }

      }
    } catch (error) {
      res.status(500).json({ status: 400, message: 'Something went wrong' });


    }
  };

  public static getUserRoles = async (req: Request, res: Response) => {
    try {
      const Data = await RoleServices.getRolesData();
      res.status(200).json({ message: 'User Roles', data: Data });
    } catch (erro) {
      res.status(500).json({ message: 'Something went wrong' });

    }
  };

  /*
 Author: Pranali Gambhir
 Description: This function retrieves the total count of pin-purchased students categorized by admission type (UG and PG).
 */
  public static getCountByAdmissionType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admissionTypeCounts = await UserServices.admissionTypeCounts();
      const result = {
        UG: 0,
        PG: 0
      };

      admissionTypeCounts.forEach((count: admissionTypeCount) => {
        if (count.master_admission_users_admissionType === 'UG') {
          result.UG = parseInt(count.count);
        } else if (count.master_admission_users_admissionType === 'PG') {
          result.PG = parseInt(count.count);
        }
      });
      res.status(200).json({ message: 'Admission type counts', data: result });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
Author: Pranali Gambhir
 Description: This function retrieves the total count of students who registered today, categorized by admission type (UG and PG).
*/
  public static getTodayRegisteredUsersCount = async (req: Request, res: Response) => {
    try {
      const result = await UserServices.todaysRegStudCount();
      res.status(200).json({ message: 'Admission type counts', data: { UG: result.UG, PG: result.PG } });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  /*
 Author: Pranali Gambhir
 Description: This function is used to update student's status(Active/Inactive) in  user table and in keycloak also.
 */
  public static updateStudentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userData = req.body;
      await updateStudentStatusSchema.validateAsync(req.body);
      let enabled;
      const token = req.headers.authorization?.substring(7);
      const { studentId, status } = req.body;
      const student1 = await UserServices.findUser(studentId);
      if (student1) {
        // Update the student's status
        await UserServices.updateStatus(studentId, status);

        // Fetch the updated student data
        const updatedStudent = await UserServices.findUser(studentId);

        // Check if updatedStudent is not null
        if (updatedStudent) {
          // Check the updated status to determine 'enabled'
          if (updatedStudent.status === 'ACTIVE') {
            enabled = true;
          } else {
            enabled = false;
          }
          const data = {
            enabled: enabled
          };
          const keycloakId = updatedStudent.keycloakId;
          // Update the user with Keycloak
          await KeycloakApi.updateUser(data, keycloakId, `Bearer ${token}`);
          let roleVerb;
          if (user.role === 'SUPER_ADMIN') {
            roleVerb = 'superadmin';
          } else if (user.role === 'ADMIN') {
            roleVerb = 'admin';
          } else {
            roleVerb = 'student';
          }
          const activity = `Changed the status to ${updatedStudent.status} of student ${userData.nameAsOnMarksheet}(${userData.email}) by ${roleVerb} ${user.nameAsOnMarksheet}(${user.nameAsOnMarksheet}).`;

          const activity_data = {
            userId: user.id,
            name: `${user.nameAsOnMarksheet}(${user.email})`,
            activity: activity,
            activity_name: `Change the Status of Student`,
            ip_address: IP
          };
          await ActivityServices.saveActivity(activity_data);
          res.status(200).json({ status: 200, message: 'All users', data: updatedStudent });
        } else {
          res.status(500).json({ message: 'Error updating student status' });
        }
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public static saveData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await saveDetails.validateAsync(req.body);
      const { data, id } = req.body;
      const user = await UserServices.findUser(id);
      if (user) {
        const Data = await UserServices.saveDatas(data.firstName, data.lastName, data.mobileno, id);
        res.status(200).json({ status: 200, message: 'User Datails updated', data: Data });
      }
    } catch (erro) {
      logger.error(erro);
      next(erro);

    }
  };

  public static userData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkeUserId.validateAsync(req.query);
      const { userId } = req.query;
      const user = await UserServices.findUser(userId);
      if (user) {
        res.status(200).json({ status: 200, data: user });
      }
    } catch (err) {
      logger.error(err);
      next(err);

    }
  };

  /*
 Author: Pranali Gambhir
 Description: This function is used to update personal details at admin side and make entry of activity in activity_tracing. 
 */
  public static updateStudentDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, nameAsOnMarksheet, email, role } = req.user;
      const { studentData } = req.body;
      const result = await updateStudentSchema.validateAsync(studentData);
      const userData = await UserServices.updateData(result, studentData.id);
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      let roleVerb;
      if (role === 'SUPER_ADMIN') {
        roleVerb = 'Superadmin';
      } else if (role === 'ADMIN') {
        roleVerb = 'Admin';
      } else {
        roleVerb = 'student';
      }

      const activity = `${roleVerb} ${nameAsOnMarksheet}(${email}) has updated the personal details of ${result.admissionType} student ${result.nameAsOnMarksheet}(${result.email}).`;

      const activity_data = {
        userId: id,
        name: `${nameAsOnMarksheet}(${email})`,
        activity: activity,
        activity_name: `Personal Details Updated by ${roleVerb}`,
        ip_address: IP
      };
      await ActivityServices.saveActivity(activity_data);

      res.status(200).json({ status: 200, message: 'User Details updated', data: userData });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

  public static getUserDetails = async (req: Request, res: Response) => {
    try {
      const user = await UserServices.getUserDetails(req.user.id);
      res.status(200).json({ message: ' users Details', data: user });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  /*
  Author: Rutuja Patil.
  Router: /api/user/getStudentsPersonalData
  Description: this function use for get student personal data using registrationNo from user table.
  */
  public static getStudentsPersonalData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await findByRegistrationNo.validateAsync(req.query);
      const registerationNo = req.query.registerationNo;
      const registrationNumber = parseInt(registerationNo as string);
      const studentsData = await UserServices.getStudentsPersonalData(registrationNumber);
      res.status(200).json({ status: 200, message: 'Student Data Get Successfully', data: studentsData });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: This route is used to get user Personal, Education and Documents data.
   * Router: /api/user/getSingleUserPersonalEduDocData
   */
  public static getSingleUserPersonalEduDocData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userId.validateAsync(req.query);
      const { id } = req.query;
      const user = await UserServices.findUser(id);
      const edu = await EducationalServices.eduDetails(Number(id));
      const documents = await DocumentServices.getDocuments(Number(id));
      res.status(200).json({ status: 200, data: { userDetails: user, education: edu, documents: documents } });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Rutuja Patil
   * @description: This route is used to get states.
   * Router: /api/user/getStates
   */
  public static getStates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data = {};
      data = {
        states_name: StateName.states,
        admission_category: Values.admission_category,
        learning_Disability: Values.learning_Disability,
        stream: Values.stream,
        result: Values.result,
        Category: Values.Category,
        course: Values.course,
        entranceExam: Values.entranceExam,
        blood_group: Values.blood_group,
        motherTongue: Values.motherTongue,
        grades: Values.grades,
        annual_Income: Values.annual_Income,
        boardName: Values.boardName
      };
      if (data) {
        res.status(200).json({ status: 200, data: data });
      } else {
        res.status(404).json({ status: 404, message: 'Data not found' });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Rutuja Patil
   * @description: This route is used to get state and city using pincode.
   * Router: /api/user/getCityState
   */
  public static getCityState = async (req: Request, res: Response, next: NextFunction) => {
    const { pincode } = req.query;
    try {
      const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0 && data[0].PostOffice) {
        const city = data[0].PostOffice[0].District;
        const state = data[0].PostOffice[0].State;
        res.status(200).json({ status: 200, data: { city, state } });
      } else {
        res.status(404).json({ status: 404, message: "Data not found" });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Pranali Gambhir
   * @description: This route is used to send email/sms from admin.
   * Router: /api/user/sendEmail
   */
  public static sendEmail = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let filePath = '';
    const currentPath = process.cwd();
    let senderEmail;
    try {
      filePath = currentPath + "/src/public/upload/Pdf/" + 'testing_file.pdf';
      const fileData = await fs.readFile(filePath);
      const fileDetails = [{
        "filename": 'testing_file.pdf',
        "path": filePath
      }];
      if (user.role == 'SUPER_ADMIN') {
        senderEmail = process.env.senderEmail;

      } else {
        senderEmail = req.user.email;

      }
      const textData = {
        id: req.body.id,
        receiverName: req.body.receiverName,
        receiverEmail: req.body.receiverEmail,
        regNo: req.body.regNo,
        password: '123456',
        subjectEmail: `Your Registration Details `,
        senderName: req.user.nameAsOnMarksheet,
        senderEmail: senderEmail,
        cc: String(process.env.cc),
        bcc: String(process.env.bcc)
      };
      const emailData = EmailTemplates.sendEmailTextWithAttachment(
        textData.receiverName,
        textData.receiverEmail,
        textData.password
      );
      const mailData = {
        "data": emailData,
        "file": fileDetails,
        "details": textData
      };

      const SMSData: {
        to: number;
        serialNo: number;
        pinno: string;
      } = {
        to: Number(req.body.mobileno),
        serialNo: Number(req.body.serialNo),
        pinno: String(req.body.pinNo)
      };

      const emailResponse: any = await sendEmailWithTextAndAttachment(mailData, fileData);
    await sendSms(SMSData);
    const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      let roleVerb;
      if (user.role === 'SUPER_ADMIN') {
        roleVerb = 'superadmin';
      } else if (user.role === 'ADMIN') {
        roleVerb = 'admin';
      } else {
        roleVerb = 'student';
      }

      const activity = `${roleVerb} ${user.nameAsOnMarksheet}(${user.email}) sent email to student ${textData.receiverName}(${textData.receiverEmail}).`;

      const activity_data = {
        userId: user.id,
        name: `${user.nameAsOnMarksheet}(${user.email})`,
        activity: activity,
        activity_name: `Send Email`,
        ip_address: IP
      };
      await ActivityServices.saveActivity(activity_data);
      
      if (emailResponse.status === 200) {
        res.status(200).json({ status: 200, message: 'Email sended successfully!!' });
      } else {
        res.send({ status: 400, message: 'something wrong to send the email' });
      }


    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

  /*
Author: Moin
Description: This function is used to get all pin-purchased students from the table of user according year with Admin and Super-Admin login
*/
  public static getAllUsersYearWise = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { year, page } = req.query;
      const isSubmitted = String(req.query.submitStatus);
      const degreeType = String(req.query.degreeType);
      const OFFSET_LIMIT = 10;
      const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
      let data = [];
      if (user.role === 'SUPER_ADMIN' || user.role === 'UNIVERSITY') {
        const totalData = await UserServices.getYearWiseDataCount(Number(year), degreeType, isSubmitted);
        data = await UserServices.getYearWiseData(Number(year), OFFSET_LIMIT, offsetValue, degreeType, isSubmitted);
        if (data.length > 0) {
          for (const child of data) {
            const pref = await PreferencesServices.getpreference(Number(child.id));
            const submittedStatus = pref && pref.submitted_date ? 'Yes' : 'No';
            child.submittedStatus = submittedStatus;
          }
        }
        return res.status(200).json({ status: 200, message: 'All users', data: data, totalCount: totalData.length, totalUsers: totalData });
      } else {
        const totalData = await UserServices.getYearWiseDataByDegreeTypeCount(Number(year));
        data = await UserServices.getYearWiseDataByDegreeType(Number(year), OFFSET_LIMIT, offsetValue);
        if (data.length > 0) {
          for (const child of data) {
            const pref = await PreferencesServices.getpreference(Number(child.id));
            const submittedStatus = pref && pref.submitted_date ? 'Yes' : 'No';
            child.submittedStatus = submittedStatus;
          }
        }
        return res.status(200).json({ status: 200, message: 'All users', data: data, totalCount: totalData.length, totalUsers: totalData });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
Author: Pranali Gambhir
Description: This function is used to get data after searching based on searching criteria for both roles(Admin/Superadmin).
*/
  public static getfilteredData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { searchCriteria, searchQuery, year, page } = req.query;
      const degreeType = String(req.query.degreeType);
      const isSubmitted = String(req.query.submitStatus);
      const OFFSET_LIMIT = 10;
      const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
      if (user.role === 'SUPER_ADMIN' || user.role === 'UNIVERSITY') {
        const totalFilteredData = await UserServices.getFilteredDataCount(searchCriteria, searchQuery, year, degreeType, isSubmitted);
        const filteredData = await UserServices.getFilteredData(searchCriteria, searchQuery, year, OFFSET_LIMIT, offsetValue, degreeType, isSubmitted);
        res.status(200).json({ status: 200, message: 'All Filtered Data Fetched Sucessfully', data: filteredData, totalCount: totalFilteredData.length });
      } else {
        const totalFilteredData = await UserServices.getFilteredDataForAdminCount(searchCriteria, searchQuery, year, degreeType, isSubmitted);
        const filteredData = await UserServices.getFilteredDataForAdmin(searchCriteria, searchQuery, year, OFFSET_LIMIT, offsetValue, degreeType, isSubmitted);
        res.status(200).json({ status: 200, message: 'All Filtered Data Fetched Sucessfully', data: filteredData, totalCount: totalFilteredData.length });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
Author: Pranali Gambhir
Description: This function is used to get count of all registered users,documents and preferences within selected date range for admin and superadmin dashboard.
*/
  public static getDataInDateRange = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const users = await UserServices.getUsersInDateRange(startDate as string, endDate as string);
      const userData: AdmissionType = {
        UG: 0,
        PG: 0
      };
      users.forEach(user => {
        userData[user.admissionType as keyof AdmissionType] = parseInt(user.count);
      });

      const documents = await DocumentServices.getDocumentsInDateRange(startDate as string, endDate as string);
      const docData: AdmissionType = {
        UG: 0,
        PG: 0
      };
      documents.forEach(doc => {
        docData[doc.admissionType as keyof AdmissionType] = parseInt(doc.count);
      });

      const preferences = await PreferencesServices.getPreferencesInDateRange(startDate as string, endDate as string);
      const preferenceData: AdmissionType = {
        UG: 0,
        PG: 0
      };
      preferences.forEach(preference => {
        preferenceData[preference.admissionType as keyof AdmissionType] = parseInt(preference.count);
      });

      res.status(200).json({ message: 'Counts', userData, docData, preferenceData });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
  Author: Pranali Gambhir
  Description: This function is used to get count of all registered users,documents and preferences for a selected date for admin and superadmin dashboard.
  */
  public static getDataForDay = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query;
      const users = await UserServices.getUserForDay(date as string);
      const userData: AdmissionType = {
        UG: 0,
        PG: 0
      };
      users.forEach(user => {
        userData[user.admissionType as keyof AdmissionType] = parseInt(user.count);
      });

      const documents = await DocumentServices.getDocsForDay(date as string);
      const docData: AdmissionType = {
        UG: 0,
        PG: 0
      };
      documents.forEach(doc => {
        docData[doc.admissionType as keyof AdmissionType] = parseInt(doc.count);
      });

      const preferences = await PreferencesServices.getPreferencesForDay(date as string);
      const preferenceData: AdmissionType = {
        UG: 0,
        PG: 0
      };
      preferences.forEach(preference => {
        preferenceData[preference.admissionType as keyof AdmissionType] = parseInt(preference.count);
      });
      res.status(200).json({ message: 'Counts', userData, docData, preferenceData });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public static savePHDPersonalData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // await savePersonal.validateAsync(req.body, validationOptions);
      const personalData = req.body.personalData;
      const degreeType = req.user.admissionType;
      const userId = req.user.id;
      const currentYear = new Date().getFullYear();
      const typeName = 'registrationNo';
      // let admissionType;
      const rangeStart = await SeriesServices.checkSerialExists(currentYear, typeName as ITypeName);
      const latestRegisterNo = await UserServices.getLatestRegistrationNumber(Number(rangeStart?.Year));
      let nextRegNo: any;
      if (rangeStart != null) {
        if (latestRegisterNo == '100001') {
          nextRegNo = rangeStart?.StartRange;
        } else {
          const parsedLatestRegNo = parseInt(String(latestRegisterNo));
          const parsedStartRange = parseInt(rangeStart?.StartRange || '0');
          if (parsedLatestRegNo === parsedStartRange) {
            // If the latest serial number is within the specified range, increment it.
            nextRegNo = parsedLatestRegNo + 1;
          } else {
            nextRegNo = parsedLatestRegNo + 1;
          }
        }
      }
      // if (req.user.admissionType == 'UG') {
      //   admissionType = 'UG(Under-Graduate/Bachelors)';
      // } else if (req.user.admissionType == 'PG') {
      //   admissionType = 'PG(Post-Graduate/Masters)';
      // }
      // const textData = {
      //   receiverName: personalData.nameAsOnMarksheet,
      //   nextRegNo: nextRegNo,
      //   receiverEmail: personalData.email,
      //   subjectEmail: `Your Registration Details for ${admissionType} `,
      //   senderEmail: process.env.senderEmail
      // };
      // if (req.user.registrationNo == null) {
      //   await registerEmail(textData);
      // } else {
      //   logger.info('No Email Sent!');
      // }
      const registrationNo = await UserServices.saveRegNo(nextRegNo, req.user.id, String(currentYear));
      const userDetails = await UserServices.addUserDetails(personalData, req.user.id);
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const activity = `Personal details filled  for ${degreeType} by student ${personalData.nameAsOnMarksheet}(${personalData.email})`;
      const data = {
        userId: userId,
        name: `${personalData.nameAsOnMarksheet}(${personalData.email})`,
        activity: activity,
        activity_name: 'Personal Details',
        ip_address: IP
      };
      await ActivityServices.saveActivity(data);
      res.status(200).json({ status: 200, message: 'User added successfully', data: userDetails, registrationNo });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Something went wrong' });
      next(error);
    }
  };



  public static getYearWiseAdmin = async (req: Request, res: Response) => {
    try {
      const { year, page } = req.query;
      const OFFSET_LIMIT = 10;
      const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
      const user = await UserServices.YearWiseAdmin(Number(year));

      const userData = await UserServices.getYearWiseAdmin(Number(year), OFFSET_LIMIT, offsetValue);
      res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user.length });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  public static SearchDataYearWise = async (req: Request, res: Response) => {
    try {
      const { value, year, page } = req.query;
      const OFFSET_LIMIT = 10;
      const offsetValue = (Number(page) - 1) * OFFSET_LIMIT;
      const user = await UserServices.getYearWiseAdmin(Number(year), Number(null), Number(null));

      const userData = await UserServices.SearchDataYearWise(Number(year), String(value), OFFSET_LIMIT, offsetValue);
      res.status(200).json({ status: 200, message: 'All users', data: userData, totalCount: user.length });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
}