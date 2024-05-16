import Joi from 'joi';

/*
Author: Moin
Description: this function use check page Id  is exist or not
*/
export const pageId = Joi.object({
    page: Joi.string().required().messages({
        'any.required': 'page is required',
        'number.id': 'Invalid id'
    })
});
/*
Author: Moin
Description: this function use check page and value  is exist or not
*/
export const searchData = Joi.object({
    page: Joi.string().required().messages({
        'any.required': 'page is required',
        'number.id': 'Invalid id'
    }),
    value: Joi.string().required().allow('').messages({
        'any.required': 'value is required',
        'value.id': 'Invalid id'
    })
});

/*
Author: Moin
Description: this function use check  year and page  is exist or not
*/
export const YearWiseActivity = Joi.object({
    year: Joi.string().required().messages({
        'any.required': 'year is required',
        'number.id': 'Invalid id'
    }),
    page: Joi.number().required().messages({
        'any.required': 'page is required',
        'number.id': 'Invalid id'
    })
});

/*
Author: Moin
Description: this function use check  year,page and value  is exist or not
*/
export const searchYearWiseData = Joi.object({
    year: Joi.number().required().messages({
        'any.required': 'year is required',
        'number.id': 'Invalid id'
    }),
    page: Joi.string().required().messages({
        'any.required': 'page is required',
        'number.id': 'Invalid id'
    }),
    value: Joi.string().required().allow('').messages({
        'any.required': 'value is required',
        'value.id': 'Invalid id'
    })
});