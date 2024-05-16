import Joi from 'joi';
import { IRoles } from '../types/user';

const registerUserSchema = Joi.object({
  firstname: Joi.string().required().messages({
    'any.required': 'First name is required'
  }),
  lastname: Joi.string().required().messages({
    'any.required': 'Last name is required'
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email'
  }),
  password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[@|&|_]{1,1})(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9@&_]+$/)
    .messages({
      'string.pattern.base': 'fails to match the required pattern',
      'any.required': 'Password is required'
    })
});

export const loginUserSchema = Joi.object({
  email: Joi.string().required().messages({
    'any.required': 'Username is required'
  }),
  password: Joi.required().messages({
    'any.required': 'Password is required'
  })
});

export const passwordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email'
  }),
  password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[@|&|_]{1,1})(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9@&_]+$/)
    .messages({
      'string.pattern.base': 'fails to match the required pattern',
      'any.required': 'Password is required'
    })
});

export const assignRoleSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email'
  }),
  role: Joi.string().required().valid(...Object.values(IRoles)).messages({
    'any.required': 'Role is required'
  })
});

export const gmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email'
  })
});

export const roleSchema = Joi.object({
  name: Joi.string().required().valid(...Object.values(IRoles)).messages({
    'any.required': 'name is required'
  }),
  description: Joi.string().required().messages({
    'any.required': 'description is required'
  })
});
export default registerUserSchema;
