import Joi from 'joi';

export const SubjectGroupSchema = Joi.object({
    group_combination_admission: Joi.string().trim().required().messages({
        'any.required': 'Group combination required.'
    }),
    subject_ids_admission: Joi.array().items(Joi.number()),
    course_id_admission: Joi.number().required().messages({
        'any.required': 'Course is required.'
    }),
    medium: Joi.string().trim().required().messages({
        'any.required': 'Medium required.'
    })
});

export const SubjectGroupIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required':'Id is required.'
    })
});

export const CourseId = Joi.object({
    courseId : Joi.string().required().messages({
        "any.required":'Course Id is required.'
    })
});