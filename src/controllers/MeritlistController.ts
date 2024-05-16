import { NextFunction, Request, Response } from "express";
import logger from "../utils/winston";
import MeritListServices from "../services/MeritlistService";
import { Revoke, getMeritList, pageId, saveMeritList, searchMeritList, saveAssignCollegeData, validationOptions, pageYear } from '../validator/meritlist';
import { uploadExcel, uploadPDF } from '../utils/multer';
import { activity } from '../utils/functions';
import UserServices from "../services/UserServices";
import { verifationStatus, SendExcelStatus } from "../types/user";
import fetch from 'node-fetch';
import * as fs from 'fs/promises';
import FormData from 'form-data';
import { ActivityServices } from "../services/ActivityService";


export default class MeritListController {
  /*
  Author: Moin.
  Router: /api/meritList/getMeritlist
  Description: this function use for the get the merit list on client side,
  
  */
  public static getMeritList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getMeritList.validateAsync(req.body);
      const { CollegeCtrl, CourseCtrl, PercentageCtrl, categoryCtr, meritListNo, validDateTime } = req.body.data;
      const OFFSET_LIMIT = 10;
      const { groupId, page, courseName, collegeName, subjectType } = req.body;
      const offsetValue = (page - 1) * OFFSET_LIMIT;
      const collegeData = await MeritListServices.getUserData(CollegeCtrl, CourseCtrl, PercentageCtrl, categoryCtr, Number(null), Number(null), groupId, courseName as string, collegeName as string, subjectType as string);
      const collegesData = await MeritListServices.getUserData(CollegeCtrl, CourseCtrl, PercentageCtrl, categoryCtr, OFFSET_LIMIT, offsetValue, groupId, courseName as string, collegeName as string, subjectType as string);
      const userMeritListData = await MeritListServices.getAllMeritData();
      const filteredCollegesData = collegesData.filter((college: { registrationNo: number; courseId: number; }) => {
        return !userMeritListData.some(user => user.registrationNo === college.registrationNo && user.courseId === college.courseId);
      });
      res.json({ status: 200, message: "All users", data: filteredCollegesData, meritListType: meritListNo, totalCount: collegeData.length, validDateTime: validDateTime });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something went wrong" });
      next(error);
    }
  };
  /*
  Author: Moin.
  Router: /api/meritList/searchDatas
  Description: this function use for the search the data which you want in the merit list
  */
  public static searchData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await searchMeritList.validateAsync(req.body);

      const { CollegeCtrl, CourseCtrl, PercentageCtrl, categoryCtr } = req.body.data;

      const { values, page, groupId, courseName, collegeName, subjectType } = req.body;

      const OFFSET_LIMIT = 10;
      const offsetValue = (page - 1) * OFFSET_LIMIT;

      const meritListData = await MeritListServices.getUserData(CollegeCtrl, CourseCtrl, PercentageCtrl, categoryCtr, Number(null), Number(null), groupId, courseName as string, collegeName as string, subjectType as string);

      const searchData = await MeritListServices.searchData(values, CollegeCtrl, CourseCtrl, PercentageCtrl, categoryCtr, OFFSET_LIMIT, offsetValue, groupId, courseName as string, collegeName as string, subjectType as string);

      res.status(200).json({ status: 200, message: 'user search successfully', data: searchData, totalCount: meritListData });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Something went wrong" });
      next(err);

    }
  };

  /*
  Author: Moin.
  Router: /api/meritList/saveMeritListData
  Description: this function use for save the data in the table of merit list
  */
  public static saveMeritListData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await saveMeritList.validateAsync(req.body);
      const user = req.user;
      const { collegeId, courseId, CategoryName, typeOfMeritList, currentDate, listOfMerit, groupId, excelFileName, validDateTime } = req.body;
      const savedData = [];
      const revoke = 'false';
      // Send generated excel of meritlist to erpfee server
      const currentPath = process.cwd();
      let excelSendStatus;
      const filePath = currentPath + "/src/public/upload/excels/" + `${excelFileName}.xlsx`;
      const fileData = await fs.readFile(filePath);
      const formData = new FormData();
      formData.append('file', fileData as any, {
        filename: `${excelFileName}.xlsx`,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const response = await fetch(`${process.env.ERPFEE_SERVER}/v1/studentdetail/excel-upload`, {
        method: 'POST',
        headers: {
          Authorization: `${req.headers.authorization}`
        },
        body: formData
      });
      const excelResponse = await response.json();
      if (response.status === 200) {
        excelSendStatus = SendExcelStatus.SEND;
        for (const data of listOfMerit) {
          const userId = data.id;
          if (excelResponse.notSend.includes(data.registrationNo)) {
            excelSendStatus = SendExcelStatus.NOT_SEND;
          } else {
            excelSendStatus = SendExcelStatus.SEND;
          }
          const existingUser = await MeritListServices.findTheUser(userId, data.registrationNo, collegeId, courseId, typeOfMeritList);

          if (existingUser) {
            savedData.push({
              id: userId,
              message: `${existingUser.Name} already exists`
            });
          } else {
            const saveData = await MeritListServices.saveData(data.id, collegeId, courseId, CategoryName, typeOfMeritList, currentDate, data.nameAsOnMarksheet, data.email, data.registrationNo, data.mobileno, revoke, groupId, data.admissionPercentage, excelSendStatus, validDateTime);
            savedData.push({
              id: userId,
              data: saveData,
              message: `Created user: ${data.nameAsOnMarksheet}`
            });

          }
        }
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
        const activity = `Saved merit list by ${roleVerb} ${user.nameAsOnMarksheet} (${user.email}).`;

        const activity_data = {
          userId: user.id,
          name: `${user.nameAsOnMarksheet}(${user.email})`,
          activity: activity,
          activity_name: `Save merit list`,
          ip_address: IP
        };
        const activityResult = await ActivityServices.saveActivity(activity_data);
        if (activityResult) {
          res.status(200).json({
            status: 200,
            data: savedData,
            message: `Merit list save Successfully`
          });
        }
      }

    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

  /*
  Author: Moin.
  Router: /api/meritList/uploadExcels
  Description: this function use for upload the excel sheet of merit list
  */
  public static uploadExcels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, nameAsOnMarksheet, email, role } = req.user;
      uploadExcel(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        let roleVerb;
        if (role === 'SUPER_ADMIN') {
          roleVerb = 'superadmin';
        } else if (role === 'ADMIN') {
          roleVerb = 'admin';
        } else {
          roleVerb = 'student';
        }
        const activity = `Excel downloaded by ${roleVerb} ${nameAsOnMarksheet}(${email}).`;

        const activity_data = {
          userId: id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: activity,
          activity_name: `Excel Download`,
          ip_address: IP
        };
        const activityResult = await ActivityServices.saveActivity(activity_data);
        if (activityResult) {
          return res.status(200).json({ message: 'File uploaded successfully' });
        }
      });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Something went wrong" });
      next(err);
    }
  };

  /*
  Author: Moin.
  Router: /api/meritList/uploadPDFs
  Description: this function use for upload the Pfd  of merit list
  */
  public static uploadPDFs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      await uploadPDF(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const users = await UserServices.findUser(req.user.id);
        if (users) {
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
          const activity = `PDF downloaded by ${roleVerb} ${user.nameAsOnMarksheet} (${user.email}).`;

          const activity_data = {
            userId: user.id,
            name: `${user.nameAsOnMarksheet}(${user.email})`,
            activity: activity,
            activity_name: `Download PDF`,
            ip_address: IP
          };
          const activityResult = await ActivityServices.saveActivity(activity_data);

          if (activityResult) {
            return res.status(200).json({ message: 'File uploaded successfully' });
          }
        }
      });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Something went wrong" });
      next(err);
    }
  };


  /*
 Author: Moin.
 Router: /api/meritList/getMeritData
 Description: this function use for view the meritList data in on the table 
 */
  public static getMeritData = async (req: Request, res: Response, next: NextFunction) => {

    try {
      await pageId.validateAsync(req.query);
      const page = Number(req.query.page);
      const OFFSET_LIMIT = Number(10);
      const offsetValue = Number((page - 1) * OFFSET_LIMIT);
      let element: any;

      const user = await MeritListServices.getMeritData(Number(null), Number(null));
      const userData = await MeritListServices.getMeritData(OFFSET_LIMIT, offsetValue);
      if (userData) {
        for (const data of userData) {
          element = data.group_combination_admission;

        }
      }
      res.status(200).json({ status: 200, message: 'Get All Merit List Data', data: userData, subJectGroup: element, totalCount: user.length });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Something went wrong" });
      next(err);
    }
  };

  /*
  Author: Moin.
  Router: /api/meritList/revokeData
  Description: this function use for revoke the merit list which you want 
  */
  public static revokeData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Revoke.validateAsync(req.body);
      const user = req.user;
      const { typeOfMeritList, collegeId, courseId, groupId, revoke } = req.body;
      const updateUser = await MeritListServices.updateRevoke(typeOfMeritList, collegeId, courseId, groupId, revoke);
      if (updateUser) {
        const users = await UserServices.findUser(req.user.id);
        if (users) {
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
          const activity = `Merit list revoked by ${roleVerb} ${user.nameAsOnMarksheet} (${user.email}).`;

          const activity_data = {
            userId: user.id,
            name: `${user.nameAsOnMarksheet}(${user.email})`,
            activity: activity,
            activity_name: `Revoke Merit List`,
            ip_address: IP
          };
          const activityResult = await ActivityServices.saveActivity(activity_data);
          if (activityResult) {
            res.status(200).json({ status: 200, message: 'Data revoke Successfully', data: updateUser });
          }
        }
      }

    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Something went wrong" });
      next(err);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description This route is used
   * Router: /api/meritList/getAllMeritListForVerificationTab
   */
  public static getAllMerilistForVerificationTab = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, search } = req.query;
      const offsetValue = (Number(page) - 1) * Number(limit);
      const count = await MeritListServices.getTotalCountOfFeesPaid();
      const data = await MeritListServices.getAllMerilistForVerificationTab(offsetValue, Number(limit), String(search));
      res.status(200).json({ status: 200, message: 'Get meritlist data those who paid the fees', data: data, count: count });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: This route is used to change status
   * Router: /api/meritList/changeStatus
   */
  public static changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, id } = req.query;
      const user = req.user;
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      let msg: string = '';
      await MeritListServices.changeStatus(status as verifationStatus, Number(id));
      if (status === 'VERIFY') {
        msg = 'Verified Successfully!!';
      }

      if (status === 'PENDING') {
        msg = 'Pending';
      }
      let roleVerb;
      if (user.role === 'SUPER_ADMIN') {
        roleVerb = 'superadmin';
      } else if (user.role === 'ADMIN') {
        roleVerb = 'admin';
      } else {
        roleVerb = 'student';
      }

      const activity = `Changed the status of merit list[${status}] by ${roleVerb} ${user.nameAsOnMarksheet} ( ${user.email} )`;

      const activity_data = {
        userId: user.id,
        name: `${user.nameAsOnMarksheet}(${user.email})`,
        activity: activity,
        activity_name: `Change Merit list status`,
        ip_address: IP
      };
      await ActivityServices.saveActivity(activity_data);

      res.status(200).json({ status: 200, message: msg });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
    Author: Rutuja Patil.
    Router: /api/meritList/addAssignCollege
    Description: this function use for add assgin college data by admin in master_admission_meritlist table.
    */
  public static addAssignCollege = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await saveAssignCollegeData.validateAsync(req.body, validationOptions);
      const name = req.body.data.Name;
      const emailId = req.body.data.email;
      const { nameAsOnMarksheet, email, role } = req.user;
      // const currentPath = process.cwd();
      let excelSendStatus;
      const filePath = process.env.FILE_LOCATION as string + "public/upload/excels/" + `${String(req.body.ExcelFileName)}` + `.xlsx`;
      const fileData = await fs.readFile(filePath);
      const formData = new FormData();
      formData.append('file', fileData as any, {
        filename: `${req.body.ExcelFileName}.xlsx`,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const response = await fetch(`${process.env.ERPFEE_SERVER}/v1/studentdetail/excel-upload`, {
        method: 'POST',
        headers: {
          Authorization: `${req.headers.authorization}`
        },
        body: formData
      });
      if (response.status === 200) {
        excelSendStatus = SendExcelStatus.SEND;
      }
      else {
        excelSendStatus = SendExcelStatus.NOT_SEND;
      }
      const checkData = await MeritListServices.checkData(req.body.userId);
      if (!checkData) {
        const addData = await MeritListServices.addAssignCollege(req.body.data, req.body.userId, excelSendStatus);
        if (addData) {
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
          const activity = `College assign to ${name}(${emailId}) by ${roleVerb} ${nameAsOnMarksheet}(${email}).`;

          const activity_data = {
            userId: req.user.id,
            name: `${nameAsOnMarksheet}(${email})`,
            activity: activity,
            activity_name: `Assign college`,
            ip_address: IP
          };
          const activityResult = await ActivityServices.saveActivity(activity_data);

          if (activityResult) {
            res.status(200).json({ status: 200, message: "Data saved successfully", data: addData });
          }
        }
      } else {
        const updateData = await MeritListServices.updateAssignCollege(req.body.data, req.body.userId);
        if (updateData) {

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
          const activity = `Updated assigned college data of ${name}(${emailId}) by ${roleVerb} ${nameAsOnMarksheet}(${email}).`;

          const activity_data = {
            userId: req.user.id,
            name: `${nameAsOnMarksheet}(${email})`,
            activity: activity,
            activity_name: `Update assigned college`,
            ip_address: IP
          };
          const activityResult = await ActivityServices.saveActivity(activity_data);
          if (activityResult) {
            res.status(200).json({ status: 200, message: "Data updated successfully", data: updateData });
          }

        }
      }

    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: Add remark by meritlist id.
   */
  public static addRemark = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, remark } = req.body;
      await MeritListServices.addRemark(id, remark);
      const activity_data = `Remark added: ${remark}, and added by ${req.user.nameAsOnMarksheet} (${req.user.email})`;
      await activity(req.user.id, req.user.nameAsOnMarksheet, activity_data);
      res.status(200).json({ status: 200, message: 'Remark added successfully!!' });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
 Author: Moin.
 Router: /api/meritList/getYearWiseMeritData
 Description: this function use for view the year wise meritList data in on the table 
 */
  public static getYearWiseMeritData = async (req: Request, res: Response, next: NextFunction) => {

    try {
      await pageYear.validateAsync(req.query);
      const page = Number(req.query.page);
      const year = Number(req.query.year);
      const OFFSET_LIMIT = Number(10);
      const offsetValue = Number((page - 1) * OFFSET_LIMIT);
      let element: any;
      const user = await MeritListServices.getYearWiseMeritData(Number(year), Number(null), Number(null));
      const userData = await MeritListServices.getYearWiseMeritData(Number(year), OFFSET_LIMIT, offsetValue);
      if (userData) {
        for (const data of userData) {
          element = data.group_combination_admission;

        }
      }
      res.status(200).json({ status: 200, message: 'Get All Merit List Data', data: userData, subJectGroup: element, totalCount: user.length });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Something went wrong" });
      next(err);
    }
  };

  /**
   * @author: Moin
   * @description This route is used get All Year Wise MeritList Verification Tab
   * Router: /api/meritList/getAllYearWiseMeritListVerificationTab
   */
  public static getAllYearWiseMeritListVerificationTab = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year, page, limit, search } = req.query;
      const offsetValue = (Number(page) - 1) * Number(limit);
      const count = await MeritListServices.getTotalCountOfFeesPaid();
      const data = await MeritListServices.getAllYearWiseMeritListVerificationTab(Number(year), offsetValue, Number(limit), String(search));
      res.status(200).json({ status: 200, message: 'Get meritlist data those who paid the fees', data: data, count: count });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}