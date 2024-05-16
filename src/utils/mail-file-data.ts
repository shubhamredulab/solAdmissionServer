import * as fs from 'fs/promises';
import EmailTemplates from '../services/EmailTemplates';
import { IRegister } from '../controllers/Auth';

const mfData = async (user: IRegister) => {
    const currentPath = process.cwd();

    const filePath = currentPath + "/src/public/upload/Pdf/" + 'testing_file.pdf';
    const fileData = await fs.readFile(filePath);
    const fileDetails = [{
        "filename": 'testing_file.pdf',
        "path": filePath
    }];


    const textData = {
        receiverName: user.nameAsOnMarksheet,
        receiverEmail: user.email,
        password: 'Test@123',
        subjectEmail: `Your Registration Details for ${user.admissionType} `,
        senderEmail: process.env.senderEmail,
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

    return { fileData, mailData };
};

export default mfData;