import Joi from 'joi';

export const DepartmentSchema = Joi.object({
    department_code_admission: Joi.string().trim().optional().allow(null),
    department_name_admission: Joi.string().trim().required().messages({
        'any.required': 'Department name is required.'
    })
});

export const DepartmentIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required" :"Id is required."
    })
});