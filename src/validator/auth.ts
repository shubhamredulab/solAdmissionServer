import Joi from 'joi';
import { IAdmissionType, IRoles } from '../types/user';

/*
    For registering a user in the keycloak and your system
    nameAsOnMarksheet of type string is required
    email is required with proper pattern of email
    mobileno of type string is required
    admissionType of type string is required
    role is optional but if passed it is required of type IRoles
*/
export const RegisterSchema = Joi.object({
  nameAsOnMarksheet: Joi.string().required().messages({
    'any.required': 'Name as on marksheet is required'
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email'
  }),
  mobileno: Joi.string().required().messages({
    'any.required': 'Mobile number is required'
  }),
  admissionType: Joi.string().required().messages({
    'any.required': 'Admission type is required' 
  }),
  agree: Joi.required().messages({
    'any.required': 'agreement required' 
  }),
  academicYear: Joi.number().required().messages({
    'any.required': 'academicYear number is required'
  }),
  role: Joi.string().valid(...Object.values(IRoles))
});

export const SubAdminRegisterSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required'
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email'
  }),
  mobileno: Joi.string().required().messages({
    'any.required': 'Mobile number is required'
  }),
  academicYear: Joi.number().required().messages({
    'any.required': 'academicYear number is required'
  }),
  role: Joi.string().valid(...Object.values(IRoles)),

  admissionType: Joi.string().allow('').valid(...Object.values(IAdmissionType)).messages({
    'any.required': 'admissionType string is required'
  })

});
export const pagination = Joi.object({
  pages: Joi.number().required().messages({
    'any.required': 'pages  is required'
  })

});
export const paginationWithValue = Joi.object({
  page: Joi.number().required().messages({
    'any.required': 'pages  is required'
  }),
  value: Joi.string().required().allow('').messages({
    'any.required': 'value  is required'
  })
});
export const changeAdminStatus = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'id  is required',
    'number.required': 'Invalid id '

  }),
  changeStatus: Joi.string().required().messages({
    'any.required': 'changeStatus is required',
    'string.required': 'Invalid changeStatus '

  })
});
export const saveDetails = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'id is required',
    'number.id': 'Invalid id'
  }),
  data: Joi.object().keys({
    firstName: Joi.string().required().messages({
      'any.required': 'First name is required',
      'string.empty': 'First name should not be empty'
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Last name is required',
      'string.empty': 'Last name should not be empty'
    }),
    mobileno: Joi.number().required().messages({
      'any.required': 'Mobile number is required',
      'number.empty': 'Mobile number should not be empty'
    })
  }).required().messages({
    'any.required': 'Data is required',
    'object.base': 'Invalid data format'
  })
});
export const checkeUserId = Joi.object({
  userId: Joi.number().required().messages({
    'any.required': 'id is required',
    'number.id': 'Invalid id'
  })
});

