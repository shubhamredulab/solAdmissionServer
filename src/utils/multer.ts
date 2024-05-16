import multer from 'multer';
import * as fs from 'fs';
import path from 'path';



const FILE_LOCATION = process.env.FILE_LOCATION || "";

// Use an empty string as a default if the env variable is not defined
const uploadFiles = multer.diskStorage({
  destination: (req, res, cb) => {
    const { userId } = req.body;
    const uploadDir = path.join(FILE_LOCATION + 'public/upload/userid/'+ `${userId}`);
    
    if (!fs.existsSync(uploadDir)) {
      // Create the parent directory if it doesn't exist
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  }
});
const profileFiles = multer.diskStorage({
  destination: (req, res, cb) => {
    const { userId } = req.body;
    const uploadDir = path.join(FILE_LOCATION+ 'public/upload/userid/'+ `${userId}`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  }
});

const uploadExtraFile = multer.diskStorage({
  destination: (req, res, cb) => {
    const uploadDir = path.join(FILE_LOCATION, 'public/upload/userid', `${req.body.userId}`);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  }
});


export const extraDocFile = (fieldName: string) => {
  return multer({
    storage: uploadExtraFile,
    fileFilter: (req, file, cb) => {
      cb(null, true);
    }
  }).single(fieldName);
};

export const fileUploads = (fieldName: string) => {
  return multer({
    storage: uploadFiles,
    fileFilter: (req, file, cb) => { 
      cb(null, true);
    }
    
  }).single(fieldName);  
};

const collegeStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    const { id } = req.query;
    
    const uploadDir = path.join(FILE_LOCATION, `public/upload/collegeLogo/${id}/`);
    
    if (!fs.existsSync(uploadDir)) {
      // Create the parent directory if it doesn't exist
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  }
});
const exceluploads = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(FILE_LOCATION, 'public/upload/excels/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '.xlsx'); // Keep the original file name
  }
});

const saveUploadsExcel = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(FILE_LOCATION, 'public/upload/excels/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '.xlsx'); // Keep the original file name
  }
});
const PDFuploads = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(FILE_LOCATION, 'public/upload/Pdf/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  }
});
const ticketUploads = multer.diskStorage({
  destination: (req, res, cb) => {
    const uploadDir = path.join(FILE_LOCATION, `public/upload/ticket/${req.user.id}/`);
    if (!fs.existsSync(uploadDir)) {
      // Create the parent directory if it doesn't exist
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  }
});
export const collegeLogo = (fieldName:string) => {  
  return multer({
    storage: collegeStorage,
    fileFilter: (req, file, cb) => {
      if(!['image/png',
			'image/jpeg',
			'image/jpg',
			'image/webp'].includes(file.mimetype)){
				return cb(new Error('file is not allowed'));
			}
			cb(null, true);
    }
  }).single(fieldName);
}; 

/*
Author: Moin.
Description: this function use for Uploads profile picture
*/
export const profilUploads = (fieldName: string) => {
  return multer({
    storage: profileFiles,
    fileFilter: (req, file, cb) => {
      cb(null, true);
    }
  }).single(fieldName);

};
/*
Author: Moin.
Description: this function use for Uploads excel file in the backend folder
*/
export const uploadExcel = multer({
  storage: exceluploads,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
}).single('file');

/*
Author: Priya Sawant.
Description: this function use for Uploads excel file in the backend folder
*/

export const saveExcels = multer({
  storage: saveUploadsExcel,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
}).single('file');
/*
Author: Moin.
Description: this function use for Uploads Pdf file in the backend folder
*/
export const uploadPDF = multer({
  storage: PDFuploads,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
}).single('file');


export const raiseTicketFile = (fieldName: string) => {
  return multer({
    storage: ticketUploads,
    fileFilter: (req, file, cb) => {
      cb(null, true);
    }
  }).single(fieldName);

};














