import { ActivityServices } from '../services/ActivityService';
import { NextFunction, Request, Response } from "express";
import { PhdEducationalService } from '../services/PhdEducationalServices';
import logger from '../utils/winston';

export default class PhdEduDetailsController {


  public static savePhdEduData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, nameAsOnMarksheet, admissionType, email } = req.user;
      const eduData = req.body.educationalData;
      const eduDetails = await PhdEducationalService.eduDetails(req.user.id);
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      if (!eduDetails) {
        const user = await PhdEducationalService.addEduDetails(
          eduData, req.user.id, req.user.admissionType);
        res.status(200).json({
          status: 200,
          message: "Educational Details Added",
          data: user
        });

        const activity = `Educational details filled for ${admissionType} by student ${nameAsOnMarksheet}(${email}).`;

        const data = {
          userId: id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: activity,
          activity_name: 'Educational Details Submission',
          ip_address: IP
        };

        await ActivityServices.saveActivity(data);
      } else {
        const user = await PhdEducationalService.updateEduDetails(eduData, req.user.id);
        res.status(200).json({
          status: 200,
          message: "Educational Details",
          data: user
        });
        const activity = `Educational details updated for ${admissionType} by student ${nameAsOnMarksheet}(${email}).`;
        const data = {
          userId: id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: activity,
          activity_name: 'Educational Details Updated by student',
          ip_address: IP
        };

        await ActivityServices.saveActivity(data);
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };


  public static getPhdEduData = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const eduData = await PhdEducationalService.getEduData(req.user.id);
      res.status(200).json({
        status: 200,
        message: "Get All Educational Details",
        data: eduData
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public static saveEntranceDetails = async (req: Request, res:Response, next: NextFunction) => {
    try{
      const { id } = req.user;
      const entranceDetails = req.body.entranceExamdetails;
      if(req.body.entranceExamType === 'SET'){
        await PhdEducationalService.saveSetDetails(entranceDetails, id);
      }
      if(req.body.entranceExamType === 'Mphil'){
        await PhdEducationalService.saveMphilDetails(entranceDetails, id);
      }
      if(req.body.entranceExamType === 'NET'){
        await PhdEducationalService.saveNetDetails(entranceDetails, id);
      }
      if(req.body.entranceExamType === 'GATE'){
        await PhdEducationalService.saveGateDetails(entranceDetails, id);
      }
      res.json({status: 200, message:"Entrance details save successfully"});
    }catch(error){
      logger.error(error);
      next(error);
    }
  };

  public static getEntranceDetails = async(req: Request, res: Response, next: NextFunction) => {
    try{
      const entranceData = await PhdEducationalService.getEntranceDetails(req.user.id);
      if(entranceData.length > 0){
        res.json({status:200, message:"Data get successfully", data:entranceData});
      }
    }catch(error){
      logger.error(error);
      next(error);
    }
  };

  public static deleteEntranceDetails = async(req: Request, res: Response, next: NextFunction) => {
    try{
      const { type } = req.query;
      if(type === 'PET'){
        await PhdEducationalService.deleteEntranceDetails(req.user.id);
      }
      if(type === 'SET'){
        await PhdEducationalService.deleteSetEntranceDetails(req.user.id);
      }
      if(type === 'Mphil'){
        await PhdEducationalService.deleteMphilEntranceDetails(req.user.id);
      }
      if(type === 'NET'){
        await PhdEducationalService.deleteNetEntranceDetails(req.user.id);
      }
      if(type === 'GATE'){
        await PhdEducationalService.deletegateEntranceDetails(req.user.id);
      }
      res.json({status: 200, message:"Entrance details delete successfully"});
    }catch(error){
      logger.error(error);
      next(error);
    }
  };
}