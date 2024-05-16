import Joi from 'joi';

export const SubjectSchema = Joi.object({
    subject_name_admission: Joi.string().trim().required().messages({
        'any.required': 'Subject name is required.'
    })
});

export const SubjectIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required" :"Id is required."
    })
});