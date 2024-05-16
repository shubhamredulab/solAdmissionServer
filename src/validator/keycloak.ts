import Joi from 'joi';
import { IRoles } from '../types/user';

/*
    Check if email is of proper email format,
    and password is present
    Later add pattern for password, while adding password pattern here
    make sure you add it in keycloak
*/
export const keycloakUserLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email/Username is required',
    'string.email': 'Invalid Email'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

/*
    username which can be of type of email or string is required
    password is required
*/
export const keycloakAdminLoginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'username is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

/*
    For registering a user in the keycloak
    nameAsOnMarksheet of type string is required
    email is required with proper pattern of email
    mobileno of type string is required
    role is optional but if passed it is required of type IRoles
*/
export const keycloakRegisterSchema = Joi.object({
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
  role: Joi.string().valid(...Object.values(IRoles))
});

/*
    This code exports a Joi schema object named `keycloakCreateRoleSchema`
    which defines the validation rules for creating a new role in a Keycloak
    server.
*/
export const keycloakCreateRoleSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'name is required'
  }),
  description: Joi.string().required().messages({
    'any.required': 'description is required'
  })
});

/*
    This code exports a Joi schema object named `keycloakAssginClientRollToUserSchema`
    which defines the validation rules for assigning a client role to a user in a Keycloak server.
*/
export const keycloakAssignClientRollToUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email id is required'
  }),
  name: Joi.string().allow('').allow(null).messages({
    any: 'name must be string'
  })
});
