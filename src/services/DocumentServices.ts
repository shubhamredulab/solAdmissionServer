import { Documents } from "./../entity/Documents";
import { AppDataSource } from "../data-source";
import { In } from "typeorm";
const DocumentsRepository = AppDataSource.getRepository(Documents);
const BASE_URL = process.env.BASE_URL || "";
import { IAdmissionType, VerifyDocument } from '../types/document';
import { applicationErrata, errataValues } from "../types/user";

export class DocumentServices {

  /*
 Author: Rutuja Patil.
 Description: this function use for add student Documents data in documents table.
 */
  public static addDocDetails = async (
    userId: number,
    fileName: string,
    Type: string,
    degreeType: IAdmissionType
  ) => {
    const existDoc = await DocumentsRepository.findOneBy({
      userId: userId,
      documentType: Type
    });

    if (!existDoc) {
      return await DocumentsRepository.save({
        userId: userId,
        documentType: Type,
        fileName: fileName,
        admissionType: degreeType
      });
    }
    return null;
  };

  /*
Author: Rutuja Patil.
Description: this function use for Stepper.
*/
  public static checkStepper = async (id: number) => {
    const user = await DocumentsRepository.find({ where: { userId: id, documentType: In(['Sign', 'Photo', 'HSCMarksheet', 'SSCMarksheet', 'UGMarksheet', 'PGMarksheet', 'Entrance Exam Marksheet', 'Disability Certificate', 'Non-Creamy Certificate', 'Caste Certificate']) } });
    return user;
  };

  /*
 Author: Rutuja Patil.
 Description: this function use for get student Documents data from documents table.
 */
  public static getDocuments = async (userId: number) => {
    const docData = await DocumentsRepository.find({
      where: { userId: userId, documentType: In(['Sign', 'Photo', 'UGMarksheet', 'HSCMarksheet', 'SSCMarksheet', 'Aadhar Card', 'Caste Certificate', 'Extra Curricular Activity (Optional)', 'Extra Marksheet', 'Others', 'PGMarksheet', 'Entrance Exam Marksheet', 'Disability Certificate', 'Non-Creamy Certificate']) }
    });
    const docArray: {
      id: number;
      documentType: string;
      filePath: string;
      extension: string | undefined;
      fileName: string;
      errata: errataValues;
      updated_step: string;
      verify: VerifyDocument;
      admissionType :string;
    }[] = [];
    if (docData) {
      docData.forEach(async function (doc) {
        if (doc) {
          const extension = doc.fileName.split(".").pop();
          docArray.push({
            id: doc.id,
            documentType: doc.documentType,
            filePath: `${BASE_URL}api/uploads/userid/${doc.userId}/${doc.fileName}`, //BASE_URL + 'upload/' + doc.userId + '/' + doc.fileName,
            extension: extension,
            fileName: doc.fileName,
            errata: doc.errata,
            updated_step: doc.updated_step,
            verify: doc.verify,
            admissionType: doc.admissionType
          });
        }
      });
    }
    return docArray;
  };

  /*
  Author: Rutuja Patil.
  Description: this function use for delete student Documents data from the documents table.
  */
  public static deleteDoc = async (docId: number) => {
    const deleteDoc = await DocumentsRepository.createQueryBuilder()
      .delete()
      .from(Documents)
      .where("id = :id", { id: docId }) // First condition
      .execute();
    return deleteDoc;
  };

  /*
Author: Pranali Gambhir
Description: This function retrieves admission type counts for documents of a specific type ('Photo').
*/
  public static admissionTypeCounts = async () => {
    const admissionTypeCounts = await DocumentsRepository.createQueryBuilder('master_admission_documents')
      .select([
        'master_admission_documents.admissionType',
        'COUNT(master_admission_documents.id) as count'
      ])

      .groupBy('master_admission_documents.admissionType')
      .getRawMany();

    return admissionTypeCounts;
  };

  public static uploadExtraDoc = async (user_id: number, documentType: string, fileName: string, admissionType: IAdmissionType) => {
    return await DocumentsRepository.save({ userId: user_id, documentType: documentType, fileName: fileName, admissionType: admissionType });
  };

  public static finduser = async (user_id: number) => {
    return await DocumentsRepository.findBy({ userId: user_id });
  };

  public static deleteDocument = async (userId: number, documentType: string) => {
    return await DocumentsRepository.delete({ userId: userId, documentType: documentType });
  };

  /*
Author: Pranali Gambhir
Description: This function updates the errata information for a document with the specified ID
*/
  public static updateErrata = async (docId: number, errataValue: errataValues, updatedStep: applicationErrata) => {
    const errataStatus = await DocumentsRepository.createQueryBuilder()
      .update(Documents)
      .set({ errata: errataValue, updated_step: updatedStep })
      .where("id = :id", { id: docId })
      .execute();
    return errataStatus;
  };

  /*
Author: Pranali Gambhir
Description: This function retrieves required documents based on specified criteria for Admin login.
*/
  public static getReqDocuments = async (errata: errataValues, updated_step: applicationErrata, degreeType: IAdmissionType) => {
    const reqDocuments = await DocumentsRepository.find({
      where: { errata, updated_step, admissionType: degreeType }
    });
    const docArray: {
      id: number;
      userId: number;
      documentType: string;
      filePath: string;
      extension: string | undefined;
      fileName: string;
      updatedAt: Date;

    }[] = [];
    if (reqDocuments) {
      reqDocuments.forEach(async function (doc) {
        if (doc) {
          const extension = doc.fileName.split(".").pop();
          docArray.push({
            id: doc.id,
            userId: doc.userId,
            documentType: doc.documentType,
            filePath: `${BASE_URL}api/uploads/userid/${doc.userId}/${doc.fileName}`,
            extension: extension,
            fileName: doc.fileName,
            updatedAt: doc.updatedAt
          });
        }
      });
    }
    return docArray;
  };

  /*
Author: Pranali Gambhir
Description: This function retrieves required documents based on specified criteria for Superadmin login.
*/
  public static getAllReqDocuments = async (errata: errataValues, updated_step: applicationErrata) => {
    const reqDocuments = await DocumentsRepository.find({ where: { errata, updated_step } });
    const docArray: {
      id: number;
      userId: number;
      documentType: string;
      filePath: string;
      extension: string | undefined;
      fileName: string;
      updatedAt: Date;

    }[] = [];
    if (reqDocuments) {
      reqDocuments.forEach(async function (doc) {
        if (doc) {
          const extension = doc.fileName.split(".").pop();
          docArray.push({
            id: doc.id,
            userId: doc.userId,
            documentType: doc.documentType,
            filePath: `${BASE_URL}api/uploads/userid/${doc.userId}/${doc.fileName}`,
            extension: extension,
            fileName: doc.fileName,
            updatedAt: doc.updatedAt
          });
        }
      });
    }
    return docArray;
  };

  /*
  Author: Tiffany Correia.
  Description: This function is used to update the row after uploading the document when errta has taken place.
  */
  public static errataUpdating = async (userId: number, filename: string, updated_step: applicationErrata, errata: errataValues) => {
    const errataUpdating = await DocumentsRepository.createQueryBuilder()
      .update(Documents)
      .set({ fileName: filename, updated_step: updated_step, errata: errata })
      .where("userId = :userId", { userId: userId })
      .execute();
    return errataUpdating;
  };

  /*
  Author: Tiffany Correia.
  Description: This function is used to find an entry in the documents table as per the given condition.
  */
  public static updateForErrata = async (user_id: number, errataValue: errataValues, updated_step: applicationErrata) => {
    return await DocumentsRepository.find({ where: { userId: user_id, errata: errataValue, updated_step: updated_step } });
  };

  public static forErrata = async (userId: number, errataValue: errataValues, updated_step: applicationErrata) => {
    return await DocumentsRepository.find({ where: { userId: userId, errata: errataValue, updated_step: updated_step } });
  };

  /*
 Author: Pranali Gambhir
 Description: This function retrieves a document from the database based on its ID.
 */
  public static getDocById = async (id: number) => {
    const user = await DocumentsRepository.findOneBy({ id: id });
    return user;
  };

  /*
  Author: Pranali Gambhir
  Description: This function is used to retrieve document data of specific student based on search criteria and value.
  */
  public static getSearchdocData = async (searchCriteria: string, value: string, updated_step: string) => {
    let query = "";

    switch (searchCriteria) {
      case 'nameAsOnMarksheet':
        query = `
        SELECT u.*, d.*
        FROM master_admission_users AS u
        LEFT JOIN master_admission_documents AS d ON d.userId = u.id
        WHERE u.role = 'STUDENT' 
          AND d.errata = '1' 
          AND (d.updated_step IN ('requested', 'changed') AND d.updated_step = '${updated_step}')
          AND u.nameAsOnMarksheet LIKE '${value}%';
      `;
        break;
      case 'email':
        query = `
          SELECT u.*, d.*
          FROM master_admission_users AS u
          LEFT JOIN master_admission_documents AS d ON d.userId = u.id
          WHERE u.role = 'STUDENT' 
            AND d.errata = '1' 
            AND (d.updated_step IN ('requested', 'changed') AND d.updated_step = '${updated_step}')
            AND u.email LIKE '${value}%';
        `;
        break;
      case 'documentType':
        query = `
        SELECT u.*, d.*
        FROM master_admission_users AS u
        LEFT JOIN master_admission_documents AS d ON d.userId = u.id
        WHERE u.role = 'STUDENT' 
          AND d.errata = '1' 
          AND (d.updated_step IN ('requested', 'changed') AND d.updated_step = '${updated_step}')
          AND d.documentType LIKE '${value}%';
      `;
        break;
      case 'registrationNo':
        query = `
          SELECT u.*, d.*
          FROM master_admission_users AS u
          LEFT JOIN master_admission_documents AS d ON d.userId = u.id
          WHERE u.role = 'STUDENT' 
            AND d.errata = '1' 
            AND (d.updated_step IN ('requested', 'changed') AND d.updated_step = '${updated_step}')
            AND u.registrationNo LIKE '${value}%';
        `;
        break;
      default:
        query = "SELECT u.* FROM master_admission_users AS u WHERE u.role = 'STUDENT'";
        break;
    }
    const data = DocumentsRepository.query(query);
    return data;
  };

  /**
   * @author: Priyanka Vishwakarma
   * @function: Verify document by document id
   * @param documentId 
   * @param status: enum value boolean 0 for not verify and 1 for verify
   */
  public static verifyDocument = async (documentId: number, status: VerifyDocument) => {
    const result = await DocumentsRepository.createQueryBuilder()
      .update(Documents)
      .set({ verify: status })
      .where("id = :id", { id: documentId })
      .execute();
    return result;
  };

  /**
   * @author: Rutuja Patil
   * @description: Re-uploaded documents by admin which is errta.
   */
  public static updateDocDetails = async (
    docId: number,
    fileName: string,
    errataValue: errataValues,
    updated_step: applicationErrata
  ) => {
    const docDetailsUpdated = await DocumentsRepository.createQueryBuilder()
      .update(Documents)
      .set({ fileName: fileName, errata: errataValue, updated_step: updated_step })
      .where("id = :id", { id: docId })
      .execute();
    return docDetailsUpdated;
  };

  /*
  Author: Pranali Gambhir
  Description: This function is used to get count of all documents within selected date range for admin and superadmin dashboard.
  */
  public static getDocumentsInDateRange = async (startDate: string, endDate: string) => {
    return await DocumentsRepository
      .createQueryBuilder('doc')
      .select('doc.admissionType', 'admissionType')
      .addSelect('COUNT(doc.id)', 'count')
      .where('doc.createdAt >= :startDate AND doc.createdAt <= :endDate', { startDate, endDate })
      .groupBy('doc.admissionType')
      .getRawMany();
  };

  /*
   Author: Pranali Gambhir
   Description: This function is used to get count of all documents for a selected date for admin and superadmin dashboard.
   */
  public static getDocsForDay = async (date: string) => {
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

    return await DocumentsRepository
      .createQueryBuilder('doc')
      .select('doc.admissionType', 'admissionType')
      .addSelect('COUNT(doc.id)', 'count')
      .where('doc.createdAt >= :startOfDay', { startOfDay })
      .andWhere('doc.createdAt < :endOfDay', { endOfDay })
      .groupBy('doc.admissionType')
      .getRawMany();
  };

}
