import express from 'express';
import cookieParser from 'cookie-parser';

import routes from './webApi/routes/routes';
import Logger from './webApi/utils/middlewares/Logger';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(Logger.init);
routes(app);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
