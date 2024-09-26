import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';

import Logger from './webApi/utils/middlewares/Logger';
import Routes from './webApi/routes/Routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(Logger.init);
Routes.init(app);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
