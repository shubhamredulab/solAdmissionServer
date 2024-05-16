import { DocumentServices } from "../services/DocumentServices";
import logger from "../utils/winston";
import { Request, Response, NextFunction } from "express";
import * as fs from 'fs';
import { deleteSchema, getImageSchema, uploadExtraDocSchema, deleteDocData, documentData, fileData, validationOptions, forErrata } from "../validator/upload";
import UserServices from '../services/UserServices';
import MenuItemServices from "../services/MenuItemService";
import { activity } from "../utils/functions";
import { IAdmissionType, VerifyDocument, admissionTypeCount } from '../types/document';
import { ActivityServices } from "../services/ActivityService";
import MeritListServices from "../services/MeritlistService";
import selfPDF from "../utils/invoiceTemplate";
import UserCourseDetailsServices from "../services/UserCourseDetailsService";

import { applicationErrata, errataValues, verifationStatus } from "../types/user";
import { promisify } from 'util';
import { compressPDF } from "../utils/compress";
const unlinkAsync = promisify(fs.unlink);
import { EducationalServices } from "../services/EducationServices";

// const BASE_URL = process.env.BASE_URL || "";

// const FILE_LOCATION = process.env.FILE_LOCATION || "";
const currentPath = process.cwd();
const FILE_LOCATION = currentPath + "/src/";


export default class DocumentController {

  /*
 Author: Rutuja Patil.
 Router: /api/documents/uploadDocuments
 Description: this function use for save the Student Documents data in the table of documents.
 */
  public static addDocDetails = async (req: Request, res: Response) => {
    try {
      await documentData.validateAsync(req.body);
      const { id, nameAsOnMarksheet, admissionType, email } = req.user;
      await fileData.validateAsync(req.file, validationOptions);
      const file = req.file;
      let filePath = '';
      let originalPath: string = '';
      let extension: string | undefined = '';
      if (!file) {
        return res
          .status(400)
          .json({ message: "File is missing in the request" });
      }
      extension = file.originalname.split(".").pop(); // Get the file extension
      originalPath = `${FILE_LOCATION}public/upload/userid/${req.body.userId}/${file.filename}`;
      filePath = originalPath;
      const newPath = `${FILE_LOCATION}public/upload/userid/${req.body.userId}/${file.filename}.${extension}`;
     let fileNames;
      fs.rename(filePath, newPath, (err) => {
        if (err) {
          logger.error("Error renaming file:", err);
        } else {
          logger.info("File Renamed!");
        }
      });
      if (['pdf'].includes(extension as string)) {
        const findOriginalPathS = `${FILE_LOCATION}public/upload/userid/${req.body.userId}/${file.filename}.${extension}`;
        const compressPath = `${FILE_LOCATION}public/upload/userid/${req.body.userId}/${file.filename}` + `Compress.` + `${extension}`;
        await compressPDF(findOriginalPathS, compressPath);
        await unlinkAsync(findOriginalPathS);
        fileNames=`${file.filename}` + `Compress.` + `${extension}`;
      }
      else if (['jpeg', 'jpg', 'png'].includes(extension as string)) {
        filePath = originalPath;
        fileNames=`${file.filename}` + `.` + `${extension}`;
        // const newPath = `${FILE_LOCATION}public/upload/userid/${req.body.userId}/${file.filename}.${extension}`;
        // filePath = `${FILE_LOCATION}public/upload/userid/${req.body.userId}/${file.filename}` + `Compress.` + `${extension}`;
        // await compressAndMoveFile(newPath, filePath);
      }
      const userId = req.body.userId;
      const fileName = String(fileNames);
      const Type = req.body.type;
      const degreeType = req.body.degreeType;
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const docDetails = await DocumentServices.addDocDetails(
        userId,
        fileName,
        Type,
        degreeType
      );
      res.status(200).json({
        status: 200,
        message: "File Uploaded Successfully",
        data: docDetails
      });
      const activity = `Uploaded documents for ${admissionType} by student ${nameAsOnMarksheet}(${email}).`;
      const data = {
        userId: id,
        name: `${nameAsOnMarksheet}(${email})`,
        activity: activity,
        activity_name: 'Documents Submission',
        ip_address: IP
      };

      await ActivityServices.saveActivity(data);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  /*
 Author: Rutuja Patil.
 Router: /api/documents/getDocuments
 Description: this function use for get the Student Documents data in the table of documents.
 */
  public static getDocuments = async (req: Request, res: Response) => {
    try {
      const docData = await DocumentServices.getDocuments(req.user.id);
      res.status(200).json({
        status: 200,
        message: "File Data Get Successfully",
        data: docData
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  /*
 Author: Rutuja Patil.
 Router: /api/documents/deleteDoc
 Description: this function use for delete the Student Document data in the table of documents.
 */
  public static deleteDoc = async (req: Request, res: Response) => {
    try {
      await deleteDocData.validateAsync(req.query);
      const { id, nameAsOnMarksheet, admissionType, email } = req.user;
      const docId = parseInt(req.query.docId as string);
      const deleteDoc = await DocumentServices.deleteDoc(docId);
      const activity = `Deleted document for ${admissionType} by student ${nameAsOnMarksheet}(${email}).`;
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const data = {
        userId: id,
        name: `${nameAsOnMarksheet}(${email})`,
        activity: activity,
        activity_name: 'Document Deleted by student',
        ip_address: IP
      };

      await ActivityServices.saveActivity(data);

      res.status(200).json({
        status: 200,
        message: "File is deleted successfully",
        data: deleteDoc
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  /*
   Author: Tiffany Correia.
   Router: /api/documents/uploadExtraDoc
   Description: This route is used for uploading documents.
   */
  public static uploadExtraDoc = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await uploadExtraDocSchema.validateAsync(req.body);
      const file: any = req.file;
      const { userId, documentType, admissionType } = req.body;

      if (!file) {
        return res
          .status(400)
          .json({ message: "File is missing in the request" });
      }
      const extension = file.originalname.split('.').pop();
      const oldname = `${FILE_LOCATION}public/upload/userid/${userId}/${file.filename}`;
      fs.rename(oldname, `${oldname}.${extension}`, () => {
        logger.info("\nFile Renamed!\n");
      });
      const errataValue = errataValues.TRUE;
      const updated_step = applicationErrata.REQUESTED;
      const errata = await DocumentServices.forErrata(Number(userId), errataValue, updated_step);
      const documents = await DocumentServices.uploadExtraDoc(userId, documentType, file.filename + "." + extension, admissionType);
      const findErrata = await DocumentServices.updateForErrata(Number(userId), errataValue, updated_step);
      if (documents) {
        const user = await UserServices.getAllUsers();
        const activityData = `${user[0].nameAsOnMarksheet} has successfully uploaded their document of ${documentType}`;
        await activity(userId, user[0].nameAsOnMarksheet, activityData);
        res.json({
          status: 200,
          message: "Document Uploaded Successfully!",
          data: documents
        });
      } else if (findErrata && errata[0].errata == '1' && errata[0].updated_step == 'requested') {
        const extension = file.originalname.split('.').pop();
        const filenames = errata[0].fileName.split('.');
        const updatedLocation = `${FILE_LOCATION}/public/upload/userid/${userId}/${errata[0].fileName}`;
        const newname = `${FILE_LOCATION}/public/upload/userid/${userId}/${filenames[0]}_old.${extension}`;
        fs.rename(updatedLocation, `${newname}`, () => {
          logger.info("\nOld File Renamed!\n");
        });
        const errataValue = errataValues.FALSE;
        const updated_step = applicationErrata.CHANGED;
        await DocumentServices.errataUpdating(Number(userId), file.filename + "." + extension, updated_step, errataValue);
        const user = await UserServices.getAllUsers();
        const activityData = `After errata, ${user[0].nameAsOnMarksheet} has successfully uploaded their document of ${documentType}`;
        await activity(userId, user[0].nameAsOnMarksheet, activityData);
        res.json({
          status: 200,
          message: "Document Uploaded Successfully!",
          data: documents
        });
      } else {
        res.json({
          status: 400,
          message: "Document Not Uploaded!"
        });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };


  /*
Author: Tiffany Correia.
Description: This route is used for deleting documents.
*/
  public static deleteDocc = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteSchema.validateAsync(req.query);
      const { userId } = req.query;
      const deleteImg = await DocumentServices.deleteDocument(Number(userId), req.query.documentType as string);
      if (deleteImg) {
        const user = await UserServices.getAllUsers();
        const activityData = `${user[0].nameAsOnMarksheet} has successfully deleted their document of ${req.query.documentType}`;
        await activity(Number(userId), user[0].nameAsOnMarksheet, activityData);
        await res.json({ status: 200, data: deleteImg, message: 'Document Deleted Successfully!' });
      }

    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public static getImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getImageSchema.validateAsync(req.query);
      const { userId } = req.query;
      const users = await DocumentServices.finduser(Number(userId));

      if (users && users.length > 0) {
        res.json({
          status: 200,
          data: users,
          message: 'An Error Occurred!'
        });
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

  /*
 Author: Pranali Gambhir
 Description: This function retrieves the total count of photos categorized by admission type (UG and PG).
*/
  public static getTotalPhotosCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admissionTypeCounts = await DocumentServices.admissionTypeCounts();
      const result = {
        UG: 0,
        PG: 0
      };

      admissionTypeCounts.forEach((count: admissionTypeCount) => {
        if (count.master_admission_documents_admissionType === 'UG') {
          result.UG = parseInt(count.count);
        } else if (count.master_admission_documents_admissionType === 'PG') {
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
 Description: This function retrieves document data for a specific user based on the provided userId parameter.
*/
  public static getDocumentsData = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId as string);
      const docData = await DocumentServices.getDocuments(userId);
      res.json({
        status: 200,
        message: "File Data Get Successfully",
        data: docData
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  /*
   Author: Pranali Gambhir
   Description: This function handles the update of document errata for a specified user and document and made entry of activity in activity_tracking table.
   */
  public static setDocErrata = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { id, nameAsOnMarksheet, email, role } = req.user;
      const docId = req.body.id;
      const userId = req.body.userId;

      const errataValue = req.body.errata;
      const updatedStep = req.body.updated_step;

      await DocumentServices.updateErrata(docId, errataValue, updatedStep);

      const userData = await UserServices.getPersonalData(userId);
      const docData = await DocumentServices.getDocById(docId);
      if (!userData) {
        // Handle the case where userData is null
        throw new Error('User data not found');
      }
      if (!docData) {
        // Handle the case where userData is null
        throw new Error('Document data not found');
      }
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

      const formattedActivity = `${roleVerb} ${nameAsOnMarksheet}(${email}) has made an errata entry of ${userData.admissionType} student ${userData.nameAsOnMarksheet}(${userData.email})[Document: ${docData.documentType}]`;
      const activity = `${roleVerb} ${nameAsOnMarksheet}(${email}) has updated an errata for ${userData.admissionType} student ${userData.nameAsOnMarksheet}(${userData.email})[Document: ${docData.documentType}]`;

      if (errataValue == 1) {

        const data = {
          userId: id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: formattedActivity,
          activity_name: `Errata Entry `,
          ip_address: IP
        };
        await ActivityServices.saveActivity(data);
      } else if (errataValue == 0) {
        const data = {
          userId: id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: activity,
          activity_name: `Errata Updated`,
          ip_address: IP
        };
        await ActivityServices.saveActivity(data);
      }
      res.status(200).json({ status: 200, message: "Errata updated successfully" });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
   Author: Pranali Gambhir
   Description: This function retrieves requested documents data based on the user's role (SUPER_ADMIN or ADMIN).
   */
  public static getReqDocuments = async (req: Request, res: Response) => {
    try {
      const user = req.user;
      const { errata, updated_step } = req.query;
      let responseData: {
        id: number; userId: number; documentType: string; fileName: string; filePath: string; // Add the filePath
        extension: string; user: { nameAsOnMarksheet: string; email: string; registrationNo: string | number; };
      }[] = [];
      if (req.user.role === 'SUPER_ADMIN') {
        // Logic for SUPER_ADMIN role
        const allReqDocuments = await DocumentServices.getAllReqDocuments(errata as errataValues, updated_step as applicationErrata);

        if (Array.isArray(allReqDocuments)) {
          responseData = await Promise.all(allReqDocuments.map(async (doc: { userId: number; id: number; documentType: string; fileName: string; filePath: string; extension: any; updatedAt: Date }) => {
            const user = await UserServices.findUser(doc.userId); // Replace with the appropriate method to fetch user data
            return {
              id: doc.id,
              userId: doc.userId,
              documentType: doc.documentType,
              fileName: doc.fileName,
              filePath: doc.filePath, // Add the filePath
              extension: doc.extension,
              updatedAt: doc.updatedAt,
              user: {
                nameAsOnMarksheet: user ? user.nameAsOnMarksheet : "",
                email: user ? user.email : "",
                registrationNo: user ? user.registrationNo : ""
              }
            };
          }));
        }
      } else {
        // Logic for ADMIN role
        const menuItemData = await MenuItemServices.getMenuItemByUserId(user.id);

        if (!menuItemData) {
          return res.status(400).json({ status: 400, message: 'Menu item not found' });
        }

        for (let i = 0; i < menuItemData.degreeType.length; i++) {
          const degreeType = menuItemData.degreeType[i];
          const reqDocData = await DocumentServices.getReqDocuments(errata as errataValues, updated_step as applicationErrata, degreeType as IAdmissionType);

          if (Array.isArray(reqDocData)) {
            responseData.push(
              ...await Promise.all(reqDocData.map(async (doc: { userId: number; id: number; documentType: string; fileName: string; filePath: string; extension: any; updatedAt: Date; }) => {
                const user = await UserServices.findUser(doc.userId); // Replace with the appropriate method to fetch user data
                return {
                  id: doc.id,
                  userId: doc.userId,
                  documentType: doc.documentType,
                  fileName: doc.fileName,
                  filePath: doc.filePath, // Add the filePath
                  extension: doc.extension,
                  updatedAt: doc.updatedAt,
                  user: {
                    nameAsOnMarksheet: user ? user.nameAsOnMarksheet : "",
                    email: user ? user.email : "",
                    registrationNo: user ? user.registrationNo : ""
                  }
                };
              })
              ));
          }
        }
      }
      // Sort the data array based on the created_at field in descending order
      responseData.sort((a: any, b: any) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      });

      res.json({
        status: 200,
        message: "File data retrieved successfully",
        data: responseData
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  /*
 Author: Tiffany Correia.
 Description: This route is used for getting all the data from the documents table as per their errata and updated_step columns.
 */
  public static forErrata = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await forErrata.validateAsync(req.query);
      const { userId } = req.query;
      const errataValue = errataValues.TRUE;
      const updated_step = applicationErrata.REQUESTED;
      const errata = await DocumentServices.forErrata(Number(userId), errataValue, updated_step);

      if (errata) {
        res.json({
          status: 200,
          data: errata,
          message: 'Data Received Successfully!'
        });
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

  /*
   Author: Pranali Gambhir
   Description: Define a method for searching document data
   */
  public static searchDocData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchCriteria, value, updated_step } = req.query;
      // Check if both searchCriteria and value are defined before proceeding
      if (typeof searchCriteria === 'string' && typeof value === 'string') {
        // Provide a default value for updated_step if it is undefined
        const docData = await DocumentServices.getSearchdocData(
          searchCriteria,
          value,
          updated_step ? updated_step.toString() : "default_value"
        );
        res.status(200).json({ status: 200, message: 'All Documents', data: docData });
      } else {
        res.status(400).json({ message: 'Invalid search criteria or value' });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: Verify document by document id
   */
  public static verifyDocumentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { documentId, status, studentId, registrationNo, collegeId, courseId } = req.body;
      const user = req.user;
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await DocumentServices.verifyDocument(documentId, status as VerifyDocument);
      let verifyCount: number = 0;
      let documentType;
      const documents = await DocumentServices.getDocuments(studentId);
      for (const document of documents) {
        if (document.verify === 'true') {
          verifyCount = verifyCount + 1;
        }
        if (document.id === documentId) {
          documentType = document.documentType;
        }
      }
      if (documents.length === verifyCount) {
        await MeritListServices.verifyStatusIfAllDocumentsVerified(
          registrationNo, collegeId, courseId, verifationStatus.VERIFY
        );
      }
      let roleVerb;
      if (user.role === 'SUPER_ADMIN') {
        roleVerb = 'superadmin';
      } else if (user.role === 'ADMIN') {
        roleVerb = 'admin';
      } else {
        roleVerb = 'student';
      }
      const activity = `Verified document(${documentType}) of registration no.[${registrationNo}] by ${roleVerb} ${user.nameAsOnMarksheet} (${user.email}).`;

      const activity_data = {
        userId: user.id,
        name: `${user.nameAsOnMarksheet}(${user.email})`,
        activity: activity,
        activity_name: `Verify Document`,
        ip_address: IP
      };
      await ActivityServices.saveActivity(activity_data);

      res.status(200).json({ status: 200, message: 'Document verified successfully!!' });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Rutuja Patil
   * router:/api/documents/uploadErrataDocuments
   * @description: Re-uploaded documents by admin which is errta.
   */
  public static uploadErrataDocuments = async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res
          .status(400)
          .json({ message: "File is missing in the request" });
      }
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const extension = file.originalname.split(".").pop(); // Get the file extension
      const oldPath = `${FILE_LOCATION}public/upload/userid/${req.body.userId}/${file.filename}`;
      const newPath = `${FILE_LOCATION}public/upload/userid/${req.body.userId}/${file.filename}.${extension}`;
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          logger.error("Error renaming file:", err);
        } else {
          logger.info("File Renamed!");
        }
      });
      const docId = req.body.docId;
      const fileName = file.filename + "." + extension;
      const errataValue = errataValues.FALSE;
      const updated_step = applicationErrata.CHANGED;
      const docDetailsUpdated = await DocumentServices.updateDocDetails(
        docId,
        fileName,
        errataValue,
        updated_step
      );
      const activity = `Document re-uploaded by  ${req.user.email} of ${req.body.userId}-${req.body.type}`;
      const activity_data = {
        userId: req.user.id,
        name: `${req.user.nameAsOnMarksheet}(${req.user.email})`,
        activity: activity,
        activity_name: `Reupload Document [${req.body.type}]`,
        ip_address: IP
      };

      const activityResult = await ActivityServices.saveActivity(activity_data);
      if (activityResult) {
        res.status(200).json({
          status: 200,
          message: "File Uploaded Successfully",
          data: docDetailsUpdated
        });
      }

    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  /**
   * @author: Moin
   * @description: this function use to generate the application form pdf with college and course wise
   * Router: /api/documents/downloadAdmissionForm
   */
  public static downloadAdmissionForm = async (req: Request, res: Response, next: NextFunction) => {
  
    try{
      const personalData = await UserServices.getPersonalData(req.body.userId);
      const educationData = await EducationalServices.getEduData(req.body.userId);
      const documentData = await DocumentServices.checkStepper(req.body.userId);
      const getPGDetails = await EducationalServices.getPGDetails(req.body.userId);
      const collegeAndCourseName = await UserCourseDetailsServices.getCollegeAndCourseName(req.body.userId);
      const viewData: { admissionNo: number; firstName: string; }[] = [];
      for (const data of collegeAndCourseName) {
          viewData.push({ admissionNo: data.admission_form_no, firstName: data.firstName });
          selfPDF.AdmissionForm(req.body.userId, personalData, educationData, documentData, data.collegeName, data.courseName, data.admission_form_no, data.firstName, getPGDetails, function (err: any) {
            if (err) {
              res.send({ status: 400, data: err });
            }
          });
      }
      setTimeout(function () {
        res.send({ status: 200, data: viewData });
      }, 3000);
    }
    
    catch (error) {
      logger.error(error);
      next(error);
    }
  };
  /**
   * @author: Moin
   * @description: this function use to generate the PHD Application form pdf 
   */
  public static downloadPhdAdmissionForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const { personalData, eduData, documentData, userId, entranceData } = req.body;
  
      if (!userId) {
        return res.status(400).send({ status: 400, message: "User ID not found" });
      }
  
      const pdfData = await selfPDF.PhdAdmissionForm(userId, personalData, eduData, documentData, entranceData, randomNumber);
  
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="phd_applicationForm.pdf"`
      });
      res.send({ status: 200, data: pdfData });
      // res.send(pdfData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send({ status: 500, message: 'Internal server error' });
      logger.error(error);
      next(error);
    }
  };
  

  public static downloadApplicationForm = async(req: Request, res: Response, next: NextFunction) => {
    try{
      const personalData = await UserServices.getPersonalData(req.body.userId);
      const educationData = await EducationalServices.getEduData(req.body.userId);
      const documentData = await DocumentServices.checkStepper(req.body.userId);
      const getPGDetails = await EducationalServices.getPGDetails(req.body.userId);

      const collegeAndCourseName = await UserCourseDetailsServices.getCollegeAndCourseName(req.body.userId);
      const viewData: { admissionNo: number; firstName: string; }[] = [];
      for (const data of collegeAndCourseName) {
        // const filePath = `${process.env.FILE_LOCATION }public/upload/userid/${req.body.userId}/admissionForm/` + data.admission_form_no + `-` + data.firstName + '.pdf';
        // if(fs.existsSync(filePath)){
          viewData.push({ admissionNo: data.admission_form_no, firstName: data.firstName });
        // }else{
          selfPDF.AdmissionForm(req.body.userId, personalData, educationData, documentData, data.collegeName, data.courseName, data.admission_form_no, data.firstName, getPGDetails, function (err: any) {
            if (err) {
              res.send({ status: 400, data: err });
            }
          });
        // }
      }
      setTimeout(function () {
        res.send({ status: 200, data: viewData });
      }, 3000);
    }catch(error) {
      logger.error(error);
      next(error);
    }
  };
}