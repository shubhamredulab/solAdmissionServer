import Joi from 'joi';
import { IRoles } from '../types/user';

/*
    For Allowaccess to the user 
    id of type string is required
    data is required 
  
*/
/*
Author: Moin
Description: this function use check required data is exist or not for provide the access
*/
export const allowAccess = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'id is required',
    'number.id': 'Invalid id'
  }),
  data: Joi.array().required().messages({
    'any.required': 'data is required',
    'array.data': 'Invalid data'
  }),

  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email'
  }),
  role: Joi.string().valid(...Object.values(IRoles))

});
/*
Author: Moin
Description: this function use check required data is exist or not for get the access 
*/
export const getAccess = Joi.object({
  role: Joi.string().valid(...Object.values(IRoles)),
  userId: Joi.string().required().messages({
    'string.required': 'id is required',
    'string.id': 'Invalid id'
  }),
  page: Joi.number().required().messages({
    'any.required': 'page is required',
    'number.id': 'Invalid id'
  })
});
/*
Author: Moin
Description: this function use to provide the Degree type   
*/
export const degreeStatus = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'id is required',
    'number.id': 'Invalid id'
  }),
  changeDegree: Joi.array().required().messages({
    'any.required': 'changeDegree is required',
    'array.data': 'Invalid changeDegree'
  })
  ,
  adminRole:Joi.string().required().messages({
    'any.required': 'adminRole is required',
    'array.data': 'Invalid adminRole'
  }),
  adminEmail:Joi.string().required().messages({
    'any.required': 'adminEmail is required',
    'array.data': 'Invalid adminEmail'
  })
});

/*
Author: Moin
Description: this function use check required data is exist or not  in data base
*/
export const columnAccess = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'id is required',
    'number.id': 'Invalid id'
  }),
  data: Joi.array().required().messages({
    'any.required': 'data is required',
    'array.data': 'Invalid data'
  }),
  role: Joi.string().allow('').messages({
    'any.required': 'role is required',
    'string.id': 'Invalid role'
  }),
  email: Joi.string().allow('').messages({
    'any.required': 'email is required',
    'string.id': 'Invalid role'
  })
});
/*
Author: Moin
Description: this function use to provide the Degree type   
*/
export const saveCollegeAndCourse = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'id is required',
    'number.id': 'Invalid id'
  }),
  courseData: Joi.array().required().messages({
    'any.required': 'courseData is required',
    'array.data': 'Invalid courseData'
  })
  ,
  role:Joi.string().required().messages({
    'any.required': 'role is required',
    'array.data': 'Invalid role'
  }),
  email:Joi.string().required().messages({
    'any.required': 'email is required',
    'array.data': 'Invalid email'
  }),
  collegeId: Joi.array().required().messages({
    'any.required': 'collegeId is required',
    'array.data': 'Invalid collegeId'
  })
});
/*
Author: Moin
Description: this function check the UserId and courseId is exist or not to do the further performance in the route
*/
export const deleteCourse = Joi.object({
  userId: Joi.number().required().messages({
    'any.required': 'userId is required',
    'number.id': 'Invalid userId'
  }),
  courseId: Joi.number().required().messages({
    'any.required': 'courseId is required',
    'array.data': 'Invalid courseId'
  })

});
