import Keycloak from 'keycloak-connect';
import { redisStore } from './redis-session';
import checkEnvVariable from '../utils/checkEnvVariable ';

/*
  Checking if required environment is present
*/


const keycloakURL = checkEnvVariable('KEYCLOAK_URL');
const keycloakRealm = checkEnvVariable('KEYCLOAK_REALM');
const keycloakClientId = checkEnvVariable('KEYCLOAK_CLIENTID');
const keycloakPrivateKey = checkEnvVariable('KEYCLOAK_PRIVATE_KEY');
const keycloakPort = checkEnvVariable('KEYCLOAK_PORT');

const kcConfig = {
  clientId: keycloakClientId,
  bearerOnly: true,
  serverUrl: keycloakURL,
  realm: keycloakRealm,
  realmPublicKey: keycloakPrivateKey,
  'ssl-required': 'external',
  resource: keycloakClientId,
  'confidential-port': keycloakPort,
  'auth-server-url': keycloakURL
};

// const keycloak = new Keycloak({ store: memoryStore });
const keycloak = new Keycloak({ store: redisStore }, kcConfig);

export default keycloak;
