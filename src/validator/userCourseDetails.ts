import Joi from 'joi';
import { applicationStatus, universityStatus } from '../types/user';

export const AddCommentAndStatusSchema = Joi.object({
    appId: Joi.number().required().messages({
        'any.required': 'AppId is required'
    }),
    college_comments: Joi.string().required().messages({
        'any.required': 'college_comments is required'
    }),
    college_application_status: Joi.string().valid(...Object.values(applicationStatus)),
    academic_year_admission: Joi.string().required().messages({
        'any.required': 'academic_year_admission is required'
    }),
    admissionYear: Joi.number().required().messages({
        'any.required': 'Admission Year is required'
    })
});

export const AddCommentAndStatusForUniSchema = Joi.object({
    appId: Joi.number().required().messages({
        'any.required': 'AppId is required'
    }),
    university_comments: Joi.string().required().messages({
        'any.required': 'university_comments is required'
    }),
    university_application_status: Joi.string().valid(...Object.values(universityStatus))
});

export const validationOptions = {
    stripUnknown: true
};