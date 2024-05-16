import Joi from 'joi';


/*
Author: Moin
Description: this function use check required data is exist or not for provide the series And Registration Range
*/

export const seriesAndRegistrationRange = Joi.object({
    SelectType: Joi.string().required().messages({
      'any.required': 'SelectType is required',
      'string.SelectType': 'Invalid SelectType'
    }),
    range: Joi.string().required().messages({
      'any.required': 'range is required',
      'string.range': 'Invalid range'
    }),
  
    admissionType: Joi.string().required().messages({
      'any.required': 'admissionType is required',
      'string.admissionType': 'Invalid admissionType'
    }),
    year: Joi.number().required().messages({
        'any.required': 'year is required',
        'number.year': 'Invalid year'
      }),
      rangeId: Joi.number().allow(null).required().messages({
        'any.required': 'rangeId is required',
        'number.rangeId': 'Invalid rangeId'
      })
  
  });

  export const checkPagination = Joi.object({
    page: Joi.number().required().messages({
      'any.required': 'page is required',
      'number.page': 'Invalid page'
    })

  });

  export const checkId = Joi.object({
    id: Joi.number().required().messages({
      'any.required': 'id is required',
      'number.id': 'Invalid id'
    })

  });