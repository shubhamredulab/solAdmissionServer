import Joi from 'joi';

export const savePreference = Joi.object({
    collegeId:Joi.array().items(Joi.number()).required().messages({
        'any.required':'Preferences are required'
    }),
    value:Joi.bool().required().messages({
        'any.required':'value is required'
    }),
    collegeCourse:Joi.array().items(Joi.string()).required().messages({
        'any.required':'College and Course name  are required'
    })
    
});

export const getPreferencesData = Joi.object({
    userId: Joi.string().required().messages({
        "any.required":'user id is required'
    })
});