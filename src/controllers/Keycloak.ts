import {
  NextFunction, Request, Response
} from 'express';

import { keycloakAdminLoginSchema, keycloakCreateRoleSchema, keycloakRegisterSchema } from '../validator/keycloak';
import KeycloakApi from '../utils/keycloak';
import ApiError from '../utils/api-error';

export default class KeycloakAuth {
  static loginKeycloakAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      keycloakAdminLoginSchema.validate(req.body);

      const keycloakClientId = process.env.KEYCLOAK_CLIENTID;

      if (!keycloakClientId) throw Error('Environment: KEYCLOAK_CLIENTID is not defined');
      // const secretClient = process.env.KEYCLOAK_CLIENT_SECRET;
      // if (!secretClient) throw Error('Environment: KEYCLOAK_SECRET_OF_CLIENT is not defined');
      const data = {
        username: req.body.username,
        password: req.body.password,
        grant_type: 'password',
        client_id: keycloakClientId
        // client_secret: secretClient,
      };
      const response = await KeycloakApi.loginAdmin(data);

      return res.status(200).json({ status: 200, data: response, message: 'loggedin successfully' });
    } catch (err) {
      return next(err);
    }
  };

  static loginKeycloakUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await keycloakAdminLoginSchema.validateAsync(req.body);

      const keycloakClientId = process.env.KEYCLOAK_CLIENTID;

      if (!keycloakClientId) throw Error('Environment: KEYCLOAK_CLIENTID is not defined');
      const secretClient = process.env.KEYCLOAK_CLIENT_SECRET;
      if (!secretClient) throw Error('Environment: KEYCLOAK_SECRET_OF_CLIENT is not defined');
      const data = {
        username: req.body.username,
        password: req.body.password,
        grant_type: 'password',
        client_id: keycloakClientId,
        client_secret: secretClient
      };
      const response = await KeycloakApi.loginAdmin(data);

      return res.status(200).json({ status: 200, data: response, message: 'loggedin successfully' });
    } catch (err) {
      return next(err);
    }
  };

  static createClientRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await keycloakCreateRoleSchema.validateAsync(req.body);
      const { name, description } = req.body;

      const data = {
        name,
        description
      };

      if (req.headers.authorization === undefined) return ApiError.unAuthorized();

      await KeycloakApi.creatRole(data, req.headers.authorization);

      return res.status(200).json({ status: 200, data: { message: 'Role Created' } });
    } catch (e) {
      return next(e);
    }
  };

  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await keycloakRegisterSchema.validateAsync(req.body);

      const {
        firstname, lastname, email, password
      } = req.body;

      if (!req.headers.authorization) return ApiError.unAuthorized();

      const data = JSON.stringify({
        enabled: true,
        firstName: firstname,
        lastName: lastname,
        email,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: true
          }
        ]
      });
      await KeycloakApi.register(data, req.headers.authorization);

      return res.status(200).json({ status: 200, messege: 'created' });
    } catch (e) {
      return next(e);
    }
  };

  static getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) return ApiError.unAuthorized();

      const registeredUser = await KeycloakApi.getAllUser(req.headers.authorization);
      return res.status(200).json({ status: 200, data: registeredUser });
    } catch (e) {
      return next(e);
    }
  };

  static getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) return ApiError.unAuthorized();

      const User = await KeycloakApi.getUserByEmail(req.params.email, req.headers.authorization);
      return res.status(200).json({ status: 200, data: User });
    } catch (e) {
      return next(e);
    }
  };

  static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) return ApiError.unAuthorized();

      const User = await KeycloakApi.getUserByEmail(req.params.email, req.headers.authorization);
      await KeycloakApi.deleteKeycloakUser(User[0].id, req.headers.authorization);
      return res.status(200).json({ status: 200, messege: 'Deleted Successfully', data: User });
    } catch (e) {
      return next(e);
    }
  };
}
