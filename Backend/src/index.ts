import express from 'express';
import dotenv from 'dotenv';
import { UserRouter } from './routes';


const app = express();
dotenv.config();

const PORT = 8000;

app.use('/api/v1/user', UserRouter)


app.listen(PORT, ()=>{
    console.log(`server is running at port: ${PORT}`);
})