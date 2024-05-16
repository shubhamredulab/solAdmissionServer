import Joi from 'joi';

export const FacultySubjectSchema = Joi.object({
    faculty_phd_id_admission: Joi.number().required().messages({
        'any.required': 'PHD Faculty name is required.'
    }),
    subject_phd_id_admission: Joi.number().required().messages({ 
        'any.required': 'PHD Course is required.'
    })
});

export const FacultySubjectIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required" :"Id is required."
    })
});