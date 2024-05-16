import Joi from 'joi';
import { CourseType, Degree, subjectType } from '../types/user';

export const CourseSchema = Joi.object({
    course_code_admission: Joi.number().allow(null).required().messages({
        'any.required':'Course code is required.'
    }),
    course_name_admission: Joi.string().trim().required().messages({
        'any.required': 'Course name is required.'
    }),
    course_type_admission: Joi.string().valid(...Object.values(CourseType)),
    degree: Joi.string().valid(...Object.values(Degree)),
    subjectType: Joi.string().valid(...Object.values(subjectType)),
    eligibilityCourseName: Joi.string().optional().allow(''),
    eligibilityDescription: Joi.string().optional().allow('')
});

export const CourseIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required':'Id is required.'
    })
});

export const DegreeName = Joi.object({
    selectedValue: Joi.string().required().messages({
        'any.required':'degreeName is required.'
    })
});

export const checkCollegeId = Joi.object({
    collegeId: Joi.number().required().messages({
        'number.required':'collegeId is required.'
    })
});

