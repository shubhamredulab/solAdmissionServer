import Joi from 'joi';


const dataSchema = Joi.object().keys({
    CollegeCtrl: Joi.string().required(),
    CourseCtrl: Joi.string().required(),
    PercentageCtrl: Joi.string().required(),
    categoryCtr: Joi.string().required(),
    subjectGroupCtrl: Joi.array().optional(),
    meritListNo: Joi.string().required(),
    validDateTime: Joi.string().required()
});
/*
Author: Moin
Description: this function use for get Merit List required data is exist or not 
*/
export const getMeritList = Joi.object({
    page: Joi.number().required().messages({
        'any.required': 'page is required',
        'number.id': 'Invalid id'
    }),
    data: dataSchema.required().messages({
        'any.required': 'data is required',
        'array.data': 'Invalid data'
    }),
    groupId:Joi.array().items(Joi.number()).messages({
        'any.required': 'groupId is required',
        'string.email': 'Invalid groupId'
    }),
    courseName: Joi.string().required().messages({
        'any.required': 'courseName is required',
        'string.email': 'Invalid courseName'
    }),
    collegeName: Joi.string().required().messages({
        'any.required': 'courseName is required',
        'string.email': 'Invalid courseName'
    }),
    subjectType: Joi.string().required().messages({
        'any.required': 'subjectType is required',
        'string.email': 'Invalid courseName'
    })
});
/*
Author: Moin.
Description: this function use for search Merit List required data is exist or not 
*/
export const searchMeritList = Joi.object({
    page: Joi.number().required().messages({
        'any.required': 'page is required',
        'number.id': 'Invalid id'
    }),
    data: dataSchema.required().messages({
        'any.required': 'data is required',
        'array.data': 'Invalid data'
    }),
    groupId: Joi.array().items(Joi.number()).messages({
        'any.required': 'groupId is required',
        'string.email': 'Invalid groupId'
    }),
    values: Joi.string().required().allow('').messages({
        'any.required': 'values is required',
        'string.email': 'Invalid values'
    }),
    courseName: Joi.string().required().messages({
        'any.required': 'courseName is required',
        'string.email': 'Invalid courseName'
    }),
    collegeName: Joi.string().required().messages({
        'any.required': 'courseName is required',
        'string.email': 'Invalid courseName'
    }),
    subjectType: Joi.string().required().messages({
        'any.required': 'subjectType is required',
        'string.email': 'Invalid courseName'
    })
});
/*
Author: Moin.
Description: this function use for check save Merit List required data is  exist or not 
*/
export const saveMeritList = Joi.object({
    collegeId: Joi.number().required().messages({
        'any.required': 'collegeId is required',
        'number.id': 'Invalid collegeId'
    }),
    courseId: Joi.number().required().messages({
        'any.required': 'courseId is required',
        'array.data': 'Invalid courseId'
    }),
    groupId: Joi.array().items(Joi.number()).messages({
        'any.required': 'groupId is required',
        'string.email': 'Invalid groupId'
    }),
    CategoryName: Joi.string().required().messages({
        'any.required': 'CategoryName is required',
        'string.email': 'Invalid CategoryName'
    }),
    typeOfMeritList: Joi.string().required().messages({
        'any.required': 'typeOfMeritList is required',
        'string.email': 'Invalid typeOfMeritList'
    }),
    currentDate: Joi.string().required().messages({
        'any.required': 'currentDate is required',
        'string.email': 'Invalid currentDate'
    }),
    listOfMerit: Joi.array().required().messages({
        'any.required': 'listOfMerit is required',
        'string.email': 'Invalid listOfMerit'
    }),
    excelFileName: Joi.string().required().messages({
        'any.required':' ExcelFileName is required'
    }),
    validDateTime: Joi.string().required().messages({
        'any.required': 'ValidDateTime is required'
    })
});
/*
Author: Moin.
Description: this function use for check page Id exist or not 
*/
export const pageId = Joi.object({
    page: Joi.number().required().messages({
        'any.required': 'page is required',
        'number.id': 'Invalid id'
    })
});
/*
Author: Moin
Description: this function use for check required data is exist or not in revoke function
*/
export const Revoke = Joi.object({
    typeOfMeritList: Joi.string().required().messages({
        'any.required': 'typeOfMeritList is required',
        'number.id': 'Invalid revoke'
    }),
    collegeId: Joi.number().required().messages({
        'any.required': 'collegeId is required',
        'number.id': 'Invalid id'
    }),
    courseId: Joi.number().required().messages({
        'any.required': 'courseId is required',
        'number.id': 'Invalid id'
    }),
    groupId: Joi.number().required().messages({
        'any.required': 'groupId is required',
        'number.id': 'Invalid id'
    }),
    revoke: Joi.string().required().messages({
        'any.required': 'revoke is required',
        'number.id': 'Invalid revoke'
    })
});

export const saveAssignCollegeData = Joi.object({
    data: Joi.object({
        collegeId: Joi.number().required().messages({
            'any.required': 'collegeId is required'
        }),
        courseId: Joi.number().required().messages({
            'any.required': 'courseId is required'
        }),
        email: Joi.string().required().messages({
            'any.required': 'email is required'
        }),
        registrationNo: Joi.string().required().messages({
            'any.required': 'registrationNo is required'
        }),
        categoryName: Joi.string().required().messages({
            'any.required': 'CategoryName is required'
        }),
        percentage: Joi.string().required().messages({
            'any.required': 'percentage is required'
        }),
        mobileno: Joi.string().required().messages({
            'any.required': 'mobileno is required'
        }),
        meritType: Joi.string().required().messages({
            'any.required': 'listOfMerit is required'
        }),
        date: Joi.string().required().messages({
            'any.required': 'date is required'
        }),
        Name: Joi.string().required().messages({
            'any.required': 'Name is required'
        }),
        groupId: Joi.alternatives().try(
            Joi.array().items(Joi.number()).required().messages({
                'any.required': 'Preferences are required',
                'array.includesRequiredUnknowns': 'Each preference must be a number',
                'number.base': 'Invalid preference. Must be a number'
            }),
            Joi.allow(null)
        )
        


    }),
    userId: Joi.number().required().messages({
        'any.required': 'User Id is required'
    })

});

export const validationOptions = {
    stripUnknown: true
};

/*
Author: Moin.
Description: this function use for check page Id exist or not 
*/
export const pageYear = Joi.object({
    year: Joi.number().required().messages({
        'any.required': 'year is required',
        'number.id': 'Invalid id'
    }),
    page: Joi.number().required().messages({
        'any.required': 'page is required',
        'number.id': 'Invalid id'
    })
});