import Joi from 'joi';

export const SubjectPhdSchema = Joi.object({
    subject_phd_name_admission: Joi.string().trim().required().messages({
        'any.required': 'PHD Subject name is required.'
    }),
    subject_phd_code_admission: Joi.string().trim().required().messages({
        'any.required': 'PHD Subject Code is required.'
    })
});

export const SubjectPhdIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required" :"Id is required."
    })
});