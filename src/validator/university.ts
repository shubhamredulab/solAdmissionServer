import Joi from 'joi';

export const UniversitySchema = Joi.object({
    university_code_admission: Joi.string().trim().required().messages({
        'any.required':'University code is required.'
    }),
    university_name_admission: Joi.string().trim().required().messages({
        'any.required': 'University name is required.'
    }),
    university_address_admission: Joi.string().trim().required().messages({
        "any.required": "University address is required."
    })
});

export const UniversityIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required" :"Id is required."
    })
});
