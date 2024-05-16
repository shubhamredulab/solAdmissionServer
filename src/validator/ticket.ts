import Joi from 'joi';

// Define custom error messages
const customMessages = {
    'string.base': 'Invalid data',
    'object.base': 'Invalid file data',
    'string.empty': 'This field should not be empty',
    'string.required': 'This string is required',
    'number.base': 'Invalid size',
    'binary.required': 'This binary is required'
};
/*
Author: Moin
Description: this function use for get only required file is exist or not
*/
export const FileData = Joi.object({
    file: Joi.object({
        fieldname: Joi.string()
            .required()
            .messages(customMessages),
        encoding: Joi.string()
            .required()
            .messages(customMessages),

        mimetype: Joi.string()
            .required()
            .messages(customMessages),

        size: Joi.number()
            .required()
            .messages(customMessages),
        originalname: Joi.number()
            .required()
            .messages(customMessages),
        path: Joi.number()
            .required()
            .messages(customMessages),
        filename: Joi.number()
            .required()
            .messages(customMessages)
    })
});
/*
Author: Moin.
Description: this function use for ignore the not required file data 
*/
export const validationOptions = {
    stripUnknown: true
};

/*
Author: Moin.
Description: this function use for get only required data in raiseTicketSchema
*/
export const raiseTicketSchema = Joi.object({
    registrationNo: Joi.number().required().messages({
        'number.required': 'registrationNo is required.'
    }),
    email: Joi.string().email().required().messages({
        'string.required': 'email is required.'
    }),
    Grievance: Joi.string().required().messages({
        'string.required': 'Grievance is required.'
    }),
    Category: Joi.string().required().messages({
        'string.required': 'Category is required.'
    }),
    collegeName: Joi.string().required().messages({
        'string.required': 'collegeName is required.'
    }),
    courseName: Joi.string().required().messages({
        'string.required': 'courseName is required.'
    })

});
/*
Author: Moin.
Description: this function use for get only required data in checkPage
*/
export const checkPage = Joi.object({
    page: Joi.number().required().messages({
        'number.required': 'page is required.'
    })

});
/*
 Author: Moin.
 Description: this function use for get only required data in addTicketComment
 */
export const checkAddTicketComment = Joi.object({
    TicketUserId: Joi.number().required().messages({
        'number.required': 'TicketUserId is required.'
    }),
    TicketId: Joi.number().required().messages({
        'number.required': 'TicketId is required.'
    }),
    comment: Joi.string().required().messages({
        'string.required': 'comment is required.'
    })

});

/*
Author: Moin.
Description: this function use for get only required data with ticketId
*/
export const checkTicketId = Joi.object({

    ticketId: Joi.string().required().messages({
        'number.required': 'ticketId is required.'
    })

});
/*
  Author: Moin.
  Description: this function use for get only required data with SearchTicketData
  */
export const checkSearchTicketData = Joi.object({
    values: Joi.string().allow('').messages({
        'string.required': 'values is required.'
    }),
    page: Joi.number().required().messages({
        'number.required': 'page is required.'
    })

});
/*
  Author: Moin.
  Description: this function use for get only required data with checkDeleteTicketCommentId
  */
export const checkDeleteTicketCommentId = Joi.object({
    id: Joi.number().required().messages({
        'number.required': 'id is required.'
    })

});

/*
Author: Moin.
Description: this function use for get only required data in check Year Page
*/
export const checkYearPage = Joi.object({
    year: Joi.number().required().messages({
        'number.required': 'year is required.'
    }),
    page: Joi.number().required().messages({
        'number.required': 'page is required.'
    })

});