import { NextFunction, Request, Response } from 'express';
import UserServices from '../services/UserServices';
import { UploadServices } from '../services/UploadService';
import * as fs from 'fs';
import logger from '../utils/winston';
import { deleteProfilePicdata, getFiles, seeFiles, usersID, validationOptions } from '../validator/upload';
import { ActivityServices } from '../services/ActivityService';

const FILE_LOCATION = process.env.FILE_LOCATION || "";

export default class UploadController {
  /*
  Author: Moin.
  Router: /api/upload/images
  Description: this function use for upload the user image
  */
  public static images = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFiles.validateAsync(req.body);
      await seeFiles.validateAsync(req.file, validationOptions);
      const file: any = req.file;
      const { userId } = req.body;
      const user = await UserServices.findUser(userId);
      if (user) {
        if (!file) {
          return res
            .status(400)
            .json({ message: "File is missing in the request" });
        }
        const extension = file.originalname.split('.').pop();
        const oldname = `${FILE_LOCATION}public/upload/userid/${userId}/${file.filename}`;
        fs.rename(oldname, `${oldname}.${extension}`, () => {
          logger.info("\nFile Renamed!\n");
        });
        const updateUser = await UploadServices.updateImage(user.id, file.filename + "." + extension);
        const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        if (updateUser) {

          const users = await UserServices.findUser(user.id);
          if (users) {
            let roleVerb;
            if (user.role === 'SUPER_ADMIN') {
              roleVerb = 'superadmin';
            } else if (user.role === 'ADMIN') {
              roleVerb = 'admin';
            } else {
              roleVerb = 'student';
            }
            const activity = `Profile added by ${roleVerb} ${user.nameAsOnMarksheet} (${user.email}).`;

            const activity_data = {
              userId: user.id,
              name: `${user.nameAsOnMarksheet}(${user.email})`,
              activity: activity,
              activity_name: `Add Profile`,
              ip_address: IP
            };
            const activityResult = await ActivityServices.saveActivity(activity_data);

            if (activityResult) {
              res.status(200).json({ status: 200, data: updateUser });
            }
          }
        }
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
  /*
  Author: Moin.
  Router: /api/upload/getUploadedImage
  Description: this function use for get the user image
  */
  public static getUploadedImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await usersID.validateAsync(req.query);
      const userId = req.query.userId;
      const user = await UserServices.findUser(userId);
      if (user) {
        if (user.imagesName != null && user.imagesName != 'null') {
          const currentPath = process.cwd();
          const file = currentPath + "/src/public/upload/userid/" + user.id + "/" + user.imagesName;
          if (!fs.existsSync(file)) {
            res.json({
              status: 400,
              data: null,
              message: 'File does not exist',
              fileName: user.imagesName
            });
          } else if (fs.existsSync(file)) {
            res.json({
              status: 200,
              data: file,
              fileName: user.imagesName
            });
          }
        } else {
          res.json({
            status: 400,
            data: null
          });
        }
      }

    } catch (err) {
      logger.error(err);
      next(err);
    }
  };
  /*
  Author: Moin.
  Router: /api/upload/deleteProfilePic
  Description: this function use for delete the user image
  */

  public static deleteProfilePic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteProfilePicdata.validateAsync(req.query);
      const user = req.user;
      const currentPath: string = process.cwd();
      fs.unlink(currentPath + '/src/public/upload/userid/' + req.query.userId + "/" + req.query.fileName, err => {
        if (err) throw err;
      });
      const userData = await UserServices.findUser(req.query.userId);
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const IP = clientIP || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      if (userData) {
        const deleteData = await UploadServices.deleteUserImage(userData.id);
        const users = await UserServices.findUser(req.user.id);
        if (users) {
          let roleVerb;
          if (user.role === 'SUPER_ADMIN') {
            roleVerb = 'superadmin';
          } else if (user.role === 'ADMIN') {
            roleVerb = 'admin';
          } else {
            roleVerb = 'student';
          }
          const activity = `Profile deleted by ${roleVerb} ${user.nameAsOnMarksheet} (${user.email}).`;

          const activity_data = {
            userId: user.id,
            name: `${user.nameAsOnMarksheet}(${user.email})`,
            activity: activity,
            activity_name: `Delete Profile`,
            ip_address: IP
          };
          const activityResult = await ActivityServices.saveActivity(activity_data);

          if (activityResult) {
            await res.json({ status: 200, data: deleteData });
          }
        }
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };

}


