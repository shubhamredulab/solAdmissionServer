import Joi from 'joi';

export const CollegeCourseSchema = Joi.object({
    college_id_admission: Joi.number().required().messages({
        'any.required': 'College is required.'
    }),
    faculty_id_admission: Joi.number().required().messages({
        'any.required': 'College name is required.'
    }),
    department_id_admission: Joi.number().required().messages({
        'any.required': 'Department is required.'
    }),
    course_id_admission: Joi.number().required().messages({
        'any.required': 'Course is required.'
    }),
    academic_year_admission: Joi.string().trim().required().messages({
        'any.required': 'University code is required.'
    }),
    intake_admission: Joi.number().required().messages({
        'any.required': 'University code is required.'
    }),
    subject_group_id_admission: Joi.number().allow(null).optional(),
    // subject_group_id_admission: Joi.number().required().messages({
    //     'any.required': 'University code is required.'
    // })
    courseStatus: Joi.string().trim().required().messages({
        'any.required': 'CourseStatus is required.'
    }),
    admissionYear: Joi.number().required().messages({
        'any.required': 'Admission year is required.'
    })
});

export const CollegeCourseIdSchema = Joi.object({
    id: Joi.string().trim().required().messages({
        'any.required':'Id is required.'
    })
    
});
//Moin 
// this validation function check the required collegeId is exist or not 
export const getCollegeWiseCourse = Joi.object({
    collegeId: Joi.string().trim().required().messages({
        'any.required':'collegeId is required.'
    })
    
});

export const incrementIntakeSchema = Joi.object({
    collegeCourseId: Joi.number().required().messages({
        'any.required': 'CollegeCourse id is required.'
    }),
    collegeId: Joi.number().required().messages({
        'any.required': 'College id is required.'
    }),
    courseId: Joi.number().required().messages({
        'any.required': 'Course id is required.'
    }),
    admissionYear: Joi.number().required().messages({
        'any.required': 'CollegeCourse is required.'
    }),
    academicYear: Joi.string().required().messages({
        'any.required': 'Academic Year is required.'
    }),
    incrementIntake: Joi.number().required().messages({
        'any.required': 'IncrementIntake is required.'
    })
});

export const decrementIntakeSchema = Joi.object({
    collegeCourseId: Joi.number().required().messages({
        'any.required': 'CollegeCourse id is required.'
    }),
    collegeId: Joi.number().required().messages({
        'any.required': 'College id is required.'
    }),
    courseId: Joi.number().required().messages({
        'any.required': 'Course id is required.'
    }),
    admissionYear: Joi.number().required().messages({
        'any.required': 'CollegeCourse is required.'
    }),
    academicYear: Joi.string().required().messages({
        'any.required': 'Academic Year is required.'
    }),
    decrementIntake: Joi.number().required().messages({
        'any.required': 'DecrementIntake is required.'
    })
});

