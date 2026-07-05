import 'dotenv/config';
import express from 'express';
import userRouter from './routes/users.routes.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import urlsRouter from './routes/urls.routes.js';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authMiddleware);

app.get('/', (req, res) => {
    return res.json({status: "Servr is up and running..."});
});

app.use(urlsRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}...`);
});