import Joi from 'joi';

export const FacultySchema = Joi.object({
    faculty_code_admission: Joi.string().trim().optional().allow(null),
    faculty_name_admission: Joi.string().trim().required().messages({
        'any.required': 'Faculty name is required.'
    })
});

export const FacultyIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required" :"Id is required."
    })
});