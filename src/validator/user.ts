import Joi from 'joi';


export const personalDataSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

export const userId = Joi.object({
    id: Joi.string().required().messages({
        'any.required':'Id is required.'
    })
});

export const updateStudentSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    nameAsOnMarksheet: Joi.string().required(),
    dob: Joi.string().required(),
    email: Joi.string().required(),
    mobileno: Joi.string().required(),
    gender: Joi.string().required(),
    bloodGroup: Joi.string().required(),
    address: Joi.string().required(),
    aadharCardno: Joi.string().required(),
    nameAsPerAadharCard: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    category: Joi.string().required(),
    admissionType: Joi.string().required(),
    admissionCategory: Joi.string().required(),
    religion: Joi.string().required(),
    learningDisability: Joi.string().required(),
    motherName: Joi.string().required(),
    fatherName: Joi.string().required(),
    parentsMobileno: Joi.string().required(),
    registrationNo: Joi.number().integer().positive().required(),
    academicYear: Joi.number().integer().positive().required()
    // serialNo: Joi.string().required(),
    // pinPurchase: Joi.string().required()
});

export const updateStudentStatusSchema = Joi.object({
    studentId: Joi.number().integer().positive().required(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').required(),
    nameAsOnMarksheet: Joi.string().required(),
    email: Joi.string().required(),
    admissionType: Joi.string().required()
});

export const savePersonal = Joi.object({
    personalData: Joi.object({
        firstName: Joi.string().required().messages({
            'any.required': 'firstname is required'
        }),
        middleName: Joi.string().required().messages({
            'any.required': 'firstname is required'
        }),
        lastName: Joi.string().required().messages({
            'any.required': 'lastname is required'
        }),
        nameAsOnMarksheet: Joi.string().required().messages({
            'any.required': 'nameAsOnMarksheet is required'
        }),
        fatherName: Joi.string().required().messages({
            'any.required': 'fathername is required'
        }),
        motherName: Joi.string().required().messages({
            'any.required': 'mothername is required'
        }),
        gender: Joi.string().required().messages({
            'any.required': 'gender is required'
        }),
        dob: Joi.string().required().messages({
            'any.required': 'dob is required'
        }),
        bloodGroup: Joi.string().required().messages({
            'any.required': 'bloodGroup is required'
        }),
        category: Joi.string().required().messages({
            'any.required': 'Category is required'
        }),
        nameAsPerAadharCard: Joi.string().required().messages({
            'any.required': 'nameAsPerAadharCard is required'
        }),
        aadharCardno: Joi.number().required().messages({
            'any.required': 'adharCardno is required'
        }),
        religion: Joi.string().required().messages({
            'any.required': 'religion is required'
        }),
        admissionCategory: Joi.string().required().messages({
            'any.required': 'admissionCategory is required'
        }),
        corAddress: Joi.string().required().messages({
            'any.required': 'address is required'
        }),
        corCity: Joi.string().required().messages({
            'any.required': 'city is required'
        }),
        corState: Joi.string().required().messages({
            'any.required': 'state is required'
        }),
        corLocationArea: Joi.string().required().messages({
            'any.required': 'location is required'
        }),
        corDistrict: Joi.string().required().messages({
            'any.required': 'state is required'
        }),
        corTaluka: Joi.string().required().messages({
            'any.required': 'location is required'
        }),
        preAddress: Joi.string().required().messages({
            'any.required': 'address is required'
        }),
        preCity: Joi.string().required().messages({
            'any.required': 'city is required'
        }),
        preState: Joi.string().required().messages({
            'any.required': 'state is required'
        }),
        preLocationArea: Joi.string().required().messages({
            'any.required': 'location is required'
        }),
        preDistrict: Joi.string().required().messages({
            'any.required': 'state is required'
        }),
        preTaluka: Joi.string().required().messages({
            'any.required': 'location is required'
        }),
        prePincode: Joi.string().length(6)
            .pattern(/^\d+$/) // Ensure it consists of digits only
            .required()
            .messages({
                'string.base': 'Pincode must be a string',
                'string.length': 'Pincode must be exactly 6 characters long',
                'string.pattern.base': 'Pincode must consist of digits only',
                'any.required': 'Pincode is required'
            }),
        mobileno: Joi.number().required()
            .messages({
                'any.required': 'Mobile number is required'
            }),
        email: Joi.string()
            .email() // Valid email format, including common TLDs like .in
            .required()
            .messages({
                'string.email': 'Invalid email format',
                'any.required': 'Email is required'
            }),
        guardianMobileno: Joi.number().required()
            .messages({
                'string.pattern.base': 'Mobile number must be exactly 10 digits long',
                'any.required': 'Mobile number is required'
            }),
        placeOfBirth: Joi.string().required().messages({
            'any.required': 'Place Of Birth is required.'
        }),
        motherTongue: Joi.string().required().messages({
            'any.required': 'Mother Tongue is required'
        }),
        citizenShip: Joi.string().required().messages({
            'any.required': 'CitizenShip is required'
        }),
        speciallyAbled:Joi.string().required().messages({
            'any.required': 'Specially Abled is required'
        }),
        maritalStatus:Joi.string().required().messages({
            'any.required': 'Marital Status  is required'
        }),
        isAddressSame:Joi.string().required().messages({
            'any.required': 'Is Address Same  is required'
        })
    })
});

export const findByRegistrationNo = Joi.object({
    registerationNo: Joi.string().required().messages({
        "any.required": "Registration no is required"
    })
});

export const validationOptions = {
    stripUnknown: true
};
