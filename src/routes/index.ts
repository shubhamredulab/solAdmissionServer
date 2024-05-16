import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocuments from '../../src/swagger.json';
import user from './user';
import auth from './auth';
import keycloak from './keycloak.router';
import Payment from './payment';
import access from './access';
import education from './education';
import document from './document';
import preferences from './preferences';
import upload from './upload';
import university from './university';
import college from './college';
import course from './course';
import collegeCourse from './collegeCourse';
import faculty from './faculty';
import facultyPhd from './facultyPhd';
import department from './department';
import subjectGroup from './subjectGroup';
import subject from './subject';
import subjectPhd from './subjectPhd';

import activity from './activity';
import meritList from './meritlist';
import ticket from './ticket';
import notifications from './notification';
import admissionAction from './admissionAction';
import userCourseDetails from './userCourseDetails';
import excelDownload from './excelDownload';
import studentFeedback from './studentfeedback';
import phdedudedetails from './phdEduDetails';
import facultysubjet from './facultySubject';

const routes = Router();
const options = {
  explorer: true,
  swaggerOptions: {
    authAction: {
      JWT: {
        name: 'JWT',
        schema: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization'
        }
      }
    }
  }
};

routes.use('/user', user);
routes.use('/education', education);
routes.use('/documents', document);
routes.use('/action', admissionAction);
routes.use('/preferences', preferences);
routes.use('/auth', auth);
routes.use('/keycloak', keycloak);
routes.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocuments, options));
routes.use('/access', access);
routes.use('/upload', upload);
routes.use('/payment', Payment);
routes.use('/university', university);
routes.use('/college', college);
routes.use('/course', course);
routes.use('/collegeCourse', collegeCourse);
routes.use('/faculty', faculty);
routes.use('/facultyPhd', facultyPhd);
routes.use('/department', department);
routes.use('/subjectGroup', subjectGroup);
routes.use('/subject', subject);
routes.use('/subjectPhd', subjectPhd);
routes.use('/activity', activity);
routes.use('/course', collegeCourse);
routes.use('/meritList', meritList);
routes.use('/ticket', ticket);
routes.use('/notification', notifications);
routes.use('/userCourseDetails', userCourseDetails);
routes.use('/excelDownload', excelDownload);
routes.use('/studentfeedback', studentFeedback);
routes.use('/phdedudedetails', phdedudedetails);
routes.use('/facultysubjet', facultysubjet);
export { routes };