import express from 'express';
import userRouter from './routes/users.routes.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authMiddleware);

app.get('/', (req, res) => {
    return res.json({status: "Servr is up and running..."});
});

app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}...`);
});