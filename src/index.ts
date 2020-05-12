import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import { createConnection } from 'typeorm';
import routes from './routes/index';

createConnection().then(async (connection) => {
    const app = express();

    // midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    app.use("/", routes);

    app.set('env', process.env.APP_ENV);
    app.listen(3001, () => console.log('>>> LISTENING <<<'));
}).catch(error => {
    console.log(error)
});