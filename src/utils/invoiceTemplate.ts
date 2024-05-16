
import fs from 'fs';
import PdfPrinter from 'pdfmake';
// import { Alignment, PageOrientation } from 'pdfmake/interfaces';
import OrderServices from '../services/OrderServices';
import { TDocumentDefinitions, PageOrientation, Alignment } from 'pdfmake/interfaces';
import moment from 'moment';
import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import logger from './winston';
export default class selfPDF {

    //PDF for payment receipt
    public static receipt_pdf = async (data: any, callback: any) => {
        const orderData = await OrderServices.getOrderBySerialNo(data.orderId as string);
        const FILE_LOCATION = process.env.FILE_LOCATION;
        const fileLocation = `${FILE_LOCATION}public/upload/userid/${orderData?.userId}/`;


        if (!fs.existsSync(fileLocation)) {
            fs.mkdirSync(fileLocation, { recursive: true });
        }

        const fonts = {
            Roboto: {
                normal: FILE_LOCATION + 'public/fonts/times new roman.ttf',
                bold: FILE_LOCATION + 'public/fonts/times new roman bold.ttf',
                italics: FILE_LOCATION + 'public/fonts/times new roman italic.ttf',
                bolditalics: FILE_LOCATION + 'public/fonts/times new roman bold italic.ttf'
            }
        };

        //Function to format date
        function formatDate(date: any) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        const filename = data.orderId + "_" + "AdmissionPaymentReceipt";
        const logo = FILE_LOCATION + 'public/images/HSNCULogo.png';

        //PDF content

        const docDefinition = {
            pageOrientation: 'landscape' as PageOrientation,

            content: [
                {
                    style: {
                        fontSize: 12,
                        bold: false
                    },
                    table: {
                        widths: [150, 200, 150],
                        headerRows: 1,
                        body: [
                            ['', { image: logo, fit: [60, 60], alignment: 'center' }, ''],
                            ['', { text: 'HSNC UNIVERSITY', fontSize: 12, bold: true, alignment: 'center' }, ''],
                            ['', { text: 'Online Admission Form Payment Receipt', fontSize: 9, bold: true, alignment: 'center' }, '']
                        ]
                    },
                    layout: 'noBorders'
                },

                [{ text: '\n' }, ' '],

                {
                    style: {
                        fontSize: 12,
                        bold: false
                    },
                    table: {
                        widths: [200, 300],
                        headerRows: 1,
                        body: [
                            [{ text: 'Name', fontSize: 12, bold: true }, ' ' + data.merchantParam1],
                            [{ text: 'Email Id', fontSize: 12, bold: true }, ' ' + data.merchantParam2],
                            [{ text: 'Admission Type', fontSize: 12, bold: true }, {
                                text: data.merchantParam4 === 'UG'
                                    ? 'UG (Under Graduate/Bachelors)'
                                    : data.merchantParam4 === 'PG'
                                        ? 'PG (Post Graduate/Masters)'
                                        : data.merchantParam4 // Default to the original value if not UG or PG
                            }],
                            [{ text: 'Transaction Id', fontSize: 12, bold: true }, ' ' + data.trackingId],
                            [{ text: 'Payment Serial No', fontSize: 12, bold: true }, ' ' + data.orderId],
                            [{ text: 'Payment Date & Time', fontSize: 12, bold: true }, ' ' + formatDate(data.createdAt)],
                            [{ text: 'Year of Admission', fontSize: 12, bold: true }, ' ' + '2024'],
                            [{ text: 'Payment Amount', fontSize: 12, bold: true }, ' INR ' + data.amount],
                            [{ text: 'Status of payment', fontSize: 12, bold: true }, ' ' + 'SUCCESSFUL']
                        ]
                    }
                },

                [{ text: '\n' }, ' '],
                { text: 'Notes:-', fontSize: 12, bold: true },
                {
                    ul: [
                        'Please note this serial number, it is required for any inquiry related to payment.',
                        'Admission form fee is not refundable.'
                    ],
                    fontSize: 12,
                    bold: false
                }
            ],

            defaultStyle: {
                alignment: 'justify' as Alignment,
                fontSize: 12
            }
        };


        const printer = new PdfPrinter(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(fileLocation + '/' + filename + '.pdf'));
        pdfDoc.end();
        callback();
    };
    /**
   * @author Moin
   * @description This function use to generate the admission pfd.
   */
    public static AdmissionForm = async (userId: number, personalData: any, educationData: any, documentData: any, collegeName: string, courseName: string, admission_form_no: number, firstName: string, PGDetails: any, callback: any) => {
        try {

            const FILE_LOCATION = process.env.FILE_LOCATION;
            let signatureLink;
            let proFileLink;
            const fileLocation = `${FILE_LOCATION}public/upload/userid/${userId}/admissionForm`;
            if (!fs.existsSync(fileLocation)) {
                fs.mkdirSync(fileLocation, { recursive: true });
            }
            // this barcoder create the automatic on application number
            const canvasWidth = 120; // Replace with your desired width
            const canvasHeight = 50; // Replace with your desired height
            const canvas = createCanvas(canvasWidth, canvasHeight);
            JsBarcode(canvas, String(admission_form_no), { format: 'CODE128' });
            const barcodeImage = canvas.toDataURL('image/png');
            // this for semester Data array logic
            const SemesterArray = [];
            const semesterData = [
                {
                    sem: 'SEM I',
                    courseName: 'BCA',
                    array: [{ name1: 'BSCIT005-PAPER I', name2: 'BSCIT005-PAPER II', name3: 'BSCIT005-PAPER III', name4: 'BSCIT005-PAPER IV' }]
                },
                {
                    sem: 'SEM II',
                    courseName: 'BCA',
                    array: [{ name1: 'BSCIT005-PAPER V', name2: 'BSCIT005-PAPER VI', name3: 'BSCIT005-PAPER VII', name4: 'BSCIT005-PAPER VII' }]
                }
            ];
            for (const data of semesterData) {
                const semesterHeader = [
                    { text: data.sem, fontSize: 10, bold: true, colSpan: 2, border: [1, 1, 1, 0] }, {}
                ];
                SemesterArray.push(semesterHeader);

                for (const test of data.array) {
                    const semesterValue = [
                        { text: test.name1, fontSize: 9, bold: false, alignment: 'center', border: [1, 1, 0, 0] },
                        { text: test.name2, fontSize: 9, bold: false, alignment: 'center', border: [0, 1, 1, 0] }
                    ];
                    SemesterArray.push(semesterValue);

                    if (test.name3 || test.name4) {
                        const remainingData = [
                            { text: test.name3 || '', fontSize: 9, bold: false, alignment: 'center', border: [1, 0, 0, 1] },
                            { text: test.name4 || '', fontSize: 9, bold: false, alignment: 'center', border: [0, 0, 1, 1] }
                        ];
                        SemesterArray.push(remainingData);
                    }
                }
            }
            // Educational details table header
            const docTableHeader = [
                { text: 'Sr.No', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'Name Of Document / Certificate', fontSize: 9, bold: true, alignment: 'center', colSpan: 2 },
                { text: '', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'Original / Attested Copy', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'Attached (Yes/No)', fontSize: 9, bold: true, alignment: 'center' }


            ];
            const docDetailsArray: any[] = [];
            let docDetailsRow: any[] = [];
            // const rowIndex = 1;
            documentData.forEach((data: { documentType: any; }, index: number) => {
                const rowIndex = index + 1; // Incrementing index starting from 1
                docDetailsRow = [
                    { text: rowIndex.toString(), fontSize: 9, bold: true, alignment: 'center' },
                    { text: data.documentType || '', fontSize: 9, bold: true, alignment: 'center', colSpan: 2 },
                    { text: '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: (data.documentType + ' Copy') || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: '', fontSize: 9, bold: true, alignment: 'center' }
                ];

                const sanitizedRows = docDetailsRow.map(cell => (cell.text === '' ? {} : cell));
                docDetailsArray.push(sanitizedRows);
            });


            // Educational details table header
            const tableHeader = [
                { text: 'Name of Examination', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'Name of Board/University and State of University', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'Name of School/College', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'Month and Year of Passing', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'Exam Seat No.', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'Certificate No.', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'Mark Obtained', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'Out of', fontSize: 9, bold: true, alignment: 'center' },
                { text: 'CGPA', fontSize: 9, bold: true, alignment: 'center' },
                { text: '%', fontSize: 9, bold: true, alignment: 'center' }
            ];
            const educationalDetailsArray = [];
            let educationalDetailsRow = [];
            if (educationData.admissionType == 'PG') {
                educationalDetailsRow = [
                    { text: `Std 12th`, fontSize: 9, bold: true, alignment: 'left' },
                    { text: educationData.hscBoardName || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscCollegeName || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscPassingMonth || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscSeatNo || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.achievements || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscMarksObtained || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscOutOf || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.CGPA || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscPercentage || '', fontSize: 9, bold: true, alignment: 'center' }
                ];
                const sanitizedRow = educationalDetailsRow.map(cell => (cell.text === '' ? {} : cell));
                educationalDetailsArray.push(sanitizedRow);
                educationalDetailsRow = [
                    { text: `Std UG`, fontSize: 9, bold: true, alignment: 'left' },
                    { text: '-' || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.ugCollegename || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.ugPassingMonth || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.ugSeatNo || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: '-' || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.ugMarksObtained || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.ugOutof || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: '-' || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.ugPercentage || '', fontSize: 9, bold: true, alignment: 'center' }
                ];
                const sanitizedRowData = educationalDetailsRow.map(cell => (cell.text === '' ? {} : cell));
                educationalDetailsArray.push(sanitizedRowData);
                for (const PGDetailsItem of PGDetails) {
                    const educationalDetailsRow = [
                        { text: `Std PG`, fontSize: 9, bold: true, alignment: 'left' },
                        { text: '-' || '', fontSize: 9, bold: true, alignment: 'center' },
                        { text: PGDetailsItem.pgCollegename || '', fontSize: 9, bold: true, alignment: 'center' },
                        { text: PGDetailsItem.pgPassingMonth || '', fontSize: 9, bold: true, alignment: 'center' },
                        { text: PGDetailsItem.pgSeatNo || '', fontSize: 9, bold: true, alignment: 'center' },
                        { text: '-' || '', fontSize: 9, bold: true, alignment: 'center' },
                        { text: '-' || '', fontSize: 9, bold: true, alignment: 'center' },
                        { text: '-' || '', fontSize: 9, bold: true, alignment: 'center' },
                        { text: '-' || '', fontSize: 9, bold: true, alignment: 'center' },
                        { text: PGDetailsItem.pgPercentage || '', fontSize: 9, bold: true, alignment: 'center' }
                    ];
                    const sanitizedRowData = educationalDetailsRow.map(cell => (cell.text === '' ? {} : cell));
                    educationalDetailsArray.push(sanitizedRowData);
                }
            } else {

                educationalDetailsRow = [
                    { text: `Std 10th`, fontSize: 9, bold: true, alignment: 'left' },
                    { text: educationData.sscBoard || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.sscCollegeName || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.sscPassingMonth || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.sscSeatNo || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.achievements || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.sscObtainedMarks || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.sscOutOf || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.CGPA || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.sscPercentage || '', fontSize: 9, bold: true, alignment: 'center' }
                ];
                const sanitizedRowFirst = educationalDetailsRow.map(cell => (cell.text === '' ? {} : cell));
                educationalDetailsArray.push(sanitizedRowFirst);
                educationalDetailsRow = [
                    { text: `Std 12th`, fontSize: 9, bold: true, alignment: 'left' },
                    { text: educationData.hscBoardName || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscCollegeName || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscPassingMonth || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscSeatNo || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.achievements || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscMarksObtained || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscOutOf || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.CGPA || '', fontSize: 9, bold: true, alignment: 'center' },
                    { text: educationData.hscPercentage || '', fontSize: 9, bold: true, alignment: 'center' }
                ];
                const sanitizedRow = educationalDetailsRow.map(cell => (cell.text === '' ? {} : cell));
                educationalDetailsArray.push(sanitizedRow);
            }

            // Get the Profile Pic and signature of student
            for (let i = 0; i < documentData.length; i++) {
                if (documentData[i].documentType == 'Photo') {
                    const proFilePic = documentData[i].fileName;
                    proFileLink = FILE_LOCATION + `public/upload/userid/${userId}/${proFilePic}`;

                }
                if (documentData[i].documentType == 'Sign') {
                    const signaturePic = documentData[i].fileName;
                    signatureLink = FILE_LOCATION + `public/upload/userid/${userId}/${signaturePic}`;

                }

            }
            const ProFiePic = proFileLink;
            const SignaturePic = signatureLink;
            // add the logo of university
            const logo = FILE_LOCATION + 'public/upload/collegeLogo/solapur-vidyapeeth-logo.png';

            const fonts = {
                Roboto: {
                    normal: FILE_LOCATION + 'public/upload/fonts/times new roman.ttf',
                    bold: FILE_LOCATION + 'public/upload/fonts/times new roman bold.ttf',
                    italics: FILE_LOCATION + 'public/upload/fonts/times new roman italic.ttf',
                    bolditalics: FILE_LOCATION + 'public/upload/fonts/times new roman bold italic.ttf'
                }
            };
            const docDefinition: TDocumentDefinitions = {
                pageOrientation: 'portrait' as PageOrientation,
                pageSize: 'A4',
                content: [
                    {
                        margin: [-15, 0, 0, 0],
                        style: {
                            fontSize: 12,
                            bold: false
                        },

                        table: {
                            widths: [80, 350, 90],

                            body: [
                                [
                                    { image: logo, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                                    { text: `${collegeName}(${courseName})`, fontSize: 9, bold: true, alignment: 'center', border: [1, 1, 1, 0] },
                                    { text: `Application No: ${admission_form_no}\n Regular`, fontSize: 9, bold: true, alignment: 'center', lineHeight: 1 }

                                ],

                                ['', { text: 'Application Form', border: [0, 0, 0, 1], alignment: 'center', fontSize: 14, bold: true }, { image: barcodeImage, height: 25, width: 65, fontSize: 9, bold: true, alignment: 'center' }]

                            ]
                        }

                    },
                    { text: '', margin: [0, 2] },

                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [130, 80, 80, 80, 130],
                            headerRows: 1,
                            body: [
                                [
                                    {
                                        text: [
                                            { text: 'Course Applied For : ', alignment: 'left', bold: true, fontSize: 9 },
                                            { text: `${courseName ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }]
                                        , colSpan: 2
                                    }, {

                                    }, {
                                        text: [
                                            { text: 'ABC ID : ', alignment: 'left', bold: true, fontSize: 9 },
                                            { text: `${personalData.abcId ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }], colSpan: 2
                                    }, {},
                                    {
                                        text: [
                                            { text: 'PRN : ', bold: true, fontSize: 9 },
                                            { text: `${personalData.registrationNo ?? ''}`, fontSize: 9, bold: false, alignment: 'left', lineHeight: 1 }
                                        ]
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            { text: 'Application Date : ', bold: true, fontSize: 9, alignment: 'left' },
                                            { text: `${moment(personalData.createdAt).format('DD-MM-YYYY')}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], colSpan: 4
                                    }, {},
                                    {
                                    }, {},
                                    {
                                        stack: [
                                            { image: ProFiePic, fit: [50, 50], alignment: 'center', margin: [0, 5] }, // Replace 'ProFiePic' with your first image
                                            { image: SignaturePic, fit: [50, 50], alignment: 'center' } // Replace 'SignaturePic' with your second image
                                        ],
                                        fontSize: 9,
                                        bold: true,
                                        alignment: 'center',
                                        lineHeight: 1,
                                        border: [1, 0, 1, 1],
                                        rowSpan: 6
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Did You Enrol Your Name In Electoral Voter List:  ", bold: true, fontSize: 9 },
                                            { text: ` ${personalData.voterName ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 4
                                    }, {}, {}, {}, {}

                                ],
                                [
                                    { text: " Personal Information ", alignment: 'center', bold: 0.1, fontSize: 9 },
                                    { text: " Last Name ", alignment: 'center', bold: 0.1, fontSize: 9 },
                                    { text: " First Name ", alignment: 'center', bold: 0.1, fontSize: 9 },
                                    { text: " Middle Name ", alignment: 'center', bold: 0.1, fontSize: 9 }, { text: " Personal Information ", alignment: 'left', bold: 0.1, fontSize: 9 }
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Name Of Student", bold: true, fontSize: 9 }
                                        ], alignment: 'center', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: ` ${personalData.lastName ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    }, {
                                        text: [
                                            { text: ` ${personalData.firstName ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    }, {
                                        text: [
                                            { text: ` ${personalData.middleName ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    }, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Student Name In Devnagri", bold: true, fontSize: 9 }

                                        ], alignment: 'center', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: ` ${''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    }, {
                                        text: [
                                            { text: ` ${''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    }, {
                                        text: [
                                            { text: ` ${''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    }, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Father's/Husband's Name : ", bold: true, fontSize: 9 }
                                        ], alignment: 'center', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: ` ${personalData.lastName ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    }, {
                                        text: [
                                            { text: ` ${personalData.fatherName ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    }, {
                                        text: [
                                            { text: `${''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    }, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Mother Name : ", bold: true, fontSize: 9 }
                                        ], alignment: 'center', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: ` ${personalData.motherName ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 4
                                    }, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Marital Status : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.maritalStatus ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 2
                                    },
                                    {},
                                    {
                                        text: [
                                            { text: "Mother Tongue : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.motherTongue ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], fontSize: 9, bold: true, alignment: 'left', colSpan: 2
                                    }, {
                                        text: 'res', fontSize: 9, alignment: 'center'
                                    }, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Place of Birth : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.placeOfBirth ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "Gender : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.gender ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], fontSize: 9, alignment: 'left'
                                    },
                                    {
                                        text: [
                                            { text: "Date of Birth (DD/MM/YYYY) :  ", bold: true, fontSize: 9 },
                                            { text: `${moment(personalData.dob).format('DD-MM-YYYY') ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], fontSize: 9, alignment: 'left', colSpan: 3
                                    }, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Blood Group :  ", bold: true, fontSize: 9 },
                                            { text: `${personalData.bloodGroup ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "Religion : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.religion ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], fontSize: 9, alignment: 'left', colSpan: 2
                                    }, {},
                                    {
                                        text: [
                                            { text: "Country of Citizenship  : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.citizenShip ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], fontSize: 9, alignment: 'left', colSpan: 2
                                    }, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Is Student NRI/Foreign National : ", bold: true, fontSize: 9 },
                                            { text: `Yes / NO`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 3
                                    },
                                    {}, {},
                                    {
                                        text: [
                                            { text: "Domicile State : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.domicileState ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], fontSize: 9, alignment: 'left', colSpan: 2
                                    }, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Address For Correspondence :  ", bold: true, fontSize: 9 },
                                            { text: `${personalData.corAddress ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', colSpan: 5
                                    },
                                    {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "State : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.corState ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "District : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.corDistrict}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "Tehsil : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.corTaluka}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "City/Town/Village:\n     ", bold: true, fontSize: 9 },
                                            { text: `${personalData.corCity ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "Location Area  : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.corLocationArea}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Pin Code : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.corPincode ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 5
                                    },
                                    {}, {}, {},
                                    {

                                    }
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Permanent address :  ", bold: true, fontSize: 9 },
                                            { text: `${personalData.preAddress ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', colSpan: 5
                                    },
                                    {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "State : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.preState ?? ''}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "District : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.preDistrict}`, fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "Tehsil : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.preTaluka}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "City/Town/Village:\n     ", bold: true, fontSize: 9 },
                                            { text: `${personalData.preCity ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "Location Area  : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.preLocationArea}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Pin Code : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.prePincode ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 5
                                    },
                                    {}, {}, {},
                                    {

                                    }
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Contact Details  ", bold: true, fontSize: 9 },
                                            { text: ``, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 5
                                    },
                                    {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Aadhar Card No : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.aadharCardno ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 3
                                    },
                                    {}, {},
                                    {
                                        text: [
                                            { text: "Parent No : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.guardianMobileno ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 2
                                    }, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Mobile Number : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.mobileno ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 3
                                    },
                                    {}, {},
                                    {
                                        text: [
                                            { text: "Email ID : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.email ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 2
                                    }, {}
                                ],
                                [
                                    { text: " Legal Reservation Information : ", alignment: 'left', bold: 0.1, fontSize: 9, colSpan: 5 },
                                    {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Category Type : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.admissionCategory ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 3
                                    },
                                    {}, {},
                                    {
                                        text: [
                                            { text: "Category : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.category ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 2
                                    }, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Is Specially A Bled ? : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.speciallyAbled}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ],
                                        alignment: 'left', fontSize: 9, colSpan: 5
                                    },
                                    {}, {

                                    },
                                    {}, {}
                                ],
                                // [
                                //     { text: "3. Social Information (Additional Information) : ", alignment: 'left', bold: 0.1, fontSize: 9, colSpan: 5 },
                                //     {}, {}, {}, {}
                                // ],
                                // [
                                //     {
                                //         text: [
                                //             { text: "Economically Backward Class ", bold: true, fontSize: 9 },
                                //             { text: '', fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                //         ], alignment: 'left', fontSize: 9, colSpan: 5
                                //     },
                                //     {}, {}, {}, {}
                                // ],
                                [
                                    {
                                        text: [
                                            { text: `Social Reservation Information Section (Check mark Whichever is applicable.write name of supporting document attached in section )  `, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 5
                                    },
                                    {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: `Ex Servicemen Ward Of Ex Servicemen `, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    },
                                    {}, {
                                        text: [
                                            { text: `Active Servicemen Of Active Service Men `, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9, colSpan: 2
                                    }, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: `Freedom Fighter Ward Of Freedom Fighter`, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    },
                                    {}, {
                                        text: [
                                            { text: `Ward Of Primary Teacher `, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9, colSpan: 2
                                    }, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: `Ward Of Secondary Teacher `, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    },
                                    {}, {
                                        text: [
                                            { text: `Deserted / Divorced / Widowed women `, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9, colSpan: 2
                                    }, {}, {}

                                ],
                                [
                                    {
                                        text: [
                                            { text: `Member Of Project Affected Family `, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    },
                                    {}, {
                                        text: [
                                            { text: `Member Of Earthquake Affected Family `, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9, colSpan: 2
                                    }, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: `Member Of Flood/Famine Affected Family`, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    },
                                    {}, {
                                        text: [
                                            { text: `Resident Of Tribal Area `, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9, colSpan: 2
                                    }, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: `Kashmir Migrant`, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9
                                    },
                                    {}, {
                                        text: [
                                            { text: ` `, bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'center', lineHeight: 1 }
                                        ], alignment: 'center', fontSize: 9, colSpan: 2
                                    }, {}, {}
                                ],
                                [
                                    { text: "Paper Selected for : ", alignment: 'left', bold: 0.1, fontSize: 9, colSpan: 5 },
                                    {}, {}, {}, {}
                                ]

                            ]

                        }
                    },
                    { text: '', margin: [0, 2] },
                    //Dynamic Semester table data
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [263, 263],
                            body: SemesterArray

                        }
                    },
                    { text: '', margin: [0, 2] },

                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [130, 80, 80, 80, 130],
                            headerRows: 1,
                            body: [
                                [
                                    {
                                        text: [
                                            { text: "Medium of Instruction : ", bold: true, fontSize: 9 },
                                            { text: ' English', fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], fontSize: 9, alignment: 'left', colSpan: 5
                                    },

                                    {}, {}, {}, {}
                                ],
                                [
                                    { text: '4. Guardian Information', fontSize: 9, bold: true, alignment: 'left', colSpan: 5 },

                                    {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Guardian Name : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.guardianName}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], fontSize: 9, bold: true, alignment: 'left', colSpan: 2
                                    },

                                    {}, {
                                        text: [
                                            { text: "Occupation of Guardian : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.guardianOccupation}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], fontSize: 9, bold: true, alignment: 'left'
                                    },
                                    {
                                        text: [
                                            { text: "Annual Income of Guardian : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.guardianAnnualIncome}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], fontSize: 9, alignment: 'left', colSpan: 2
                                    }, {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Relationship Of Guardian With Applicant  : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.relationWithGuardian}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], fontSize: 9, bold: true, alignment: 'left', colSpan: 3
                                    },

                                    {}, {

                                    },
                                    {
                                        text: [
                                            { text: "Phone No : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.guardianMobileno}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], fontSize: 9, bold: true, alignment: 'left', colSpan: 2
                                    }, {}
                                ]

                            ]

                        }
                    },
                    { text: '', margin: [0, 2] },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [130, 80, 80, 80, 130],
                            headerRows: 1,
                            body: [
                                [

                                    {
                                        text: [
                                            { text: "Attachment Documents And Certificates Section: ", bold: true, fontSize: 9 },
                                            { text: ``, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], fontSize: 9, bold: true, alignment: 'left', colSpan: 5
                                    }, {}, {}, {}, {}
                                ],

                                docTableHeader,
                                ...docDetailsArray


                            ]

                        }
                    },
                    { text: '', margin: [0, 2] },
                    {
                        margin: [-18, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [50, 90, 70, 50, 50, 50, 30, 20, 20, 30],
                            headerRows: 1,
                            body: [
                                [
                                    { text: '5. Educational Details', fontSize: 9, bold: true, alignment: 'left', colSpan: 10 },

                                    {}, {}, {}, {}, {}, {}, {}, {}, {}
                                ],


                                tableHeader,
                                ...educationalDetailsArray


                            ]
                        }
                    },
                    { text: '', margin: [0, 2] },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [130, 80, 80, 80, 130],
                            headerRows: 1,
                            body: [
                                [
                                    { text: "Other Information : ", alignment: 'left', colSpan: 5, bold: true, fontSize: 9 }, {}, {}, {},
                                    {}
                                ],
                                [
                                    {
                                        text: [
                                            { text: "Mother tongue : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.motherTongue ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], fontSize: 9, bold: true, alignment: 'left', colSpan: 2
                                    }, {}, {
                                        text: [
                                            { text: "Employment Status : ", bold: true, fontSize: 9 },
                                            { text: `${personalData.employeeStatus ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], fontSize: 9, bold: true, alignment: 'left', colSpan: 2
                                    }, {},
                                    {
                                        text: [
                                            { text: " Do You Wish To Join NSS : ", bold: true, fontSize: 9 },
                                            { text: `${' Yes / No'}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], fontSize: 9, bold: true, alignment: 'left'
                                    }
                                ],
                                [
                                    {
                                        text: `Hobbies,Proficiency And Other Interest:\n
                                    \n`, alignment: 'left', colSpan: 5, bold: true, fontSize: 9
                                    }, {}, {}, {},
                                    {}
                                ],
                                [
                                    {
                                        text: `Games and Sports participation:\n
                                    Level (e.g.College / State / National / International etc.)`, alignment: 'left', colSpan: 5, bold: true, fontSize: 9
                                    }, {}, {}, {},
                                    {}
                                ], [
                                    {
                                        text: `Personal Identification Marks:`, alignment: 'left', bold: true, fontSize: 9
                                    }, { text: `1`, alignment: 'left', colSpan: 2, bold: true, fontSize: 9 }, {}, { text: `2`, alignment: 'left', colSpan: 2, bold: true, fontSize: 9 },
                                    {}
                                ],

                                [
                                    {
                                        text: `Declaration By Student \n
                   I hereby declare that I have read the rules related to admission and the information filed in by me in this form is accurate and true to the best of my knowledge. I attend the lecture, tests regularly & punctually. I am aware that 80% attendance is obligatory. I will be responsible for any discrepancy, arising out of the form signed by me and i undertake that, in absence of any document the final admission will not be granted and/or admission will stand cancel I am aware of the Maharashtra Prohibition of Ragging Act,1999 and I state that I will abide by the rules and regulation of the said Act. \n 
                   Place : \n
                   Date :                                                                                                                                                                                        Signature of the student`, alignment: 'left', colSpan: 5, bold: true, fontSize: 9
                                    }, {}, {}, {}, {}
                                ],
                                [
                                    {
                                        text: `Declaration By Guardian \n
                   I have permitted my son/daughter/ward to join you college. The information supplied by him/her is correct to the best of my knowledge\n I have acquainted myself with the rules and fess. dues to my son/daughter/ward and to see that he/she observers.\n
                   Place : \n
                   Date :                                                                                                                                                                                        Signature of the Guardian`, alignment: 'left', colSpan: 5, bold: true, fontSize: 9
                                    }, {}, {}, {}, {}
                                ],
                                [
                                    { text: `For college/Institute/Study Center Use Only`, alignment: 'left', colSpan: 5, bold: 0.1, fontSize: 9 }, {}, {}, {},
                                    {}
                                ],
                                [
                                    { text: `Designation`, alignment: 'center', bold: true, fontSize: 9 },
                                    { text: `Remark / Particulars / Recommendations`, alignment: 'center', bold: true, fontSize: 9, colSpan: 3 }, {}, {},
                                    { text: `Signature and Date`, alignment: 'center', bold: true, fontSize: 9 }
                                ],
                                [
                                    { text: `Admission Clerk`, alignment: 'left', bold: 0.1, fontSize: 9 },
                                    { text: ``, alignment: 'left', fontSize: 10, colSpan: 3 }, {}, {},
                                    { text: ``, alignment: 'left', fontSize: 9 }
                                ],
                                [
                                    { text: `Admission Committee`, alignment: 'left', bold: 0.1, fontSize: 9 },
                                    { text: ``, alignment: 'left', fontSize: 10, colSpan: 3 }, {}, {},
                                    { text: ``, alignment: 'left', fontSize: 9 }
                                ],
                                [
                                    { text: `Accountant/Cashier`, alignment: 'left', bold: 0.1, fontSize: 9 },
                                    {
                                        text: [
                                            { text: "Cash Received :", bold: true, fontSize: 9 },
                                            { text: 'INR ', fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9, colSpan: 2
                                    }, {},
                                    {
                                        text: [
                                            { text: "Receipt No : ", bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    },
                                    {
                                        text: [
                                            { text: "Date : ", bold: true, fontSize: 9 },
                                            { text: '', fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }
                                        ], alignment: 'left', fontSize: 9
                                    }
                                ],
                                [
                                    { text: `Register/Office Superintendent`, alignment: 'left', bold: 0.1, fontSize: 9 },
                                    { text: ``, alignment: 'left', fontSize: 10, colSpan: 3 }, {}, {},
                                    { text: ``, alignment: 'left', fontSize: 10 }
                                ]

                            ]

                        }
                    }

                ],

                defaultStyle: {
                    alignment: 'justify' as Alignment,
                    fontSize: 12
                }
            };

            const printer = new PdfPrinter(fonts);
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.pipe(fs.createWriteStream(FILE_LOCATION + `public/upload/userid/${userId}/admissionForm/` + admission_form_no + `-` + firstName.trim() + '.pdf'));
            callback();
            return new Promise<void>((resolve, reject) => {
                pdfDoc.end();

                pdfDoc.on('end', () => {
                    resolve();
                });

                pdfDoc.on('error', (error) => {
                    reject(error);
                });
            });
        }
        catch (error) {
            logger.error;
            throw error;
        }
    };

    /**
    * @author Moin
    * @description This function use to generate the admission pfd.
    */
    public static PhdAdmissionForm = async (userId: number, personalData: any, educationData: any, documentData: any, entranceData: any, randomNumber: number) => {
        try {
            const FILE_LOCATION = process.env.FILE_LOCATION;
            let signatureLink;
            let proFileLink;
            const currentYear = new Date().getFullYear();
            const twoYearPeriod = `${currentYear - 1}-${currentYear}`;
            // this barcoder create the automatic on application number
            const canvasWidth = 120; // Replace with your desired width
            const canvasHeight = 50; // Replace with your desired height
            const canvas = createCanvas(canvasWidth, canvasHeight);
            JsBarcode(canvas, String(randomNumber), { format: 'CODE128' });
            const barcodeImage = canvas.toDataURL('image/png');

            // Get the Profile Pic and signature of student
            for (let i = 0; i < documentData.length; i++) {
                if (documentData[i].documentType == 'Photo') {
                    const proFilePic = documentData[i].fileName;
                    proFileLink = FILE_LOCATION + `public/upload/userid/${userId}/${proFilePic}`;

                }
                if (documentData[i].documentType == 'Sign') {
                    const signaturePic = documentData[i].fileName;
                    signatureLink = FILE_LOCATION + `public/upload/userid/${userId}/${signaturePic}`;

                }

            }
            const ProFiePic = proFileLink;
            const SignaturePic = signatureLink;


            // add the logo of university
            const logo = FILE_LOCATION + 'public/upload/collegeLogo/solapur-vidyapeeth-logo.png';

            const fonts = {
                Roboto: {
                    normal: FILE_LOCATION + 'public/upload/fonts/times new roman.ttf',
                    bold: FILE_LOCATION + 'public/upload/fonts/times new roman bold.ttf',
                    italics: FILE_LOCATION + 'public/upload/fonts/times new roman italic.ttf',
                    bolditalics: FILE_LOCATION + 'public/upload/fonts/times new roman bold italic.ttf'
                }
            };
            const docDefinition: TDocumentDefinitions = {
                pageOrientation: 'portrait' as PageOrientation,
                pageSize: 'A4',
                content: [
                    {
                        margin: [-15, 0, 0, 0],
                        style: {
                            fontSize: 12,
                            bold: false
                        },

                        table: {
                            widths: [80, 350, 90],

                            body: [
                                [
                                    { image: logo, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                                    {
                                        text: `Punyashlok Ahilyadevi Holkar
                            Solapur University\n Application form for Ph.D.Entrance Test(PET) for\nAdmission to Ph.D 2024-25`, fontSize: 14, bold: true, alignment: 'center', border: [1, 1, 1, 1], rowSpan: 2
                                    },
                                    { text: `Form No:PAHSU\n/${twoYearPeriod}/${randomNumber}`, fontSize: 10, bold: true, alignment: 'center' }
                                ],

                                [{},
                                {}, { image: barcodeImage, height: 50, width: 80, fontSize: 9, bold: true, alignment: 'center', border: [0, 0, 1, 1] }]

                            ]
                        }

                    },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [130, 80, 80, 82, 130],
                            headerRows: 1,
                            body: [
                                [
                                    {
                                        text: [
                                            { text: 'Registration Information', alignment: 'center', bold: true, fontSize: 14 }
                                        ]
                                        , colSpan: 5, border: [1, 0, 1, 0]
                                    }, {

                                    }, {}, {},
                                    {}
                                ]

                            ]

                        }
                    }
                    ,
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [200, 220, 100],
                            headerRows: 1,
                            body: [
                                [{ text: 'Full Name : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 1, 0, 0] },
                                { text: `${personalData.lastName ?? ''} ${personalData.firstName ?? ''} ${personalData.middleName ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 1, 0, 0] },
                                { image: ProFiePic, fit: [80, 80], rowSpan: 5, alignment: 'center', margin: [0, 5] }],
                                [{ text: 'E-Mail ID : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.email ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 0, 0] },
                                {}
                                ],
                                [{ text: 'Mobile NO : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.mobileno ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 0, 0] },
                                {}
                                ],
                                [{ text: 'WhatsApp No : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.mobileno ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 0, 0] },
                                {}
                                ],
                                [{ text: 'Gender : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.gender ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 0, 0] },
                                {}
                                ],
                                [{ text: 'Date of Birth : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${moment(personalData.dob).format('DD-MM-YYYY') ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 0, 0] },
                                { image: SignaturePic, fit: [50, 50], alignment: 'center', rowSpan:3 }
                                ],
                                [{ text: 'Category : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.category ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0] },
                                {}
                                ],
                                [{ text: 'Flat No./ Building Name : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.corFaltNo ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0] },
                                {}
                                ],
                                [{ text: 'Colony / Area / Locally : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.corArea ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}
                                ],
                                [{ text: 'LandMark : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.corLandmark ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}
                                ],
                                [{ text: 'City : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.preCity}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}
                                ],
                                [{ text: 'State : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.preState ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}
                                ], [{ text: 'Country : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.corCountry ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}
                                ],
                                [{ text: 'Pin code : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.prePincode ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}
                                ],
                                [{ text: 'Marital Status : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.maritalStatus ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}
                                ],
                                [{ text: 'Physically Challenged : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.speciallyAbled ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}
                                ],
                                [{ text: 'Type Of Disability : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.speciallyAbled ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}
                                ],
                                [{ text: 'Are you under non-creamy layer : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.nonCreamy ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}
                                ]

                            ]

                        }
                    },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [200, 49, 75, 108, 70],
                            headerRows: 1,
                            body: [
                                [{ text: 'Do you want to appear for PET : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.petExam ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan:4},
                                {}, {}, {}
                                ],
                                [{ text: 'Have you passed SET: ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.passedSetExam ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 0, 0]},
                                {
                                    text: `${personalData.passedSetExam === 'Yes' ? 'Score : ' + (entranceData.setEntranceDetails && entranceData.setEntranceDetails.length > 0 ? entranceData.setEntranceDetails[0]?.entranceScore : '') : ''}`, border: [0, 0, 0, 0] // Border only on the bottom side
                                  },
                                {text: `${personalData.passedSetExam === 'Yes' ? 'Month : ' + (entranceData.setEntranceDetails && entranceData.setEntranceDetails.length > 0 ? entranceData.setEntranceDetails[0]?.entranceMonth : ''): ' '}`, border: [0, 0, 0, 0] }, 
                                {text: `${personalData.passedSetExam === 'Yes' ? 'Year : ' + (entranceData.setEntranceDetails && entranceData.setEntranceDetails.length > 0 ? entranceData.setEntranceDetails[0]?.entranceYear : ''): ' '}`, border: [0, 0, 1, 0] }
                                ],

                                [{ text: 'Have you passed NET: ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.passedNetExam ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 0, 0]},
                                {text: `${personalData.passedNetExam === 'Yes' ? 'Score : ' + ( entranceData.netEntranceDetails && entranceData.netEntranceDetails.length > 0 ? entranceData.netEntranceDetails[0]?.entranceScore : '') :''}`, border: [0, 0, 0, 0] },
                                {text: `${personalData.passedNetExam === 'Yes' ? 'Month : ' + ( entranceData.netEntranceDetails && entranceData.netEntranceDetails.length > 0 ? entranceData.netEntranceDetails[0]?.entranceMonth : '') :''}`, border: [0, 0, 0, 0] },
                                {text: `${personalData.passedNetExam === 'Yes' ? 'Year : ' + ( entranceData.netEntranceDetails && entranceData.netEntranceDetails.length > 0 ? entranceData.netEntranceDetails[0]?.entranceYear : '') :''}`, border: [0, 0, 1, 0] }
                                ],
                                [{ text: 'Have you passed GATE: ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.passedGateExam ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 0, 0]},
                                {text: `${personalData.passedGateExam === 'Yes' ? 'Score : ' + ( entranceData.gateEntranceDetails && entranceData.gateEntranceDetails.length > 0 ? entranceData.gateEntranceDetails[0]?.entranceScore : '') :''}`, border: [0, 0, 0, 0] },
                                {text: `${personalData.passedGateExam === 'Yes' ? 'Month : ' + (entranceData.gateEntranceDetails && entranceData.gateEntranceDetails.length > 0 ? entranceData.gateEntranceDetails[0]?.entranceMonth : ''): ''}`, border: [0, 0, 0, 0] }, 
                                {text: `${personalData.passedGateExam === 'Yes' ? 'Year : ' + (entranceData.gateEntranceDetails && entranceData.gateEntranceDetails.length > 0 ? entranceData.gateEntranceDetails[0]?.entranceYear : ''):''}`, border: [0, 0, 1, 0] }
                                ],
                                [{ text: 'Have you passed M.PHIL: ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.passedMphilExam ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 0, 0]},
                                {text: `${personalData.passedMphilExam === 'Yes' ? 'Month : ' + (entranceData.mphilEntranceDetails && entranceData.mphilEntranceDetails.length > 0 ? entranceData.mphilEntranceDetails[0]?.entranceMonth : ''): ''}`, border: [0, 0, 0, 0] }, 
                                {text: `${personalData.passedMphilExam === 'Yes'? 'Year : ' + (entranceData.mphilEntranceDetails && entranceData.mphilEntranceDetails.length > 0 ? entranceData.mphilEntranceDetails[0]?.entranceYear : ''): ''}`, border: [0, 0, 1, 0], colSpan:2}, {}
                                ]
                            ]

                        }
                    },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [200, 40, 141, 130],
                            headerRows: 1,
                            body: [
                                [{ text: 'Have you Obtained,DST -INSPIRE FELLOWSHIP: ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.dstFellowship ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 0, 0]},
                                {
                                    text: `${personalData.dstFellowship === 'Yes' ? 'Granted Month : ' + (personalData?.fellowShipGrantedMonth ?? '') : ' '}`, border: [0, 0, 0, 0]
                                }, 
                                {
                                    text: `${personalData.dstFellowship === 'Yes' ? 'Granted Year  : ' + (personalData?.fellowShipGrantedYear ?? '') : ' '}`, border: [0, 0, 1, 0]
                                }
                                ],
                                [{ text: 'Are you applying under women Reservation category: ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.womenReservation ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan:3},
                                {}, {}
                                ],
                                [{ text: 'Home University / Other University: ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${personalData.whichUniversity ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan:3},
                                {}, {}
                                ]
                            ]

                        }
                    },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [130, 80, 80, 82, 130],
                            headerRows: 1,
                            body: [
                                [{
                                    text: 'Faculty and Subject Information', alignment: 'center', bold: true, fontSize: 14, colSpan: 5,
                                    border: [1, 1, 1, 1]
                                }, {}, {}, {}, {}
                                ],
                                [{ text: 'Faculty : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0], colSpan: 2 }, {},
                                { text: `${educationData.facultyName ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 3 }, {}, {}
                                ],
                                [{ text: 'Subject : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 1], colSpan: 2 }, {},
                                {
                                    text: `${educationData.subjectName + ',' ?? ''}`, alignment: 'left', bold: false, fontSize: 12,
                                    border: [0, 0, 1, 1], colSpan: 3
                                }, {}, {}
                                ]

                            ]

                        },
                        pageBreak: "after"
                    },
                    //      {
                    //         margin: [-15, 0, 0, 0],

                    //         style: {
                    //             fontSize: 12,
                    //             bold: false
                    //         },
                    //         table: {
                    //             widths: [200, 220, 100],
                    //             headerRows: 1,
                    //             body: [
                    //                 [{ text: 'Faculty : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 1] },
                    //                 { text: `${educationData.facultyName ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 1], colSpan:2 },
                    //                 { }
                    //                 ],
                    //                 [{ text: 'Subject : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 1, 0, 0] },
                    //                  { text: `${educationData.subjectName +','?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 1, 1, 0], colSpan:2 },
                    //                  { }
                    //                  ]


                    //             ]
                    //         },
                    //         pageBreak:"after"
                    // },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [130, 80, 80, 82, 130],
                            headerRows: 1,
                            body: [
                                [
                                    {
                                        text: [
                                            { text: 'Qualifying Examination Details', alignment: 'center', bold: true, fontSize: 14 }
                                        ]
                                        , colSpan: 5, border: [1, 1, 1, 0]
                                    }, {

                                    }, {}, {},
                                    {}
                                ]

                            ]

                        }
                    },

                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [200, 220, 100],
                            headerRows: 1,
                            body: [
                                [{ text: 'Qualification : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 1, 0, 0] },
                                { text: 'Under-Graduation', alignment: 'left', bold: false, fontSize: 12, border: [0, 1, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Degree : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.ugdegreename ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Specialization : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.ugSpecialization ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Board/University : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.ugUniversitynName ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Status : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.ugResultStatus ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Passing Month : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.ugPassingMonth ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Year Of Passing : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.ugPassingYear ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: educationData.ugResultStatus === 'Passed' ? (educationData.ugMarksObtained !== null ? 'UG Obtained Marks : ' : 'UG Grade : ') : '', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: educationData.ugResultStatus === 'Passed' ? (educationData.ugMarksObtained !== null ? `${educationData.ugMarksObtained ?? ''}` : `${educationData.ugGrade ?? ''}`) : '', alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text:educationData.ugResultStatus === 'Passed' ? ( educationData.ugOutOf !== null ? 'UG Total Marks : ' : 'Percentage : ') : '', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: educationData.ugResultStatus === 'Passed' ? (educationData.ugOutOf !== null ? `${educationData.ugOutOf ?? ''}` : `${educationData.ugPercentage}%`) : '', alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: educationData.ugResultStatus === 'Passed' ? (educationData.ugGrade === null ? 'Percentage : ' : '') : '', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: educationData.ugResultStatus === 'Passed' ? (educationData.ugGrade === null ? `${educationData.ugPercentage}%` : '') : '', alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}]



                            ]

                        }
                    },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [200, 220, 100],
                            headerRows: 1,
                            body: [
                                [{ text: 'Qualification : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 1, 0, 0] },
                                { text: 'Post-Graduation', alignment: 'left', bold: false, fontSize: 12, border: [0, 1, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Degree : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.pgdegreename ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Specialization : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.pgSpecialization ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Board/University : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.pgUniversitynName ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Status : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.pgResultStatus ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Passing Month : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.pgPassingMonth ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: 'Year Of Passing : ', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: `${educationData.pgPassingYear ?? ''}`, alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text: educationData.pgResultStatus === 'Passed' ? (educationData.pgMarksObtained !== null ? 'PG Obtained Marks : ' : 'PG Grade' ) : '', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text:  educationData.pgResultStatus === 'Passed' ?(educationData.pgMarksObtained !== null ? `${educationData.pgMarksObtained ?? ''}` : `${educationData.pgGrade ?? ''}`) : '', alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text:  educationData.pgResultStatus === 'Passed' ? (educationData.pgOutOf !== null ? 'PG Total Marks : ' : 'Percentage') : '', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text:  educationData.pgResultStatus === 'Passed' ? ( educationData.pgOutOf !== null ? `${educationData.pgOutOf ?? ''}` : `${educationData.pgPercentage}%`) : '', alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}],
                                [{ text:educationData.pgResultStatus === 'Passed' ? (educationData.pgGrade === null ? 'Percentage : ' : '') : '', alignment: 'left', bold: true, fontSize: 12, border: [1, 0, 0, 0] },
                                { text: educationData.pgResultStatus === 'Passed' ? (educationData.pgGrade === null ? `${educationData.pgPercentage}%` : '') : '', alignment: 'left', bold: false, fontSize: 12, border: [0, 0, 1, 0], colSpan: 2 },
                                {}]



                            ]

                        }
                    }
                    ,
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [130, 80, 80, 82, 130],
                            headerRows: 1,
                            body: [
                                [
                                    {
                                        text: [
                                            { text: 'Payment Details', alignment: 'center', bold: true, fontSize: 14 }
                                        ]
                                        , colSpan: 5, border: [1, 1, 1, 0]
                                    }, {

                                    }, {}, {},
                                    {}
                                ]

                            ]

                        }
                    },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [125, 125, 130, 130],
                            headerRows: 1,
                            body: [
                                [{
                                    text: [
                                        { text: 'Date : ', alignment: 'left', bold: true, fontSize: 12 },
                                        { text: `${'' ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }], colSpan: 2, border: [1, 1, 0, 0]
                                },
                                {},
                                {
                                    text: [
                                        { text: 'Payment Type : ', alignment: 'left', bold: true, fontSize: 12 },
                                        { text: `${'' ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }], colSpan: 2, border: [0, 1, 1, 0]
                                }, {}],
                                [{
                                    text: [
                                        { text: 'Amount : ', alignment: 'left', bold: true, fontSize: 12 },
                                        { text: `${'' ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }], colSpan: 2, border: [1, 0, 0, 1]
                                },
                                {},
                                {
                                    text: [
                                        { text: 'Transaction Number : ', alignment: 'left', bold: true, fontSize: 12 },
                                        { text: `${'' ?? ''}`, fontSize: 10, bold: false, alignment: 'left', lineHeight: 1 }], colSpan: 2, border: [0, 0, 1, 1]
                                }, {}]




                            ]

                        }
                    },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [130, 80, 80, 82, 130],
                            headerRows: 1,
                            body: [
                                [
                                    {
                                        text: [
                                            { text: 'DECLARATION', alignment: 'center', bold: true, fontSize: 14 }
                                        ]
                                        , colSpan: 5, border: [1, 0, 1, 0]
                                    }, {

                                    }, {}, {},
                                    {}
                                ]

                            ]

                        }
                    },
                    {
                        margin: [-15, 0, 0, 0],

                        style: {
                            fontSize: 12,
                            bold: false
                        },
                        table: {
                            widths: [538],
                            headerRows: 1,
                            body: [
                                [{ text: `1. I declare that all statements in this application are true,completed and correct to the best of my knowledge. I believe and in the event of any information being found false or incorrect or any ineligibility and effected before or after Ph.D.Entrance Test(PET),My candidature is liable to be cancelled and action may be initiated against me.\n \n 2. I fulfill all conditions of eligibility regarding educational qualification's etc. prescribed for the Test.\n\n`, bold: false, fontSize: 12, border: [1, 0, 1, 1] }
                                ]

                            ]

                        }
                    }

                ],

                defaultStyle: {
                    alignment: 'justify' as Alignment,
                    fontSize: 12
                }
            };

            const printer = new PdfPrinter(fonts);
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            return new Promise((resolve, reject) => {
                try {

                    const buffers: Buffer[] = [];
                    pdfDoc.on('data', (chunk) => buffers.push(chunk));
                    pdfDoc.on('end', () => resolve(Buffer.concat(buffers)));
                    pdfDoc.on('error', (error) => reject(error));

                    pdfDoc.end();
                } catch (error) {
                    reject(error);
                }
            });
        }
        catch (error) {
            logger.error(error);
            throw error;
        }
    };
}
