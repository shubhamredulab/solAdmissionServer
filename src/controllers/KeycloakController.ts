// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { IkeycloakRole } from '../types/user';
// import { keycloakAdminLoginSchema, keycloakRegisterSchema } from '../validator/keycloak';
// import RoleServices from '../services/RoleServices';
// import UserServices from '../services/UserServices';
// import KeycloakApi from '../utils/keycloak';
// import ApiError from '../utils/api-error';
// import logger from '../utils/winston';

// export default class KeycloakController {
//   public static register = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await keycloakRegisterSchema.validateAsync(req.body);
//       const { email } = req.body;
//       const registerUser = await UserServices.getUserByEmail(email);
      
//       if (registerUser) return res.status(409).json({ status: 409, message: 'Already registered with this email.' });
      
//       const newUser = await UserServices.register(req.body);
      
//       const data = JSON.stringify({
//         enabled: true,
//         firstName: '',
//         lastName: '',
//         email,
//         username: email,
//         credentials: [
//           {
//             type: 'password',
//             value: '123456',
//             temporary: true
//           }
//         ],
//         attributes: {
//           AddUserId: newUser.id
//         }
//       });

//       let token: any = '';
//       const response = await KeycloakApi.getToken1();
//       if (response.status === 200) {
//         token = await response.json();
//       }
//       const keycloakUser = await KeycloakApi.register(data, `Bearer ${token.access_token}`);

//       if (keycloakUser.status === 201) {
//         res.status(201).json({ status: 201, message: 'You are registered successfully' });
//         next();
//       } else {
//         await UserServices.deleteUserByEmail(email);
//         res.status(400).json({ status: 400, message: 'Unable to register.' });
//       }
//     } catch (error) {      
//       return next(error);
//     }
//   };

//   public static assignClientRoleToUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = [];
//       const data1 = [];
//       const user = await UserServices.getUserByEmail(req.body.email);
//       if (!user) return res.status(400).json({ status: 400, message: 'User Not Found' });

//       let keycloakId;
//       let token: any = '';
//       if (user.keycloakId === null) {
//         try {
//           const response = await KeycloakApi.getToken1();
//           if (response.status === 200) {
//             token = await response.json();
//           }
//           const keycloakUser = await KeycloakApi.getUserByEmail(req.body.email, `Bearer ${token.access_token}`);

//           keycloakId = keycloakUser[0].id;

//           await UserServices.updateKeycloakId(user.id, keycloakId);

//         } catch (error) {
//           logger.error(error);
//           return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });

//         }
//       }

//       const roleData = await RoleServices.getRoleByRoleName(req.body.role);
//       if (!roleData) return res.status(400).json({ status: 400, error: 'Role Not Found' });
//       if (roleData.roleId === null) {
//         // Fetch the Role ID from the keycloak
//         try {

//           const keycloakRoles = await KeycloakApi.getKeycloakRole(`Bearer ${token.access_token}`);
//           const keycloakRoleData = keycloakRoles
//             .filter((currentRole: IkeycloakRole) => currentRole.name === roleData.roleName);
//           roleData.roleId = keycloakRoleData[0].id;
//           await RoleServices.updateRoleName(roleData);

//         } catch (e) {
//           return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
//         }

//       }

//       if (user.role == 'ADMIN') {
//         try {
//           const keycloakRRoles = await KeycloakApi.getKeycloakRole(`Bearer ${token.access_token}`);
//           for (const key of keycloakRRoles) {
//             if (key.name == 'realm-admin' || key.name == 'manage-users') {
//               await data1.push({ id: key.id, name: key.name });
//             }
//           }

//         } catch (e) {
//           return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
//         }
//       }

//       /*
//         Preparing the data for calling the keycloak api
//       */
//       await data.push({ id: roleData.roleId, name: roleData.roleName });

//       /*
//           Update the new role for the user
//         */
//       await UserServices.saveRoleData(req.body.email, req.body.role);

//       try {
//         // Assign role in keycloak
//         await KeycloakApi.assignRole(data, keycloakId, `Bearer ${token.access_token}`);

//         if (user.role == 'ADMIN') {
//           await KeycloakApi.assignRole(data1, keycloakId, `Bearer ${token.access_token}`);
//         }
//       } catch (e) {
//         // Rollbacking to the default role
//         await UserServices.saveRoleData(req.body.email, user.role);
//         // return res.status(500).json({ status: 500, error: 'Error while assigning role. Assigned Default Role' });
//       }

//       // return res.status(200).json({ status: 200, message: 'Done' ,data : user});
//     } catch (error) {
//       return next(error);
//     }
//   };

//   public static loginKeycloakAdmin = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await keycloakAdminLoginSchema.validateAsync(req.body);

//       const keycloakClientId = process.env.KEYCLOAK_CLIENTID;

//       if (!keycloakClientId) throw Error('Environment: KEYCLOAK_CLIENTID is not defined');
//       // const secretClient = process.env.KEYCLOAK_CLIENT_SECRET;
//       // if (!secretClient) throw Error('Environment: KEYCLOAK_SECRET_OF_CLIENT is not defined');
//       const data = {
//         username: req.body.username,
//         password: req.body.password,
//         grant_type: 'password',
//         client_id: keycloakClientId
//         // client_secret: secretClient,
//       };
//       const response = await KeycloakApi.loginAdmin(data);
//       if(response.status === 200){
//         const token = await response.json();
//         return res.status(200).json({ status: 200, data: token, message: 'Logged in successfully' });
//       }

//     } catch (error) {
//       return next(error);
//     }
//   };

//   public static loginKeycloakUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await keycloakAdminLoginSchema.validateAsync(req.body);

//       const keycloakClientId = process.env.KEYCLOAK_CLIENTID;

//       if (!keycloakClientId) throw Error('Environment: KEYCLOAK_CLIENTID is not defined');
//       // const secretClient = process.env.KEYCLOAK_CLIENT_SECRET;
//       // if (!secretClient) throw Error('Environment: KEYCLOAK_SECRET_OF_CLIENT is not defined');
//       const data = {
//         username: req.body.username,
//         password: req.body.password,
//         grant_type: 'password',
//         client_id: keycloakClientId
//         // client_secret: secretClient,
//       };
//       const response = await KeycloakApi.loginUser(data);

//       const token:any = response.access_token;

//       if (!token) return res.json({ status: 401, message: 'Unauthorized' });
//       // Decode the token and extract the user roles
//       const userInfo = jwt.decode(token);

//       // Retrieve the user roles from the decoded token
//       //     const userRoles = userInfo.resource_access[keycloakClientId].roles;

//       // Get userInfo
//       const userId = userInfo?.sub;
//       // Fetch UserDetails from our database

//       const user = await UserServices.findBykeycloakUserId(userId as string);

//       return res.status(200).json({ status: 200, user: user, token: response.access_token, message: 'Logged in successfully!!!' });

//     } catch (error) {
//       return next(error);
//     }
//   };
// /*
//   Creates a role in our database and keycloak
// */
//   public static createClientRole = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Check if authorization header is present
//       if (req.headers.authorization === undefined) return ApiError.unAuthorized();
//       const { name } = req.body;

//       let role = await RoleServices.getRoleByRoleName(req.body.name);
      
//       // If Role Exits return Duplicate Entry
//       if (role) return res.json({ status: 409, message: 'Duplicate Entry Found' });
//       // Else Add the role to our database with roleId as null
//       // We will later fetch the Role ID and Set it over here in database
//       role = await RoleServices.addRole(req.body.name);
//       /*
//           Preparing the data for calling the Keycloak API
//           to Create a Role at Keycloak Level
//         */
//       const data = { name };
//       try {
//         // Call the Keycloak API to create the role
//         const keycloakRoleRes = await KeycloakApi.creatRole(data, req.headers.authorization);

//         if (keycloakRoleRes.status === 201) {
//           // Fetch the Role ID from the keycloak
//           const getRole = await KeycloakApi.getKeycloakRole(req.headers.authorization);

//           const roleData = getRole
//             .filter((currentRole: IkeycloakRole) => currentRole.name === name);
//           role.roleId = roleData[0].id;
//           await RoleServices.updateRoleId(role);
//           res.status(200).json({ status: 200, message: 'Role created' });
//         }

//       } catch (e) {
//         // If an error occurs during Keycloak API call,
//         // delete the role from our database and pass the error to the next middleware
//         await RoleServices.deleteRoleByRoleName(role.roleName);
//         return next(e);
//       }
//     } catch (error) {
//       return next(error);
//     }
//   };

//   public static getToken = async (req: Request, res: Response, next: NextFunction) => {
//     try {

//       const response = await KeycloakApi.getToken1();
//       if (response.status === 200) {
//         const token = await response.json();
//         res.status(200).json({ status: 200, message: 'Token', data: token });
//       }else{
//        return next(response);
//       }

//     } catch (error) {
//       logger.error(error);
//       return next(error);
//     }
//   };

// /**
//  * @author Moin
//  * @description This function retrieves the default role in the real me management ID-wise.
//  */
// public static getRoleManageRoles =async (req:Request, res:Response, next:NextFunction) => {
//   try {
//      const response = await KeycloakApi.getToken1();
//       if (response.status === 200) {
//         const token = await response.json();
//         const roles= await KeycloakApi.getRoleManage(`Bearer ${token.access_token}`);
//         res.status(200).json({ status: 200, data: roles.json() });
//       }else{
//        return next(response);
//       }
    
//   } catch (error) {
//       logger.error(error);
//     next(error);
//   }
// };
 

// }