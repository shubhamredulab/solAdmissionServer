import Joi from "joi";

export const pgEduData = Joi.object({
    educationalData: Joi.object({
        ugCollegename: Joi.string().required().messages({
            'any.required': 'College name is required'
        }),
        ugCourseName: Joi.string().required().messages({
            'any.required': 'Course name is required'
        }),
        ugPassingMonth: Joi.string().required().messages({
            'any.required': 'Passing Month is required'
        }),
        ugPassingYear: Joi.number().required().messages({
            'any.required': 'Passing year is required'
        }),
        ugSeatNo: Joi.string().required().messages({
            'any.required': 'Seat No. is required'
        }),
        ugNoOfAttempt: Joi.string().required().messages({
            'any.required': 'Number of attempts is required'
        }),
        resultStatus: Joi.string().required().messages({
            'any.required': 'Result Status is required'
        }),
        // achievements: Joi.string().required().messages({
        //     'any.required': 'Achievements required'
        // }),
        hscselectChoice: Joi.string().required().messages({
            'any.required': 'HSC Selection required'
        }),
        EntranceExam: Joi.string().required().messages({
            'any.required': 'Entrance Exam required'
        }),
        ugPercentage: Joi.when('resultStatus', {
            is: 'Result Awaited',
            then: Joi.allow(null),
            otherwise: Joi.number().required().messages({
                'any.required': 'Under Graduate Percentages required'
            })
        }),
        hscPercentage: Joi.number().required().messages({
            'any.required': 'HSC Percentages required'
        }),
        admissionYear: Joi.number().required().messages({
            'any.required': 'Admission Year required'
        }),
        // inHouse: Joi.string().required().messages({
        //     'any.required': 'InHouse Value required'
        // }),
        hscCollegeName: Joi.string().required().messages({
            'any.required': 'College name is required'
        }),
        hscPassingYear: Joi.number().required().messages({
            'any.required': 'Passing year is required'
        }),
        hscPassingMonth: Joi.string().required().messages({
            'any.required': 'Passing Month is required'
        }),
        hscBoardName:Joi.string().required().messages({
            'any.required': 'Board Name is required'
        }),
        boardtype:Joi.string().required().messages({
            'any.required':'Board Type is required'
        })
    })
});
export const ugEduData = Joi.object({
    educationalData: Joi.object({
        hscCollegeName: Joi.string().required().messages({
            'any.required': 'College name is required'
        }),
        hscPassingState: Joi.string().required().messages({
            'any.required': 'Passing state is required'
        }),
        hscPassingYear: Joi.number().required().messages({
            'any.required': 'Passing year is required'
        }),
        hscPassingMonth: Joi.string().required().messages({
            'any.required': 'Passing Month is required'
        }),
        hscSeatNo: Joi.string().required().messages({
            'any.required': 'Seat no is required'
        }),
        hscStream: Joi.string().required().messages({
            'any.required': 'Stream is required'
        }),
        hscNoOfAttempt: Joi.string().required().messages({
            'any.required': 'No of attempts is required'
        }),
        // achievements: Joi.string().required().messages({
        //     'any.required': 'achievements required'
        // }),
        sscselectChoice: Joi.string().required().messages({
            'any.required': 'SSC Select Choice required'
        }),
        hscselectChoice: Joi.when('resultStatus', {
            is: 'Result Awaited',
            then: Joi.allow(null),
            otherwise: Joi.string().required().messages({
                'any.required': 'HSC Select Choice required'
            })
        }),
        hscPercentage: Joi.when('resultStatus', {
            is: 'Result Awaited',
            then: Joi.allow(null),
            otherwise: Joi.number().required().messages({
                'any.required': 'HSC Percentages required'
            })
        }),
        sscPercentage: Joi.number().required().messages({
            'any.required': 'SSC percentage is required'
        }),
        admissionYear: Joi.number().required().messages({
            'any.required': 'Admission Year required'
        }),
        resultStatus: Joi.string().required().messages({
            'any.required': 'Result Status is required'
        }),
        // inHouse: Joi.string().required().messages({
        //     'any.required': 'InHouse Value required'
        // }),
        sscCollegeName: Joi.string().required().messages({
            'any.required': 'College name is required'
        }),
        sscPassingYear: Joi.number().required().messages({
            'any.required': 'Passing year is required'
        }),
        sscPassingMonth: Joi.string().required().messages({
            'any.required': 'Passing Month is required'
        }),
        sscBoardName:Joi.string().required().messages({
            'any.required': 'Board Name is required'
        }),
        boardtype:Joi.string().required().messages({
            'any.required':'Board Type is required'
        })
    })
});
export const sscSelectedMarks = Joi.object({
    educationalData: Joi.object({
        sscObtainedMarks: Joi.number().required().messages({
            'any.required': 'SSC marks are required'    
        }),
        sscOutOf: Joi.number().required().messages({
            'any.required': 'SSC out of marks are required'
        })


    })
});
export const hscSelectedMarks = Joi.object({
    educationalData: Joi.object({
        hscMarksObtained: Joi.number().required().messages({
            'any.required': 'HSC marks required'
        }),
        hscOutOf: Joi.number().required().messages({
            'any.required': 'HSC Out of marks  required'
        })
    })

});
export const sscSelectedGrade = Joi.object({
    educationalData: Joi.object({
        sscGrade: Joi.string().required().messages({
            'any.required': 'SSC grade is required'
        })
    })


});
export const hscSelectedGrade = Joi.object({
    educationalData: Joi.object({
        hscGrade: Joi.string().required().messages({
            'any.required': 'HSC Grade required'
        })
    })

});
export const ugSelectedMarks = Joi.object({
    educationalData: Joi.object({
        ugMarksObtained: Joi.number().required().messages({
            'any.required': 'HSC marks required'
        }),
        ugOutof: Joi.number().required().messages({
            'any.required': 'HSC Out of marks  required'
        })
    })

});
export const ugSelectedGrade = Joi.object({
    educationalData: Joi.object({
        ugGrade: Joi.string().required().messages({
            'any.required': 'SSC grade is required'
        })
    })


});
export const ugQualification = Joi.object({
    educationalData: Joi.object({
        ugQualificationName:Joi.string().required().messages({
            'any.required': 'Qualification name is required'
        })
    })
});
export const ugEntranceExam = Joi.object({
    educationalData: Joi.object({
        EntranceYear:Joi.number().allow(null).required().messages({
            'any.required': 'Entrance year is required'
        }),
        ugEntranceMarks:Joi.number().allow(null).required().messages({
            'any.required': 'Entrance year is required'
        })
    })
});

export const validationOptions = {
    stripUnknown: true
};