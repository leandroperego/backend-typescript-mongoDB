import express from 'express';
import cookieParser from 'cookie-parser';

import routes from './routes/routes';
import Logger from './utils/middlewares/Logger';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(Logger.init);
routes(app);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
