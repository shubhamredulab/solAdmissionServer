import Joi from 'joi';

export const CollegeSchema = Joi.object({
    college_code_admission: Joi.string().trim().required().messages({
        'any.required':'College code is required'
    }),
    college_name_admission: Joi.string().trim().required().messages({
        'any.required': 'College name is required.'
    }),
    college_address_admission: Joi.string().trim().optional().allow(null),
    university_code_admission: Joi.number().required().messages({
        'any.required': 'University code is required.'
    }),
    college_type: Joi.string().trim().required().messages({
        'any.required':'College type is required.'
    }),
    city: Joi.string().trim().required().messages({
        'any.required':'City is required.'
    }),
    state: Joi.string().trim().required().messages({
        'any.required':'State is required.'
    }),
    collegeStatus: Joi.string().trim().required().messages({
        'any.required': 'College Status is required.'
    })
});

export const CollegeIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required" :"Id is required."
    })
});

export const CollegeIdFileNameSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required":"Id is required."
    }),
    filename: Joi.string().required().messages({
        "any.required":"Filename is required."
    })
});

export const CollegeId = Joi.object({
    collegeId: Joi.string().required().messages({
        "any.required":"collegeId is required."
    })
});

export const changeCollegeStatusSchema = Joi.object({
    collegeStatus: Joi.string().required().messages({
        'any.required':'collegeStatus is required.'
    }),
    collegeId: Joi.string().required().messages({
        'any.required':'collegeId is required.'
    })
});
