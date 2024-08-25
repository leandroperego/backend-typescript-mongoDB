import express from 'express';
import cookieParser from 'cookie-parser';

import routes from './routes/routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

routes(app);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
