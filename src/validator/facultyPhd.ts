import Joi from 'joi';

export const FacultyPhdSchema = Joi.object({
    faculty_phd_name_admission: Joi.string().trim().required().messages({
        'any.required': 'Faculty PDH name is required.'
    }),
    faculty_phd_code_admission: Joi.string().trim().required().messages({
        'any.required':'Faculty PHD code is required.'
    })
});

export const FacultyPhdIDSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required" :"Id is required."
    })
}); 