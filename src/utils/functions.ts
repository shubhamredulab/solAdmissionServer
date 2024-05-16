import { ActivityServices } from '../services/ActivityService';
import * as fs from 'fs';
import path from 'path';
import logger from './winston';
import UserCourseDetailsServices from '../services/UserCourseDetailsService';
import { PreferencesServices } from '../services/PreferencesServices';
import { sendingEmail, sendingMsg } from './emails';
/*
Author: Moin.
Description: This function use to track the user activity and save on the database that record,
*/
export async function activity(userId: number, name: string, activity: string) {
    const UserData = await ActivityServices.createData(userId, name, activity);
    return UserData;
}

 
/**
   * @author Moin
   * @description this function use to create the folder in public folder if the project on run.
   */
export function myUploadfiles() {
  const currentPath = process.cwd();
  const foldersToCreate = ['upload/userid', 'upload/InfoFiles', 'upload/excels', 'upload/Pdf', 'upload/collegeLogo'];
  const __dirname = currentPath + "/src/";
  const publicFolderPath = path.join(__dirname, 'public');

  foldersToCreate.forEach((folderName) => {
    const folderPath = path.join(publicFolderPath, folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdir(folderPath, { recursive: true }, (error: NodeJS.ErrnoException | null) => {
        if (error) {
          logger.error(`Failed to create ${folderName} folder:`, error);
        } else {
          logger.info(`${folderName} folder created successfully!`);
        }
      });
    } else {
      // logger.warn(`${folderName} folder already exists.`);
    }
  });
}

export default myUploadfiles;

export function jsonParser(data: Array<any> | object | string): any {
  const json: string = JSON.stringify(data);
  return JSON.parse(json, (key: string, value: any) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    }
    return value;
  });
}


/**
  * @author: Rutuja Patil
  * @description:To generate Application form no for individual entry in table master_admission_user_course_details. 
 /*/

let lastAdmissionFormNumberUG: number = 200001; // Initial form number for UG
let lastAdmissionFormNumberPG: number = 600001; // Initial form number for PG

export async function generateAdmissionFormNumber(degree: string): Promise<string> {
  let admissionFormNumberCounter: number;

  if (degree.toUpperCase() === 'UG') {
    admissionFormNumberCounter = lastAdmissionFormNumberUG;
    lastAdmissionFormNumberUG++; // Increment for next UG preference
  } else if (degree.toUpperCase() === 'PG') {
    admissionFormNumberCounter = lastAdmissionFormNumberPG;
    lastAdmissionFormNumberPG++; // Increment for next PG preference
  } else {
    throw new Error('Invalid degree type provided');
  }

  // Ensure the form number has six digits
  const formattedNumber = admissionFormNumberCounter.toString().padStart(6, '0');

  return formattedNumber;
}

export async function sendMsgAndEmail(data:any){
  const preData = await PreferencesServices.getPreferences(data.id);
    if (preData) {
        const emailData = {
          receiverName: data.nameAsOnMarksheet,
          receiverEmail: data.email,
          subjectEmail: `Application Submitted For ${data.admissionType}`,
          senderEmail: process.env.senderEmail
        };
        await sendingEmail(emailData);
        const msgData = {
           to: Number(data.mobileno)
        };
        await sendingMsg(msgData);

    }
}
