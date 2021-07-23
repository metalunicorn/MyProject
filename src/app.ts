import * as express  from 'express';
import * as cors  from   'cors';
import router from './routes/user';
import {notFound, productionErrors, developmentErrors} from './handlers/errorHadler';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/user', router);

if (process.env.ENV === 'DEVELOPMENT') {
  app.use(developmentErrors);
} else {
  app.use(productionErrors);
}

app.use(notFound);

export default app