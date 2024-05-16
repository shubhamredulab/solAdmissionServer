import { Request, Response, NextFunction } from "express";
import { saveExcels } from '../utils/multer';
import logger from "../utils/winston";
import { ActivityServices } from "../services/ActivityService";

export default class excelDownloadController {

  /*
Author: Priya Sawant.
Router: /api/excelDownload/saveExcels
Description: this function use for save/download the year wise excel data download in public/upload/excel folder.
*/
  public static saveExcels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, nameAsOnMarksheet, email, role } = req.user;
      saveExcels(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        let roleVerb;
        if (role === 'SUPER_ADMIN') {
          roleVerb = 'superadmin';
        } else if (role === 'ADMIN') {
          roleVerb = 'admin';
        } else {
          roleVerb = 'student';
        }
        const activity = `Excel downloaded by ${roleVerb} ${nameAsOnMarksheet}(${email}).`;

        const activity_data = {
          userId: id,
          name: `${nameAsOnMarksheet}(${email})`,
          activity: activity,
          activity_name: `Excel Download`,
          ip_address: IP
        };
        const activityResult = await ActivityServices.saveActivity(activity_data);
        if (activityResult) {
          return res.status(200).json({ message: 'File uploaded successfully' });
        }
      });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Something went wrong" });
      next(err);
    }
  };
}
