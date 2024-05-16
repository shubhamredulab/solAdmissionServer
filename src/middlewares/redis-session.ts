/* eslint-disable max-len */
// // Importing the required modules and logger
import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import session from 'express-session';

import logger from '../utils/winston';

// const some = new RedisStore({ client: session });
// /*
//   Checking if required environment is present
// */
// // Checking if REDIS_HOST environment variable is defined
const redisHost = process.env.REDIS_HOST;
if (!redisHost) throw Error('Environment: REDIS_HOST is not defined');

// // Checking if REDIS_PORT environment variable is defined
const redisPort = process.env.REDIS_PORT;
if (!redisPort) throw Error('Environment: REDIS_PORT is not defined');

// // Checking if REDIS_SECRET environment variable is defined
const redisSecret = process.env.REDIS_SECRET;
if (!redisSecret) logger.warn('Environment: REDIS_SECRET is not defined, by default it will use weak secret');

// // Creating a Redis client instance
export const redisClient = new Redis({
  host: redisHost,
  port: Number(redisPort)
});

// // Creating a RedisStore using the Redis client
export const redisStore = new RedisStore({ client: redisClient });
// // Configuring the session middleware
const redisSession = session({
  store: redisStore,
  secret: process.env.REDIS_SECRET || 'your secret key',
  resave: false,
  saveUninitialized: false
});

export default redisSession;
