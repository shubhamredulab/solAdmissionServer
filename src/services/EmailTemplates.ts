import * as dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.BASE_URL || "";
const path =`${BASE_URL}api/uploads/InfoFiles/solapur-vidyapeeth-logo.jpg`;


class EmailTemplates {
/**
 * @author Moin
 * @description This function is used to create an email template as per user needs.
 */

    static sendEmailText(receiverName: any, SerialNo: any, PINNo: any, receiverEmail: any, password: any) {
        const emailContext = `<!DOCTYPE html>
<html>
<head>
    <title>Registration Email</title>
</head>
<body>
    <p>Dear Student,</p>
    <p>Welcome ${receiverName}, You have registered successfully. Your Serial No is ${SerialNo} and PIN No. is ${PINNo}. Edulab</p>
    <ul>
        <li>Email ID: ${receiverEmail}</li>
        <li>Password: ${password}</li>
    </ul>
    <p>Thanks</p>
    <p>Solapur University</p>
</body>
</html>
`;
        return emailContext;
    }
    /**
    * @author Moin
    * @description This function is used to create an email template with attachment as per user needs.
    */

    static sendEmailTextWithAttachment(receiverName: string, receiverEmail: string, password: string) {
        const EmailTextWithAttachment =
            `<!DOCTYPE html>
    <html>
    <head>
        <title>Registration Email</title>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
    
            .email-container {
                max-width: 600px;
                width: 100%;
                text-align: left;
                padding: 20px;
            }
    
            header {
                text-align: right;
                margin-bottom: 20px;
            }
    
            header img {
                height: 200px;
                width: 200px;
                margin-top: 20px; 
            }
            
            @media (max-width: 600px) {
                header {
                    text-align: left;
                }
    
                header img {
                    margin-top: 0; 
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header with Image -->
            <header>
                <img src="${path}" alt="Your Header Image">
            </header>
    
            <p>Dear ${receiverName},</p>
            <p>You have successfully registered for your admission process. <br>
            (तुम्ही तुमच्या प्रवेश प्रक्रियेसाठी यशस्वीपणे नोंदणी केली आहे.)</p>
            <p>Your registered email Id/User Name and default password are:<br>
            (तुमचा नोंदणीकृत ईमेल आयडी/वापरकर्ता नाव आणि डीफॉल्ट पासवर्ड आहे:)</p>
            <ul>
                <li><b>Email ID/User Name:</b> ${receiverEmail}</li>
                <li><b>Password:</b> ${password}</li>
            </ul>
            <p>After login, you are required to change the password from the already set default password <br>
            (लॉगिन केल्यानंतर, तुम्हाला आधीच सेट केलेल्या डीफॉल्ट पासवर्डमधून पासवर्ड बदलणे आवश्यक आहे)</p>
            <p><font color="red">When setting a new password, it must include at least one uppercase letter, one lowercase letter, one numeric value, and one special character. Additionally, the password should not be an email & should have a minimum length of 8 characters, and should not have been used recently.<br>
            (नवीन पासवर्ड सेट करताना, त्यात किमान एक अप्परकेस अक्षर, एक लोअरकेस अक्षर, एक अंकीय मूल्य आणि एक विशेष वर्ण समाविष्ट करणे आवश्यक आहे. याव्यतिरिक्त, पासवर्ड हा ईमेल नसावा आणि त्याची लांबी किमान 8 वर्ण असावी आणि तो अलीकडे वापरला गेला नसावा.)</font> </p>
            <p><b>An instructional manual is attached to this email to assist you in your admission process.<br>
            (तुमच्या प्रवेश प्रक्रियेत तुम्हाला मदत करण्यासाठी या ईमेलसोबत एक सूचना पुस्तिका जोडली आहे.)</b></p>
            <p>Instructional Manual <a href='#'target="_blank">Download Manual</a></p>
            <p>Process Video <a href='#' target="_blank">Watch Video</a></p>
            <p>Thanks & Regards,<br>Team Admissions<br>PAHSU, Solapur</p>
        </div>
    </body>
    </html>
    `;

        return EmailTextWithAttachment;
    }
    /**
   * @author Moin
   * @description This function is used to send a message on mobile.
   */

    static sendMessage(to: number) {

        const data = {
            to: to,
            msg: `Welcome Student, You have successfully registered. After login, you are required to change the password from the already set default password  . Edulab`
        };
        
        return data;
    }


    /*
Author: Tiffany Correia
Description: This template is used to shoot an email on saving Personal Details.
*/
    static sendingEmail(receiverName: any, nextRegNo: any, SerialNo: any, PINNo: any) {
        const emailContext = `<!DOCTYPE html>
        <html>
        <head>
            <title>Registration Email</title>
        </head>
        <body>
            <p>Dear ${receiverName},</p>
            <p>Your Registration No: ${nextRegNo}, Serial No: ${SerialNo}, PIN No: ${PINNo}.</p><br>
            <p>Thanks</p>
            <p>Solapur University</p>
        </body>
        </html>
        `;
        return emailContext;
    }

    /*
Author: Tiffany Correia
Description: This template is used to shoot a text message on saving Personal Details.
*/
    static sendText(to: number, SerialNo: number, nextRegNo: number, PINNo: string) {

        const data = {
            to: to,
            msg: `Welcome Student regno: ${nextRegNo}, You have registered successfully. sno: ${SerialNo}, pno: ${PINNo}. Edulab`
        };

        return data;
    }
    /**
     * @author Moin
     * @description This function is used to send a message on mobile for successful registration.
     */

    static sendSecondSMS(to: number) {
        const data = {
            to: to,
            msg:`Your Username and password has been sent to your email. kindly check your registered email id. edulab`

        };
        return data;
    }

        /**
    * @author Moin
    * @description This function is used to send the their login detail which is  user needs.
    */

        static sendEmailCreatedUser(receiverName: string, receiverEmail: string, password: string, mobile:number) {
            const EmailTextWithAttachment =
                `<!DOCTYPE html>
        <html>
        <head>
            <title> Welcome to PAHSU, Solapur</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
        
                .email-container {
                    max-width: 600px;
                    width: 100%;
                    text-align: left;
                    padding: 20px;
                }
        
                header {
                    text-align: right;
                    margin-bottom: 20px;
                }
        
                header img {
                    height: 200px;
                    width: 200px;
                    margin-top: 20px; 
                }
                
                @media (max-width: 600px) {
                    header {
                        text-align: left;
                    }
        
                    header img {
                        margin-top: 0; 
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header with Image -->
                <header>
                    <img src="${path}" alt="Your Header Image"><br>
                    <p><b>Welcome to PAHSU, Solapur</b></p>
                </header>
        
                <p>Respected Sir/Madam,</p>
                <p>A user has been created on the University Portal to receive & accept student applications. The details are as follows <br>
                (विद्यार्थी अर्ज प्राप्त करण्यासाठी आणि स्वीकारण्यासाठी युनिव्हर्सिटी पोर्टलवर एक वापरकर्ता तयार केला गेला आहे. तपशील खालीलप्रमाणे आहेत)</p>
           
                <ul>
                    <li><b>Email ID/ Username -</b> ${receiverEmail}</li>
                    <li><b>Mobile Number - </b> ${mobile}</li>
                    <li><b>Default Password - </b> ${password}</li>
                </ul>
                <p>Kindly note - Once you login with the default Password, You need to change the password.<br>
                (कृपया लक्षात ठेवा - एकदा तुम्ही डीफॉल्ट पासवर्डने लॉग इन केल्यानंतर, तुम्हाला पासवर्ड बदलणे आवश्यक आहे.)</p>
                <p><font color="red">When setting a new password, it must include at least one uppercase letter, one lowercase letter, one numeric value, and one special character. Additionally, the password should not be an email & should have a minimum length of 8 characters, and should not have been used recently.<br>
                (नवीन पासवर्ड सेट करताना, त्यात किमान एक अप्परकेस अक्षर, एक लोअरकेस अक्षर, एक अंकीय मूल्य आणि एक विशेष वर्ण समाविष्ट करणे आवश्यक आहे. याव्यतिरिक्त, पासवर्ड हा ईमेल नसावा आणि त्याची लांबी किमान 8 वर्ण असावी आणि तो अलीकडे वापरला गेला नसावा.)</font> </p>
                <p>Thanks & Regards,<br>PAHSU, Solapur</p>
            </div>
        </body>
        </html>
        `;
    
            return EmailTextWithAttachment;
        }

        static sendEmail(receiverName:any){
            const emailContent =`<!DOCTYPE html>
            <html>
            <head>
                <title>Admission Form Submitted</title>
            </head>
            <body>
                <p>Dear ${receiverName},</p>
                <p>Your application is successfully submitted. 
                You can add or view your preference and you can download your registration form from the dashboard. Edulab</p><br>
                <p>Thanks</p>
                <p>Solapur University</p>
            </body>
            </html>
            `;
            return emailContent;
        }
    
        static sendingMsg(to:number) {
            const data = {
                to:to,
                msg:`Your application is successfully submitted.You can add or view your preference and you can download your registration form from the dashboard. Edulab.`
            };
            return data;
        }

    /**
     * @author: Priyanka Vishwakarma
     * @description: Email Template to send OTP on email
     * @param emailData 
     * @param otp 
     */
    static sendingOTPOnEmail = (otp: number) => {

        const emailContext = `<!DOCTYPE html>
        <html>
        <head>
            <title>Email Veridication</title>
        </head>
        <body>
          <p>${otp} is your one time password for verifying your mobile number for HSNC University</p>
        </body>
        </html>
        `;

        return emailContext;
    };

    /**
     * @author: Priyanka Vishwakarma
     * @description: To send OTP on msg
     * @param data 
     * @param otp 
     */
    static sendingOTPOnMsg = (data: { to: number }, otp: number) => {
        const msgData = {
            to: data.to,
            msg: `${otp} is your one time password for verifying your mobile number for PAHSU, Solapur University. For unsubscibe Text JEQPFSTOP to 919220592205 EDULAB`
        };
        return msgData;
    };
    
}

export default EmailTemplates;
