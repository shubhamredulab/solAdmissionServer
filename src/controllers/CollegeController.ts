import { NextFunction, Request, Response } from "express";
import CollegeServices from "../services/CollegeServices";
import logger from "../utils/winston";
import { CollegeSchema, CollegeIdSchema, CollegeIdFileNameSchema, CollegeId } from "../validator/college";
import fs from 'fs';
const FILE_LOCATION = process.env.FILE_LOCATION || '';
const SERVERL_URL = process.env.SERVER_URL;
import { jsonParser, activity } from "../utils/functions";
import CollegeCourseServices from "../services/CollegeCourseServices";
import MenuItemServices from "../services/MenuItemService";
import { AccessServices } from "../services/AccessService";
import { ActivityServices } from "../services/ActivityService";
import axios from 'axios';


export default class CollegeController {
  /**
   * @author: Priyanka Vishwakarma
   * @description: get all college data
   * Router: /api/college/
   */
  public static getCollegeData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collegeData = await CollegeServices.getCollegeData();
      const data = [];
      for (const college of collegeData) {
        data.push({
          id: college.id,
          college_name_admission: college.college_name_admission,
          college_address_admission: college.college_address_admission,
          college_code_admission: college.college_code_admission,
          college_logo_admission: college.college_logo_admission,
          college_logo_link: college.college_logo_admission ? `${SERVERL_URL}/api/uploads/collegeLogo/${college.id}/${college.college_logo_admission}` : null,
          university_code_admission: college.university_code_admission,
          college_type: college.college_type,
          city: college.city,
          state: college.state
        });
      }
      if (collegeData) {
        res.status(200).json({ status: 200, message: "All colleges", data: data });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: save college data
   * Router: /api/college/saveCollege
   */
  public static saveCollege = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CollegeSchema.validateAsync(req.body);
      const { id, nameAsOnMarksheet, email } = req.user;
      const college = await CollegeServices.saveCollege(req.body);
      const data = {
        id: college?.id,
        college_name_admission: college?.college_name_admission,
        college_address_admission: college?.college_address_admission,
        college_code_admission: college?.college_code_admission,
        college_logo_admission: college?.college_logo_admission,
        college_logo_link: college?.college_logo_admission ? `${SERVERL_URL}/api/uploads/collegeLogo/${college.id}/${college.college_logo_admission}` : null,
        university_code_admission: college?.university_code_admission,
        college_type: college?.college_type,
        city: college?.city,
        state: college?.state
      };

      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const activity = `Created new college ${college?.college_name_admission} by superadmin ${nameAsOnMarksheet}(${email}).`;

      const activity_data = {
        userId: id,
        name: `${nameAsOnMarksheet}(${email})`,
        activity: activity,
        activity_name: `Add College`,
        ip_address: IP
      };
      await ActivityServices.saveActivity(activity_data);
      res.status(200).json({ status: 200, message: 'Added college successfully!!', data: data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: get college by id
   * Router: /api/college/getCollegeById 
   */
  public static getCollegeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CollegeIdSchema.validateAsync(req.query);

      const { id } = req.query;
      const college = await CollegeServices.getCollegeById(Number(id));
      if (college) {
        res.status(200).json({ status: 200, message: 'College', data: college });
      } else {
        res.status(404).json({ status: 404, message: "Not Found", data: college });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: update college data by id
   * Router: /api/college/updateCollegeById
   */
  public static updateCollegeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CollegeIdSchema.validateAsync(req.query);
      await CollegeSchema.validateAsync(req.body);
      const { nameAsOnMarksheet, email, role } = req.user;
      const { id } = req.query;
      await CollegeServices.updateCollegeById(Number(id), req.body);
      const college = await CollegeServices.getCollegeById(Number(id));
      if (college) {
        if (college.collegeStatus === 'inactive') {
          await CollegeCourseServices.updateCollegeCourseStatusByCollegeId(Number(id), college.collegeStatus);
        }
        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        let roleVerb;
        switch (role) {
          case 'SUPER_ADMIN':
            roleVerb = 'superadmin';
            break;
          case 'ADMIN':
            roleVerb = 'admin';
            break;
          default:
            roleVerb = 'unknown';
            break;
        }
        const activity = `Updated college ${req.body.college_name_admission} by ${roleVerb} ${nameAsOnMarksheet}(${email}).`;
        const activity_data = {
          userId: req.user.id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: activity,
          activity_name: `Update College`,
          ip_address: IP
        };
        await ActivityServices.saveActivity(activity_data);
        res.status(200).json({ status: 200, message: 'College updated successfully!!', data: college });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: delete college by id
   * Router: /api/college/deleteCollegeById 
   */
  public static deleteCollegeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CollegeIdSchema.validateAsync(req.query);
      const { nameAsOnMarksheet, email, role } = req.user;
      const { id } = req.query;
      let collegeName: string | undefined;

      const collegeData = await CollegeServices.getCollegeById(Number(id));
      if (collegeData !== null) {
        collegeName = collegeData.college_name_admission;
      }
      await CollegeServices.deleteCollegeById(Number(id));
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      let roleVerb;
      switch (role) {
        case 'SUPER_ADMIN':
          roleVerb = 'superadmin';
          break;
        case 'ADMIN':
          roleVerb = 'admin';
          break;
        default:
          roleVerb = 'unknown';
          break;
      }
      const activity = `Deleted college ${collegeName} by ${roleVerb} ${nameAsOnMarksheet}(${email}).`;

      const activity_data = {
        userId: req.user.id,
        name: `${nameAsOnMarksheet}(${email})`,
        activity: activity,
        activity_name: `Delete College`,
        ip_address: IP
      };
      await ActivityServices.saveActivity(activity_data);
      res.status(200).json({ status: 200, message: 'College deleted successfully!!', id: Number(id) });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: update college logo by id
   * Router: /api/college/uploadCollegeLogo
   */
  public static uploadCollegeLogo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CollegeIdSchema.validateAsync(req.query);
      const file: any = req.file;
      const { id } = req.query;
      const user = req.user;
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const extension = file.originalname.split('.').pop();
      const oldname = `${FILE_LOCATION}/public/upload/collegeLogo/${id}/${file.filename}`;

      fs.rename(oldname, `${oldname}.${extension}`, () => {
        logger.info("\nFile Renamed!\n");
      });

      await CollegeServices.collegeLogoByCollegeId(Number(id), `${file.filename}.${extension}`);
      const updatedCollege = await CollegeServices.getCollegeById(Number(id));
      let roleVerb;
      switch (user.role) {
        case 'SUPER_ADMIN':
          roleVerb = 'superadmin';
          break;
        case 'ADMIN':
          roleVerb = 'admin';
          break;
        default:
          roleVerb = 'unknown';
          break;
      }
      const activity = `Upload college logo by ${roleVerb} ${user.nameAsOnMarksheet} ( ${user.email} )`;

      const activity_data = {
        userId: req.user.id,
        name: `${user.nameAsOnMarksheet}(${user.email})`,
        activity: activity,
        activity_name: `Update College Logo`,
        ip_address: IP
      };
      await ActivityServices.saveActivity(activity_data);
      res.status(200).json({ status: 200, message: 'College Logo uploaded successfully!!', data: updatedCollege });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
   * @author: Priyanka Vishwakarma
   * @description: delete college logo by id
   * Router: /api/college/deleteCollegeLogoById
   */
  public static deleteCollegeLogoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CollegeIdFileNameSchema.validateAsync(req.query);
      const { id, filename } = req.query;

      fs.unlink(`${FILE_LOCATION}/public/upload/collegeLogo/${id}/${filename}`, err => {
        if (err) {
          throw err;
        } else {
          logger.info('File Deleted!!');
        }
      });

      await CollegeServices.collegeLogoByCollegeId(Number(id), '');
      const college = await CollegeServices.getCollegeById(Number(id));
      const activity_data = `Delete college and college is is ${id} by ${req.user.nameAsOnMarksheet} ( ${req.user.email} )`;
      await activity(req.user.id, req.user.nameAsOnMarksheet, activity_data);
      res.status(200).json({ status: 200, message: 'College Logo deleted successfully!!', data: college });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
 Author: Rutuja Patil.
 Router: /api/college/getDataByCollegeName
 Description: this function use for get the  Data by using college name.
 */
  public static getDataByCollegeName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CollegeId.validateAsync(req.query);
      const { collegeId } = req.query;
      const dataByCollegeName = await CollegeServices.getDataByCollegeName(Number(collegeId));
      const parseData = await jsonParser(dataByCollegeName);
      if (dataByCollegeName) {
        res.status(200).json({ status: 200, message: 'All College Data', data: parseData });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
 Author: Rutuja Patil.
 Router: /api/college/getCollegeData
 Description: this function use for get the All College data.
 */
  public static getCollegeDatas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let degreeType: string;
      if (req.user.admissionType == 'UG') {
         degreeType = ['Bachelor', 'Diploma'].map(degree => `'${degree}'`).join(',');
      } else {
        degreeType = ['Master'].map(degree => `'${degree}'`).join(',');
      }
      const { collegeName, courseName, groupName, collegeType, city, state } = req.query;
      const dataOfCollege = await CollegeServices.getCollegeDatas(String(collegeName), String(courseName), String(groupName), String(collegeType), String(city), String(state), degreeType as string);
      const parseData = await jsonParser(dataOfCollege);
      if (dataOfCollege) {
        res.status(200).json({ status: 200, message: 'College Code', data: parseData });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
  Author: Rutuja Patil.
  Router: /api/college/getAllCollegesData
  Description: this function use for get the All College data.
  */
  public static getAllCollegesData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user.admissionType == 'UG') {
        const degree = ['Bachelor', 'Diploma'];
        const allCollegeData = await CollegeServices.getAllCollegesData(degree);
        res.status(200).json({ status: 200, message: 'All College Data', data: allCollegeData });
      } else {
        const degree = ['Master'];
        const allCollegeData = await CollegeServices.getAllCollegesData(degree);
        res.status(200).json({ status: 200, message: 'All College Data', data: allCollegeData });
      }

    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
  Author: Rutuja Patil.
  Router: /api/college/getDataOfCollege
  Description: this function use for get the All College data.
  */
  public static getDataOfCollege = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.query.admissionType == 'UG') {
        const degree = ['Bachelor', 'Diploma'];
        const allCollegeData = await CollegeServices.getAllCollegesData(degree);
        res.status(200).json({ status: 200, message: 'All College Data', data: allCollegeData });
      } else {
        const degree = ['Master'];
        const allCollegeData = await CollegeServices.getAllCollegesData(degree);
        res.status(200).json({ status: 200, message: 'All College Data', data: allCollegeData });
      }

    } catch (error) {
      logger.error(error);
      next(error);
    }
  };


  /**
   * @author: Priyanka Vishwakarma
   * @description: Get college data with pagination and search
   * Router: /api/college/getCollegePaginationAndSearch
   */
  public static getCollegePaginationAndSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, search } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const user = req.user;

      let count;
      let colleges;
      let college;
      const data = [];

      if (user.role === 'SUPER_ADMIN' || user.role === 'UNIVERSITY') {
        count = await CollegeServices.getCollegeCount();
        colleges = await CollegeServices.getCollegeDataWithPaginationAndSearch(offset, Number(limit), String(search));


        for (const college of colleges) {
          data.push({
            id: college.id,
            college_name_admission: college.college_name_admission,
            college_address_admission: college.college_address_admission,
            college_code_admission: college.college_code_admission,
            college_logo_admission: college.college_logo_admission,
            college_logo_link: college.college_logo_admission ? `${SERVERL_URL}/api/uploads/collegeLogo/${college.id}/${college.college_logo_admission}` : null,
            university_code_admission: college.university_code_admission,
            college_type: college.college_type,
            city: college.city,
            state: college.state,
            collegeStatus: college.collegeStatus
          });
        }
        res.status(200).json({ status: 200, message: 'All colleges', data: data, count: count });
      } else if (user.role === 'ADMIN') {
        const menuItem = await MenuItemServices.getMenuItemByUserId(user.id);

        if (menuItem && menuItem.collegeId) {
          count = 1;
          for (const Data of menuItem.collegeId) {
            college = await CollegeServices.getCollegeById(Data);
            data.push({
              id: college.id,
              college_name_admission: college.college_name_admission,
              college_address_admission: college.college_address_admission,
              college_code_admission: college.college_code_admission,
              college_logo_admission: college.college_logo_admission,
              college_logo_link: college.college_logo_admission ? `${SERVERL_URL}/api/uploads/collegeLogo/${college.id}/${college.college_logo_admission}` : null,
              university_code_admission: college.university_code_admission,
              college_type: college.college_type,
              city: college.city,
              state: college.state,
              collegeStatus: college.collegeStatus
            }); 
          }
  

        } else {
          return res.status(404).json({ status: 404, message: 'College not found for the admin user' });
        }
        res.status(200).json({ status: 200, message: 'College', data: data, count: count });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public static getColleges = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CollegeServices.getColleges();
      res.status(200).json({ status: 200, message: 'All colleges Data get successfully', data: data });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

  /**
   * @author: Tiffany Correia
   * @description: Gets all the college data
   */
  public static getDataCollege = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataForCollege = await CollegeServices.getDataCollege();
      if (dataForCollege) {
        res.status(200).json({ status: 200, message: 'College Data Fetched Successfully!', data: dataForCollege });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /*
  Author: Rutuja Patil.
  Router: /api/college/getCourseDetails
  Description: this function use for get course details based on the college Name.
  */
  public static getCollegeDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CollegeId.validateAsync(req.query);
      const { collegeId } = req.query;
      const courseData = await CollegeServices.getCollegeDetails(Number(collegeId));
      res.status(200).json({ status: 200, message: "Course data get successfully", data: courseData });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

  /**
 * @author: Moin 
 * @description: get all admin wise  college data
 */
  public static getAdminCollegeData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collegeData = await AccessServices.getAdminWiseCollegeData(req.user.id);
      const data = [];
      for (const college of collegeData) {
        data.push({
          id: college.id,
          college_name_admission: college.college_name_admission,
          college_address_admission: college.college_address_admission,
          college_code_admission: college.college_code_admission,
          college_logo_admission: college.college_logo_admission,
          college_logo_link: college.college_logo_admission ? `${SERVERL_URL}/api/uploads/collegeLogo/${college.id}/${college.college_logo_admission}` : null,
          university_code_admission: college.university_code_admission,
          college_type: college.college_type,
          city: college.city,
          state: college.state
        });
      }
      if (collegeData) {
        res.status(200).json({ status: 200, message: "All Admin Wise colleges", data: data });
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  /**
     * @author: Pranali Gambhir 
     * @description: Get colleges role wise for reports tab
     */
  public static getAllCollegeData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let colleges;
      let college;
      const user = req.user;
      if (user.role === 'SUPER_ADMIN' || user.role === 'UNIVERSITY') {
        colleges = await CollegeServices.getCollegeData();

        if (colleges) {
          res.status(200).json({ status: 200, message: "All colleges", data: colleges });
        }
      } else {
        const menuItem = await MenuItemServices.getMenuItemByUserId(user.id);
        if (menuItem && menuItem.collegeId) {
          const viewData=[];
          for (const data of menuItem.collegeId) {
          college = await CollegeServices.getCollegeById(data);
          viewData.push(college);
          }
          res.status(200).json({ status: 200, message: "College", data: viewData });
        }
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

   /**
 * @author: Shubham Ravrane 
 * @description: get all data of convocation with or without application and email
 */
   public static getSfcConvocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const menuItem = await MenuItemServices.getMenuItemByUserId(Number(req.query.userId));
     console.log("req.query",req.query);
     
      if(menuItem){
        // Example: calling another server route
        const response = await axios.get('https://devsuconvocation.studentscenter.in/api/CollegeApplicationGet', {
          params: {
              collegeId: menuItem.collegeId,
              courseId: menuItem.courseId,
              role:req.query.role,
              pageId:req.query.page,
              applicationId:req.query.applicationId,
              limit:req.query.limit,
              email:req.query.email,
              tracker:req.query.tracker


          }
          
      });

      res.status(200).json({ status: 200, message: "College", data: response.data });
    }else{

                // Example: calling another server route
                const response = await axios.get('https://devsuconvocation.studentscenter.in/api/CollegeApplicationGet', {
                  params: {
                    collegeId: null,
                    courseId: null,
                    role:req.query.role,
                    pageId:req.query.page,
                    applicationId:req.query.applicationId,
                    limit:req.query.limit,
                    email:req.query.email,
                    tracker:req.query.tracker
                  }
              });
        
              res.status(200).json({ status: 200, message: "College", data: response.data });

      }   
     
     
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

    /**
 * @author: Shubham Ravrane 
 * @description: To reject or accept the application
 */
   public static verifyApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("ddddddddddddddd>>>",req.body);
      
      res.status(200).json({ status: 200, message: 'College Logo uploaded successfully!!',  });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

}

