import Joi from 'joi';

export const uploadExtraDocSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required'
  }),
  documentType: Joi.string().required().messages({
    'any.required': 'Document Type is required'
  }),
  admissionType: Joi.string().required().messages({
    'any.required': 'Admission Type is required'
  })
});

export const deleteSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required'
  }),
  documentType: Joi.string().required().messages({
    'any.required': 'Document Type is required'
  })
});

export const getImageSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required'
  })
});

export const forErrata = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required'
  })
});

/*
    For change the user profile 
    id of type string is required
    file is required 
  
*/


// Define custom error messages
const customMessages = {
  'string.base': 'Invalid data',
  'object.base': 'Invalid file data',
  'string.empty': 'This field should not be empty',
  'string.required': 'This string is required',
  'number.base': 'Invalid size',
  'binary.required': 'This binary is required'
};
/*
Author: Moin
Description: this function use for get Files function to verify the data is valid or not
*/
export const getFiles = Joi.object({
  userId: Joi.number()
    .required()
    .messages(customMessages)


});
/*
Author: Moin
Description: this function use for get only required file is exist or not
*/
export const seeFiles = Joi.object({
  file: Joi.object({
    fieldname: Joi.string()
      .required()
      .messages(customMessages),
    encoding: Joi.string()
      .required()
      .messages(customMessages),

    mimetype: Joi.string()
      .required()
      .messages(customMessages),

    size: Joi.number()
      .required()
      .messages(customMessages),
    originalname: Joi.number()
      .required()
      .messages(customMessages),
    path: Joi.number()
      .required()
      .messages(customMessages),
    filename: Joi.number()
      .required()
      .messages(customMessages)
  })
});
/*
Author: Moin.
Description: this function use for ignore the not required file data 
*/
export const validationOptions = {
  stripUnknown: true
};
/*
Author: Moin.
Description: this function use check userId is exist or not 
*/
export const usersID = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'id is required',
    'number.id': 'Invalid id'
  })
});
/*
Author: Moin.
Description: this function use check required data is exist or not 
*/
export const deleteProfilePicdata = Joi.object({
  userId: Joi.number().required().messages({
    'any.required': 'id is required',
    'number.id': 'Invalid id'
  }),
  fileName: Joi.string().required().messages({
    'fileName.required': 'fileName is required',
    'string.fileName': 'Invalid fileName'
  })
});

export const deleteDocData = Joi.object({
  docId : Joi.string().required().messages({
    'any.required':'Document id is required'
  })
});

export const documentData = Joi.object({
  userId : Joi.string().required().messages({
    'any.required':'User Id is required'
  }),
  type : Joi.string().required().messages({
    'any.required':'Type is required'
  }),
  degreeType : Joi.string().required().messages({
    'any.required':'Degree Type is required'
  })
});

export const fileData = Joi.object({
  file: Joi.object({
    fieldname: Joi.string()
      .required()
      .messages(customMessages),
    encoding: Joi.string()
      .required()
      .messages(customMessages),

    mimetype: Joi.string()
      .required()
      .messages(customMessages),

    size: Joi.number()
      .required()
      .messages(customMessages),
    originalname: Joi.number()
      .required()
      .messages(customMessages),
    path: Joi.number()
      .required()
      .messages(customMessages),
    filename: Joi.number()
      .required()
      .messages(customMessages)
  })
});

