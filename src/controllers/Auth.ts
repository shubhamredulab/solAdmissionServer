/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { IAdmissionType, IkeycloakRole } from '../types/user';
import RoleServices from '../services/RoleServices';
import UserServices from '../services/UserServices';
import { RegisterSchema } from '../validator/auth';
import KeycloakApi, { IPayload } from '../utils/keycloak';
import logger from '../utils/winston';
import RegNoGenerate from '../utils/regno-generate';
import AdmissionActionServices from '../services/AdmissionActionServices';
import { ActivityServices } from '../services/ActivityService';
import EmailTemplates from '../services/EmailTemplates';
import * as fs from 'fs/promises';
import { sendEmailWithTextAndAttachment, sendSms } from '../utils/emails';
import getYear from '../utils/getYear';
import mfData from '../utils/mail-file-data';
import { aType, getAdmissionType } from '../types/method';

const serverUrl = process.env.SERVER_URL;
const clinetUrl = process.env.CLIENT_URL;
export interface IRegister {
  nameAsOnMarksheet: string;
  email: string;
  mobileno: string;
  admissionType: string;
  agree: boolean;
  academicYear: number;
  role: string;
}

export default class AuthController {

  /**
   * @author: Priyanka Vishwakarma
   * @description: User register in user table and also in keycloak.
   */
  // static register = async (req: Request, res: Response, next: NextFunction) => {
  //   try {

  //     await RegisterSchema.validateAsync(req.body);
  //     const { email } = req.body;
  //     const currentPath = process.cwd();
  //     const currentDate = new Date();
  //     const currentMonth = currentDate.getMonth();
  //     let Year;
  //     if (currentMonth >= 0 && currentMonth <= 9) {
  //       Year = currentDate.getFullYear();
  //     } else {
  //       Year = currentDate.getFullYear() + 1;
  //     }
  //     let admissionType;
  //     // Check if the user already exist or not.
  //     const existUser = await UserServices.getUserByEmail(email);

  //     if (existUser) {
  //       return res.status(409).json({ status: 409, message: 'Your email id is already exist in our system. Kindly login with this email id or use alternate email address for registration.' });
  //     }
  //     const user = {
  //       ...req.body,

  //       registerYear: String(Year)
  //     };
  //     // Save user data
  //     const regNo = await RegNoGenerate.generateRegNo();
  //     const newUser = await UserServices.register(user);
  //     await UserServices.updateRegistrationNo(newUser.id, Number(regNo));
  //     const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  //     const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  //     if (newUser) {

  //       const activityData = `Admission form filled for ${user.admissionType} by student ${user.nameAsOnMarksheet} (${user.email}).`;
  //       await ActivityServices.saveActivity({ userId: user.id, name: `${user.nameAsOnMarksheet} (${user.email})`, activity: activityData, activity_name: `Registration`, ip_address: IP });

  //       // Data to send keycloak
  //       const data = JSON.stringify({
  //         enabled: true,
  //         firstName: '',
  //         lastName: '',
  //         email: user.email,
  //         username: user.email,
  //         credentials: [
  //           {
  //             type: 'password',
  //             value: 'Test@123',
  //             temporary: true
  //           }
  //         ],
  //         attributes: {
  //           admission_userId: user.id
  //         }
  //       });

  //       let token;
  //       // Get token
  //       const response = await KeycloakApi.getClientToken();
  //       if (!response) return;
  //       if (response.status === 200) {
  //         token = await response.json();
  //       }

  //       // Register user to keyclaok
  //       const keycloakUser = await KeycloakApi.register(data, `Bearer ${token.access_token}`);
  //       if (keycloakUser.status === 201) {
  //         //To get user details from keycloak by email
  //         const keycloakUserData = await KeycloakApi.getUserByEmail(user.email, `Bearer ${token.access_token}`);
  //         const keycloakId = keycloakUserData[0].id;
  //         // Update keyclaok id in user table
  //         await UserServices.updateKeycloakId(user.id, keycloakId);
  //         const roleData = await RoleServices.getRoleByRoleName('STUDENT');
  //         if (!roleData) return res.status(400).json({ status: 400, error: 'Role Not Found' });
  //         if (roleData.roleId === null) {
  //           // Fetch the Role ID from the keycloak
  //           try {
  //             const keycloakRoles = await KeycloakApi.getKeycloakRole(`Bearer ${token.access_token}`);
  //             const keycloakRoleData = keycloakRoles
  //               .filter((currentRole: IkeycloakRole) => currentRole.name === roleData.roleName);
  //             roleData.roleId = keycloakRoleData[0].id;
  //             await RoleServices.updateRoleId(roleData);
  //           } catch (e) {
  //             return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
  //           }
  //         }
  //         const roleDataOfUser = [{ id: roleData.roleId, name: roleData.roleName }];
  //         await KeycloakApi.assignRole(roleDataOfUser, keycloakId, `Bearer ${token.access_token}`);
  //         const filePath = currentPath + "/src/public/upload/Pdf/" + 'testing_file.pdf';
  //         const fileData = await fs.readFile(filePath);
  //         const fileDetails = [{
  //           "filename": 'testing_file.pdf',
  //           "path": filePath
  //         }];
  //         if (user.admissionType == 'UG') {
  //           admissionType = 'UG(Under-Graduate/Bachelors)';
  //         } else if (user.admissionType == 'PG') {
  //           admissionType = 'PG(Post-Graduate/Masters)';
  //         }
  //         const textData = {
  //           receiverName: user.nameAsOnMarksheet,
  //           receiverEmail: user.email,
  //           password: 'Test@123',
  //           subjectEmail: `Your Registration Details for ${admissionType} `,
  //           senderEmail: process.env.senderEmail,
  //           cc: String(process.env.cc),
  //           bcc: String(process.env.bcc)
  //         };
  //         const emailData = EmailTemplates.sendEmailTextWithAttachment(
  //           textData.receiverName,
  //           textData.receiverEmail,
  //           textData.password
  //         );
  //         const mailData = {
  //           "data": emailData,
  //           "file": fileDetails,
  //           "details": textData
  //         };

  //         const SMSData: {
  //           to: number;
  //         } = {
  //           to: Number(user.mobileno)
  //         };

  //         await sendEmailWithTextAndAttachment(mailData, fileData);
  //         await sendSms(SMSData);
  //         return res.status(200).json({ status: 200, message: 'Register successfully 😊. Now, you can login. ' });
  //       } else {
  //         await UserServices.deleteUserByEmail(email);
  //         res.status(500).json({ status: 500, message: 'Something went wrong, Try again.' });
  //       }

  //     }
  //   } catch (error) {
  //     logger.error(error);
  //     next(error);
  //   }
  // };


  public static registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validate = await RegisterSchema.validateAsync(req.body, { allowUnknown: true }) as IRegister;
      const { academicYear, admissionType, agree, email, mobileno, nameAsOnMarksheet, role } = validate;

      const userData = await UserServices.getUserByEmail(email);

      if (userData) {
        return res.status(409).json({ status: 409, message: "Duplicate entry with this email" });
      }

      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const year = getYear();

      const payLoad: IPayload = {
        email,
        firstName: nameAsOnMarksheet,
        lastName: nameAsOnMarksheet,
        password: "Test@123"
      };
      const response = await KeycloakApi.getClientToken();

      if (!response) return res.status(403).json({ status: 403, message: "Token not found" });

      const token = response.access_token;
      const rRES = await KeycloakApi.registerAll(payLoad, token);

      const data = await KeycloakApi.getUserByEmail(email, token);

      await KeycloakApi.assignDefaultRole(data[0].id, token);

      const registrationNo = await RegNoGenerate.generateRegNo();

      const user = {
        ...req.body,
        registerYear: String(year),
        registrationNo,
        keycloakId: data[0].id
      };

      const result = await UserServices.register(user);

      await KeycloakApi.updateUser({
        attributes: {
          admission_userId: user.id
        }
      }, result.keycloakId, token);

      const admissionT = getAdmissionType(admissionType);

      const activityData = `Admission form filled for ${admissionType} by student ${nameAsOnMarksheet} (${email}).`;
      await ActivityServices.saveActivity({ userId: result.id, name: `${nameAsOnMarksheet} (${email})`, activity: activityData, activity_name: `Registration`, ip_address: IP });

      const { fileData, mailData } = await mfData({ ...validate, admissionType: admissionT ?? '' });

      await sendEmailWithTextAndAttachment(mailData, fileData);
      await sendSms({ to: Number(mobileno) });

      return res.json({ status: 200, message: "User created successfuly" });
    } catch (error) {
      return next(error);
    }
  };

  public static login = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await UserServices.getUserByEmail(email);
      if (user) {
        res.status(200).json({ status: 200, message: 'Login successfully', data: user });
      }

    } catch (error) {
      res.status(500).json({ status: 500, message: 'Something went wrong.' });
    }
  };


  public static assignClientRoleToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = [];
      const data1 = [];
      // if (!req.headers.authorization) return ApiError.unAuthorized();
      const user = await UserServices.getUserByEmail(req.body.email);
      if (!user) return res.status(400).json({ status: 400, message: 'User Not Found' });
      const response = await KeycloakApi.getClientToken();
      if (!response) return res.status(403).json({ status: 403, message: "Token not found " });
      const token = response.access_token;
      let keycloakId;
      if (user.keycloakId === null) {
        try {

          const keycloakUser = await KeycloakApi.getUserByEmail(req.body.email, `Bearer ${token.access_token}`);

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

      if (user.role == 'ADMIN') {
        try {
          const keycloakRRoles = await KeycloakApi.getKeycloakRole(`Bearer ${token.access_token}`);
          for (const key of keycloakRRoles) {
            if (key.name == 'realm-admin' || key.name == 'manage-users') {
              await data1.push({ id: key.id, name: key.name });
            }
          }

        } catch (e) {
          return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
        }
      }

      /*
        Preparing the data for calling the keycloak api
      */
      await data.push({ id: roleData.roleId, name: roleData.roleName });

      /*
          Update the new role for the user
        */
      await UserServices.saveRoleData(req.body.email, req.body.role);

      try {
        // Assign role in keycloak
        await KeycloakApi.assignRole(data, keycloakId, `Bearer ${token.access_token}`);

        if (user.role == 'ADMIN') {
          await KeycloakApi.assignRole(data1, keycloakId, `Bearer ${token.access_token}`);
        }
      } catch (e) {
        // Rollbacking to the default role
        await UserServices.saveRoleData(req.body.email, user.role);
        // return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
      }

      // return res.status(200).json({ status: 200, message: 'Done' ,data : user});
    } catch (error) {
      return next(error);
    }
  };

  public static registerPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await AdmissionActionServices.registerPage();
      if (data) {
        res.status(200).json({ status: 200, message: 'Success!', data: data });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}