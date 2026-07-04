import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.get('/', (req, res) => {
    return res.json({status: "Servr is up and running..."});
});

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}...`);
});