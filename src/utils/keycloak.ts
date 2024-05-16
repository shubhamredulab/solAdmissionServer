import { IRoles } from '../types/user';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import checkEnvVariable from './checkEnvVariable ';
import createPayload from './pay-load';
import IMethod from '../types/method';
dotenv.config();

const keycloakURL = checkEnvVariable('KEYCLOAK_URL');
const keycloakRealm = checkEnvVariable('KEYCLOAK_REALM');
const idClient = checkEnvVariable('KEYCLOAK_ID_OF_CLIENT');
const keycloakClientId = checkEnvVariable("KEYCLOAK_CLIENTID");
const idRoleManagement = checkEnvVariable("KEYCLOAK_MANAGEROLE");
const keycloakAdminClientSecret = checkEnvVariable(
  'KEYCLOAK_CLIENT_SECRET'
);

export interface IPayload {
  firstName: string,
  lastName: string
  email: string,
  password: string
}
const { GET, POST, PUT, DELETE } = IMethod;
export default class KeycloakApi {
  static loginAdmin = async (data: any) => {
    try {
      const response = await fetch(`${keycloakURL}/realms/${keycloakRealm}/protocol/openid-connect/token`, createPayload(POST, null, data));
      return response;
    } catch (error) {
      return error;
    }

  };

  static getToken = async () => {
    try {
      const data = {
        grant_type: 'client_credentials',
        client_id: keycloakClientId
        // client_secret: ,
      };
      const response = await fetch(`${keycloakURL}/realms/${keycloakRealm}/protocol/openid-connect/token`, createPayload(POST, null, data));
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return error;
    }

  };

  static getToken1 = async () => {
    try {
      const data = {
        client_id: keycloakClientId,
        username: process.env.K_USERNAME,
        password: process.env.K_PASSWORD,
        grant_type: 'password'
      };
      const response = await fetch(`${keycloakURL}/realms/${keycloakRealm}/protocol/openid-connect/token`, createPayload(POST, null, data));
      return response;
    } catch (error) {
      return error;
    }

  };

  static loginUser = async (data: any) => {
    try {
      const response = await fetch(`${keycloakURL}/realms/${keycloakRealm}/protocol/openid-connect/token`, createPayload(POST, null, data));
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return error;
    }

  };

  static getRoleByName = async (name: string, token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/clients/${idClient}/roles`, createPayload(GET, token, null));
      const data = await response.json();
      const filterData = data.filter((obj: { name: string }) => obj.name === name);
      return filterData;
    } catch (error) {
      return error;
    }

  };

  static creatRole = async (data: object, token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/clients/${idClient}/roles`, createPayload(POST, token, data));
      return response;
    } catch (error) {
      return error;
    }
  };

  static getKeycloakRole = async (token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/clients/${idClient}/roles`, createPayload(GET, token, null));
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return error;
    }

  };

  static register = async (data: string, token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users`, createPayload(POST, token, data));
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  static registerAll = async (userDataPayload: IPayload, token: string) => {
    try {
      const data = {
        enabled: true,
        firstName: userDataPayload.firstName,
        lastName: userDataPayload.lastName,
        email: userDataPayload.email,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: `${userDataPayload.password}`,
            temporary: true
          }
        ]
      };

      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users`, createPayload(POST, token, data));
      return await response.json();
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  static getAllUser = async (token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users`, createPayload(GET, token, null));
      return response;
    } catch (error) {
      return error;
    }

  };

  static getUserByEmail = async (email: string, token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users?email=${email}`, createPayload(GET, token, null));
      const responseData = await response.json();

      return responseData;
    } catch (error) {
      return error;
    }
  };

  static updateUser = async (data: object, userId: string, token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users/${userId}`, createPayload(PUT, token, data));
      return response;
    } catch (error) {
      console.error('Error updating user in Keycloak:', error);
      return error;
    }
  };

  static deleteKeycloakUser = async (userId: string, token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users/${userId}`, createPayload(DELETE, token, null));
      return response;
    } catch (error) {
      return error;
    }
  };

  static resetUserPassword = async (id: string, data: string, token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users/${id}/reset-password`, createPayload(PUT, token, data));
      return response;
    } catch (error) {
      return error;
    }
  };

  static assignRole = async (data: Array<object>, userId: string, token: string) => {
    const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users/${userId}/role-mappings/clients/${idClient}`, createPayload(POST, token, data));
    return response;
  };
  // Moin 
  // this function get the default role in the ream management to assign the specific user wise
  static getRoleManage = async (token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/clients/${idRoleManagement}/roles`, createPayload(GET, token, null));
      return response;
    } catch (error) {
      return error;
    }
  };

  static assignDefaultRoleS = async (data: Array<object>, userId: string, token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users/${userId}/role-mappings/clients/${idRoleManagement}`, createPayload(POST, token, data));
      return response;
    } catch (error) {
      return error;
    }
  };

  static unassignRole = async (data: Array<object>, userId: string, token: string) => {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users/${userId}/role-mappings/clients/${idClient}`, createPayload(DELETE, token, data));

      return response;
    } catch (error) {
      return error;
    }

  };

  static async getAllAssignRole(userId: string, token: string) {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users/${userId}/role-mappings/clients/${idClient}`, createPayload(GET, token, null));
      return response;
    } catch (error) {
      return error;
    }
  }

  static async logoutUser(userId: string, token: string) {
    try {
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users/${userId}/logout`, createPayload(POST, token, null));
      return response;
    } catch (error) {
      return error;
    }
  }

  static assignDefaultRole = async (userId: string, token: string) => {
    try {
      const data = await this.getRoleByName(IRoles.STUDENT, token);
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users/${userId}/role-mappings/clients/${idClient}`, createPayload(POST, token, data));
      return response;
    } catch (error) {
      return error;
    }

  };

  static assignRoleByName = async (userId: string, name: string, token: string) => {
    try {
      const data = await this.getRoleByName(name, token);
      const response = await fetch(`${keycloakURL}/admin/realms/${keycloakRealm}/users/${userId}/role-mappings/clients/${idClient}`, createPayload(POST, token, data));
      return response;
    } catch (error) {
      return error;
    }

  };

  static updateToken = async (data: any) => {
    try {
      const response = await fetch(`${keycloakURL}/realms/${keycloakRealm}/protocol/openid-connect/token`, createPayload(POST, null, data));
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return error;
    }
  };

  static getClientToken = async () => {
    try {
      const body = {
        grant_type: 'client_credentials',
        client_id: keycloakClientId,
        client_secret: keycloakAdminClientSecret
      };
      const response = await fetch(`${keycloakURL}/realms/${keycloakRealm}/protocol/openid-connect/token`, createPayload(POST, null, body));
      const data = await response.json();

      return response.status === 200 ? data : null;
    } catch (error) {
      return error;
    }
  };
}
