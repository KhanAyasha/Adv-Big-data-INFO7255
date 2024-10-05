// app.js
import express from 'express';
import "dotenv/config";
import dbConfig from "./config/database.js";
import planRouter from './routes/plan-route.js';

const app = express();
app.use(express.json());

const { HOSTNAME, PORT } = dbConfig;

app.use('/plans',planRouter);
app.all('*',(req, res) =>{
    res.status(404).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on @ http://${HOSTNAME}:${PORT}`);
});
