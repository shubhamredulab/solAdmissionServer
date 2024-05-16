/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import qs, { ParsedUrlQuery } from 'querystring';
import { decryptHash } from '../utils/ccav';
import UserServices from '../services/UserServices';
import OrderServices from '../services/OrderServices';
import TransactionServices from '../services/TransactionServices';
import Transaction from '../entity/Transaction';
import KeycloakApi from '../utils/keycloak';
import RoleServices from '../services/RoleServices';
import { IkeycloakRole } from '../types/user';
import User from '../entity/User';
import logger from '../utils/winston';
import selfPDF from '../utils/invoiceTemplate';
import EmailTemplates from '../services/EmailTemplates';
import * as fs from 'fs/promises';
import { ActivityServices } from '../services/ActivityService';
import { sendEmailWithTextAndAttachment, sendSecondSms, sendSms } from '../utils/emails';
import Fs from 'fs';
const clienturl = process.env.CLIENT_URL;
// const paymentGatewayMode = 'live';//'live'; // live OR test
//   //Live payment gateway
// const merchantId = process.env.merchant_id as string;
const workingKey = process.env.workingKey as string;

export default class PaymentController {

    // public static paymentSuccess = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         let ccavEncResponse = '';
    //         let ccavResponse = '';
    //         let ccavPost: ParsedUrlQuery = {};
    //         let totalAmount;
    //         const outercounter = 0;
    //         let filePath = '';
    //         const currentPath = process.cwd();
    //         const bodyJson = JSON.parse(JSON.stringify(req.body));
    //         let data = '';
    //         let i = 0;
    //         for (const attr in bodyJson) {
    //             if (i) { data = data + '&'; } i = 1;
    //             data = data + attr + '=' + encodeURIComponent(bodyJson[attr]);
    //         }
    //         ccavEncResponse += data;
    //         ccavPost = qs.parse(ccavEncResponse);
    //         const encryption = ccavPost['encResp'] as string;
    //         ccavResponse = decryptHash(encryption, workingKey);
    //         const obj = qs.parse(ccavResponse);

    //         if (obj.order_status == 'Success') {
    //             totalAmount = obj.mer_amount;
    //             // start new code
    //             const transaction = await TransactionServices.saveTransactionData({
    //                 orderId: obj.order_id as string, // here in obj.order_id we have serialNo
    //                 trackingId: obj.tracking_id as string,
    //                 bankRefNo: obj.bank_ref_no as string,
    //                 orderStatus: obj.order_status as string,
    //                 paymentMode: obj.payment_mode as string,
    //                 currency: obj.currency as string,
    //                 amount: obj.amount as string,
    //                 billingName: obj.billing_name as string,
    //                 billingTel: obj.billing_tel as string,
    //                 billingEmail: obj.billing_email as string,
    //                 merchantParam1: obj.merchant_param1 as string,
    //                 merchantParam2: obj.merchant_param2 as string,
    //                 merchantParam3: obj.merchant_param3 as string,
    //                 merchantParam4: obj.merchant_param4 as string,
    //                 merchantParam5: obj.merchant_param5 as string
    //             } as Transaction);
    //             if (transaction) {
    //                 await OrderServices.updateStatus(transaction.orderId, 1);
    //                 const pin = await PinGenerate.generatePin();
    //                 // registration no??
    //                 const user = await UserServices.register({ nameAsOnMarksheet: transaction.merchantParam1, email: transaction.merchantParam2, mobileno: transaction.merchantParam3, admissionType: transaction.merchantParam4, serialNo: transaction.orderId, pinPurchase: pin } as unknown as User);
    //                 if (user) {
    //                     // User registration successful
    //                     const formattedActivity = `Registration of ${user.admissionType} student ${user.nameAsOnMarksheet}(${user.email})`;
    //                     const activityData = {
    //                         userId: user.id,
    //                         name: `${user.nameAsOnMarksheet}(${user.email})`,
    //                         activity: formattedActivity
    //                     };

    //                     // Save activity to activity_tracking table
    //                     await ActivityServices.saveActivity(activityData);

    //                     const data1 = JSON.stringify({
    //                         enabled: true,
    //                         firstName: '',
    //                         lastName: '',
    //                         email: user.email,
    //                         username: user.email,
    //                         credentials: [
    //                             {
    //                                 type: 'password',
    //                                 value: '123456',
    //                                 temporary: true
    //                             }
    //                         ],
    //                         attributes: {
    //                             AddUserId: user.id
    //                         }
    //                     });
    //                     let token: any = '';
    //                     const response = await KeycloakApi.getToken1();
    //                     if (response.status === 200) {
    //                         token = await response.json();
    //                     }
    //                     // To save user in keycloak
    //                     const keycloakUser = await KeycloakApi.register(data1, `Bearer ${token.access_token}`);
    //                     if (keycloakUser.status === 201) {
    //                         //To get user details from keycloak by email
    //                         const keycloakUserData = await KeycloakApi.getUserByEmail(user.email, `Bearer ${token.access_token}`);
    //                         const keycloakId = keycloakUserData[0].id;
    //                         await UserServices.updateKeycloakId(user.id, keycloakId);
    //                         const roleData = await RoleServices.getRoleByRoleName('STUDENT');
    //                         if (!roleData) return res.status(400).json({ status: 400, error: 'Role Not Found' });
    //                         if (roleData.roleId === null) {
    //                             // Fetch the Role ID from the keycloak
    //                             try {

    //                                 const keycloakRoles = await KeycloakApi.getKeycloakRole(`Bearer ${token.access_token}`);
    //                                 const keycloakRoleData = keycloakRoles
    //                                     .filter((currentRole: IkeycloakRole) => currentRole.name === roleData.roleName);
    //                                 roleData.roleId = keycloakRoleData[0].id;
    //                                 await RoleServices.updateRoleId(roleData);

    //                             } catch (e) {
    //                                 return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
    //                             }

    //                         }
    //                         filePath = currentPath + "/src/public/upload/Pdf/" + 'testing file.pdf';
    //                         const fileData = await fs.readFile(filePath);
    //                         const fileDetails = [{
    //                             "filename": 'testing file.pdf',
    //                             "path": filePath
    //                         }];
    //                         const textData = {
    //                             receiverName: transaction.merchantParam1,
    //                             SerialNo: transaction.orderId,
    //                             PINNo: pin,
    //                             receiverEmail: user.email,
    //                             password: '123456',
    //                             subjectEmail: `Your Registration Details for ${user.admissionType} `,
    //                             senderEmail: process.env.senderEmail,
    //                             cc : String(process.env.cc),
    //                             bcc: String(process.env.bcc)
    //                         };
    //                         const emailData = EmailTemplates.sendEmailTextWithAttachment(
    //                             textData.receiverName,
    //                             textData.SerialNo,
    //                             textData.PINNo
    //                             // textData.receiverEmail,
    //                             // textData.password
    //                         );
    //                         const mailData = {
    //                             "data": emailData,
    //                             "file": fileDetails,
    //                             "details": textData
    //                         };
    //                         const SMSData: {
    //                             to: number;
    //                             serialNo: number;
    //                             pinno: string;
    //                         } = {
    //                             to: Number(transaction.merchantParam3),
    //                             serialNo: Number(transaction.orderId),
    //                             pinno: String(pin)
    //                         };
    //                         const userNumber=Number(transaction.merchantParam3);
    //                         const roleDataOfUser = [{ id: roleData.roleId, name: roleData.roleName }];
    //                         await KeycloakApi.assignRole(roleDataOfUser, keycloakId, `Bearer ${token.access_token}`);
    //                         // redirect url
    //                         res.redirect(clienturl + "/payment-success?order_id=" + obj.order_id);
    //                         await sendEmailWithTextAndAttachment(mailData, fileData);
    //                         await sendSms(SMSData);
    //                         await sendSecondSms(userNumber);
    //                         res.send({ status: 400, message: 'samething wrong to send the email' });
    //                     } else {
    //                         //Email to us
    //                     }

    //                 }
    //             }
    //         } else if (obj.order_status == 'Failure' || obj.order_status == 'Timeout' || obj.order_status == 'Aborted' || obj.order_status == 'Invalid') {

    //             const orderId = obj.order_id as string;
    //             await OrderServices.updateStatus(orderId, -1);
    //             res.redirect(clienturl + "/payment-failure?order_id=" + obj.order_id);

    //         } else {

    //             res.redirect(clienturl + "/payment-failure?order_id='error'");

    //         }

    //     } catch (error) {
    //         next(error);
    //     }
    // };

    // public static paymentCancel = async (req: Request, res: Response, next: NextFunction) => {
    //     try {

    //         logger.info('POST - payment/cancel-redirect-url');
    //         res.redirect(clienturl + "/payment-cancel");
    //         res.status(200).json({ message: 'Payment Cancel' });
    //     } catch (error) {
    //         next(error);
    //     }
    // };

    public static getTransactionByOrderId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderId } = req.query;
            const transaction = await TransactionServices.getTransactionByOrderId(orderId as string);
            res.status(200).json({ transaction });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public static getPaymentReceipt = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderId } = req.query;
            const transaction = await TransactionServices.getTransactionByOrderId(orderId as string);
            selfPDF.receipt_pdf(transaction, function (err: any) {
                if (err) {
                    res.send({ status: 400, data: err });
                } else {
                    setTimeout(function () {
                        res.send({ status: 200, data: `${orderId}` + "_" + "AdmissionPaymentReceipt.pdf" });
                    }, 3000);
                }
            });

        } catch (error) {
            logger.error(error);
            next(error);
        }

    };

    public static downloadFiles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderData = await OrderServices.getOrderBySerialNo(req.query.orderId as string);
            const FILE_LOCATION = process.env.FILE_LOCATION;
            const doc = req.query.documentFile ? req.query.documentFile : '';
            const downloadData = FILE_LOCATION + `public/upload/userid/${orderData?.userId}/${doc}`;
            res.download(downloadData);

        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    
   /**
   * @author: Rutuja Patil
   * @description This route is used to download Recipt.
   * Router: /api/payment/downloadRecipt
   */
    // public static downloadRecipt = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const orderData = await OrderServices.getOrderData(req.user.id);
    //         const filePath = `${process.env.FILE_LOCATION }public/upload/userid/${req.user.id}/${orderData?.serialNo}_AdmissionPaymentReceipt.pdf`;
            
    //         // See if the file exists
    //         if (Fs.existsSync(filePath)) {
    //             res.status(200).json({ status: 200, data: {FileName : `${orderData?.serialNo}` + "_" + "AdmissionPaymentReceipt.pdf", orderId: orderData?.serialNo }});
    //           } else {
    //             const transaction = await TransactionServices.getTransactionByOrderId(orderData?.serialNo as string);
    //             selfPDF.receipt_pdf(transaction, function (err: any) {
    //                 if (err) {
    //                     res.send({ status: 400, data: err });
    //                 } else {
    //                     setTimeout(function () {
    //                         res.status(200).json({ status: 200, data: {FileName : `${orderData?.serialNo}` + "_" + "AdmissionPaymentReceipt.pdf", orderId: orderData?.serialNo }});
    //                     }, 3000);
    //                 }
    //             });
    //           }
    //     } catch (err) {
    //         logger.error(err);
    //         next(err);
    //     }
    // };
}