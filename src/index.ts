import express from 'express';
import cookieParser from 'cookie-parser';

import Router from './webApi/routes/Router';
import Logger from './webApi/utils/middlewares/Logger';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(Logger.init);
Router.init(app);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
