import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { routes as apiRoutes } from './routes';
import keycloak from './middlewares/keycloak';
import redisSession from './middlewares/redis-session';
import morganMiddleware from './middlewares/morgan';
import cors from 'cors';
import logger from './utils/winston';
import errorHandlingMiddleware from './middlewares/error-handler';
import { IApiErrors } from './types/error';
import path from 'path';
import {myUploadfiles} from '../src/utils/functions';
import { AccessServices } from '../src/services/AccessService';
import { initialDashboardData } from './utils/initialData';
import UserServices from './services/UserServices';
// const currentPath = process.cwd();
// const FILE_LOCATION = currentPath + "/src/";

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use(cors({ origin: '*', credentials: true })); // Enable Cors for browsers
app.use(redisSession);
myUploadfiles();
app.use(keycloak.middleware());
app.use(express.static(path.join(process.env.FILE_LOCATION as string, 'public')));
app.use('/api/uploads/', express.static(path.join(process.env.FILE_LOCATION as string, 'public/upload/')), (req: Request, res: Response) => {
  res.status(404).send(`<div style="text-align: center;"><h1>Server Error</h1></div>`);
});
app.get('/user',async (req: Request, res: Response) =>{
  const id=req.query.id as string
  const user = await UserServices.findBykeycloakUserId(id as string);
  console.log(user)
   res.send('Express + TypeScript Server')
  })
app.use('/api', apiRoutes);
app.get('/', (req: Request, res: Response) => res.send('Express + TypeScript Server')); // Health check
app.use(errorHandlingMiddleware); // Error handling middleware
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ status: 404, message: IApiErrors.NOT_FOUND });
}); // Not Found Middleware

AppDataSource.initialize().then(async () => {
  logger.info('Database connected successfully!!');
  await AccessServices.findOrCreateMany(initialDashboardData);
    app.listen(port, () => {
        return logger.info(`Express is listening at ${process.env.SERVER_URL}`);
    });
}).catch(error => logger.error(error));

export default app;
