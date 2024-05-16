import Joi from 'joi';
import { IInHouse } from '../types/user';

export const educationDataSchema = Joi.object({
  userId: Joi.number().integer().positive().required()
});

export const updateEducationSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  sscObtainedMarks: Joi.number().integer().positive().optional().allow("").allow(null),
  sscOutOf: Joi.number().integer().positive().optional().allow("").allow(null),
  sscPercentage: Joi.number().positive().optional().allow(null),
  sscGrade: Joi.string().optional().allow("").allow(null),
  hscCollegeName: Joi.string().required(),
  hscStream: Joi.string().required(),
  hscBoard: Joi.string().required(),
  hscMarksObtained: Joi.number().integer().positive().optional().allow("").allow(null),
  hscOutOf: Joi.number().integer().positive().optional().allow("").allow(null),
  hscPercentage: Joi.number().positive().optional().allow(null),
  hscGrade: Joi.string().optional().allow("").allow(null),
  hscPassingState: Joi.string().required(),
  hscPassingYear: Joi.number().integer().positive().required(),
  hscNoOfAttempt: Joi.number().integer().positive().required(),
  hscSeatNo: Joi.number().integer().positive().optional().allow(null),
  math: Joi.number().integer().positive().optional().allow(null),
  biology: Joi.number().integer().positive().optional().allow(null),
  ugCollegename: Joi.string().optional().allow("").allow(null),
  ugCourseName: Joi.string().optional().allow(null),
  ugMarksObtained: Joi.number().integer().positive().optional().allow("").allow(null),
  ugOutof: Joi.number().integer().positive().optional().allow("").allow(null),
  ugPercentage: Joi.number().positive().optional().allow(null),
  ugGrade: Joi.string().optional().allow("").allow(null),
  ugPassingMonth: Joi.string().optional().allow(null),
  ugPassingYear: Joi.number().optional().allow(null),
  EntranceExam: Joi.string().optional().allow(null),
  EntranceYear: Joi.number().integer().positive().optional().allow(null),
  ugEntranceMarks: Joi.number().integer().positive().optional().allow(null),
  ugNoOfAttempt: Joi.number().integer().positive().optional().allow(null),
  ugSeatNo: Joi.number().integer().positive().optional().allow(null),
  inHouse : Joi.string().valid(...Object.values(IInHouse)).required()
});



