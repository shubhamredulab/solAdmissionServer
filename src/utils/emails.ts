import * as dotenv from 'dotenv';
import EmailTemplates from '../services/EmailTemplates';
dotenv.config();
import fetch from 'node-fetch';
const URL: string | undefined = process.env.url;
const emailtoken = process.env.emailtoken;
const smsURL: string | undefined = process.env.smsUrl;
const smsToken = process.env.smstoken;
const emailurl = process.env.EMAIL_ATTACHMENT_URL;
const emailAttachmenttoken = process.env.EMAIL_ATTACHMENT_TOKEN;
import FormData from 'form-data';
/*
Author: Moin
Description: this function use to sent email with having there email template
*/
export async function sendEmailWithText(textData: {receiverName?: string; SerialNo?:string ; PINNo?: string; receiverEmail?: string; password?: string; subjectEmail?: string;senderEmail?:string }) {
    const emailText = EmailTemplates.sendEmailText(textData.receiverName, textData.SerialNo, textData.PINNo, textData. receiverEmail, textData.password);
    const body = JSON.stringify({
        "to": textData.receiverEmail,
        "from": textData.senderEmail,
        "subject": textData.subjectEmail,
        "text": emailText
    });
        const response = await fetch(`${URL}`, {
        method: 'post',
        body: body,
        headers: {
            'Authorization': 'Bearer '+emailtoken,
            'Content-Type': 'application/json'
        }
    });

    return response;
  }
/*
Author: Moin
Description: this function use to sent SMS with having there SMS template
*/
export async function sendSms(smsData: { to: number }) {
  const { to, msg } = EmailTemplates.sendSecondSMS(smsData.to);
    const body = JSON.stringify({
        "to": to,
        "msg": msg
    });

    const URL = `${smsURL}`;
    const response = await fetch(`${URL}`, {
        method: 'post',
        body: body,
        headers: {
            'accept': '*/*',
            'Authorization': 'Bearer ' + smsToken,
            'Content-Type': 'application/json'
        }
    });

     const status = response.status;
    return {status};
}

 
/*
Author: Moin
Description: this function use to sent Email with having Attachment
*/
export async function sendEmailWithTextAndAttachment(mailData: { data: string, file: { filename: string, path: string }[], details: { receiverName: string; receiverEmail: string; password: string; subjectEmail: string; senderEmail?: string; cc:string, bcc:string}; }, fileData: Buffer) {
  const formData = new FormData();

  formData.append('to', mailData.details.receiverEmail);
  formData.append('from', mailData.details.senderEmail);
  formData.append('subject', mailData.details.subjectEmail);
  formData.append('text', mailData.data);
  // formData.append('cc', mailData.details.cc); // this is optional use 
  formData.append('bcc', mailData.details.bcc);
  for (const file of mailData.file) {
    formData.append('files', fileData, {
      filename: file.filename
    });
  }
  const response = await fetch(`${emailurl}`, {
    method: 'post',
    headers: {
      'accept': '*/*',
      'Authorization': 'Bearer ' + emailAttachmenttoken,
      ...formData.getHeaders() // Include headers from form-data
    },
    body: formData
  });
  const responseData = await response;
  return responseData;
}

/*
Author: Tiffany Correia
Description: This function is used to send an email with an email template.
*/
export async function registerEmail(textData: {receiverName?: string; SerialNo? :string; PINNo?: string; nextRegNo?: number; receiverEmail?: string; subjectEmail?: string; senderEmail?:string }) {
  const emailText = EmailTemplates.sendingEmail(textData.receiverName, textData.nextRegNo, textData.SerialNo, textData.PINNo);
  const body = JSON.stringify({
      "to": textData.receiverEmail,
      "from": textData.senderEmail,
      "subject": textData.subjectEmail,
      "text": emailText
  });
      const response = await fetch(`${URL}`, {
      method: 'post',
      body: body,
      headers: {
          'Authorization': 'Bearer '+emailtoken,
          'Content-Type': 'application/json'
      }
  });

  return response;
}

/*
Author: Tiffany Correia
Description: This function is used for shooting a text message on saving Personal Details.
*/
export async function sendingTextSms(smsData: { to: number, serialNo: number, nextRegNo: number, PINNo: string; }) {
  const { to, msg } = EmailTemplates.sendText(smsData.to, smsData.serialNo, smsData.nextRegNo, smsData.PINNo);
  const body = JSON.stringify({
    "to": to,
    "msg": msg
  });

  const URL = `${smsURL}`;

  const response = await fetch(`${URL}`, {
    method: 'post',
    body: body,
    headers: {
      'accept': '*/*',
      'Authorization': 'Bearer ' + smsToken,
      'Content-Type': 'application/json'
    }
  });

  const status = response.status;
  return { status };
}  
  /*
Author: moin
Description: This function is used to send an Second SMS to check the register email or password template.
*/
export async function sendSecondSms(To: number) {
  const { to, msg } = EmailTemplates.sendSecondSMS(To);
  const body = JSON.stringify({
      "to": to,
      "msg": msg
  });
  const URL = `${smsURL}`;
  const headers = {
    'accept': '*/*',
    'Authorization': 'Bearer ' + smsToken,
    'Content-Type': 'application/json'
};
  const response = await fetch(`${URL}`, {
      method: 'post',
      body: body,
      headers: headers
  });

  const status = response.status;
  return {status};
}
/*
Author: Moin
Description: this function use to sent email with having there email template
*/
export async function sendEmailToCreated( mailData: { details: { receiverName: string; receiverEmail: string; password: string; subjectEmail: string; senderEmail?: string;mobileNo:number, cc:string, bcc:string}; }) {
       const emailData = EmailTemplates.sendEmailCreatedUser(
        mailData.details.receiverName,
        mailData.details.receiverEmail,
        mailData.details.password,
        mailData.details.mobileNo
        );
  const body = JSON.stringify({
    "to": mailData.details.receiverEmail,
    "from": mailData.details.senderEmail,
    "subject": mailData.details.subjectEmail,
    "text": emailData,
    "bcc":mailData.details.bcc
});
    const response = await fetch(`${URL}`, {
    method: 'post',
    body: body,
    headers: {
        'Authorization': 'Bearer '+emailtoken,
        'Content-Type': 'application/json'
    }
});
 const responseData = await response.text();
  return responseData;

}

export async function sendingEmail(emailData:{receiverName?: string; receiverEmail?: string; subjectEmail?: string; senderEmail?:string}){
  const emailText = EmailTemplates.sendEmail(emailData.receiverName);
  const body = JSON.stringify({
      "to": emailData.receiverEmail,
      "from": emailData.senderEmail,
      "subject": emailData.subjectEmail,
      "text": emailText
  });
      const response = await fetch(`${URL}`, {
      method: 'post',
      body: body,
      headers: {
          'Authorization': 'Bearer '+ emailtoken,
          'Content-Type': 'application/json'
      }
  });
  return response;
}

export async function sendingMsg(data: {to:number}) {
  const {to, msg} = EmailTemplates.sendingMsg(data.to);
   const body = JSON.stringify({
     "to": to,
     "msg": msg
   });
   const URL = `${smsURL}`;
   const headers = {
     'accept': '*/*',
     'Authorization': 'Bearer ' + smsToken,
     'Content-Type': 'application/json'
   };
   const response = await fetch(`${URL}`, {
     method: 'POST',
     body: body,
     headers: headers
   });
   const status = response.status;
   return{status};
 }
 
/**
 * @author: Priyanka Vishwakarma
 * @description: To send OTP on email
 * @param emailData 
 * @param otp 
 */
export const sendOTPOnEmail = async (emailData: { receiverName?: string; receiverEmail?: string; subjectEmail?: string; senderEmail?: string }, otp: number) => {

  const emailTextForOTP = EmailTemplates.sendingOTPOnEmail(otp);
  const body = JSON.stringify({
    "to": emailData.receiverEmail,
    "from": emailData.senderEmail,
    "subject": emailData.subjectEmail,
    "text": emailTextForOTP
  });
  const response = await fetch(`${URL}`, {
    method: 'post',
    body: body,
    headers: {
      'Authorization': 'Bearer ' + emailtoken,
      'Content-Type': 'application/json'
    }
  });
  return response;
};

/**
 * @author: Priyanka Vishwakarma
 * @function: To send OTP by text msg
 * @param data 
 * @param otp 
 */
export const sendOTPOnMSG = async (data: { to: number }, otp: number) => {

  const { to, msg } = EmailTemplates.sendingOTPOnMsg(data, otp);
  const body = JSON.stringify({
    "to": to,
    "msg": msg
  });
  const URL = `${smsURL}`;
  const headers = {
    'accept': '*/*',
    'Authorization': 'Bearer ' + smsToken,
    'Content-Type': 'application/json'
  };
  const response = await fetch(`${URL}`, {
    method: 'POST',
    body: body,
    headers: headers
  });
  const status = response.status;
  return { status };
};





