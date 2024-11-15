import express from 'express';
import dotenv from 'dotenv';
import { UserRouter } from './routes';

const PORT = 8000;


const app = express();
dotenv.config();
app.use(express.json())

app.use('/api/v1/user', UserRouter)

console.clear();

app.listen(PORT, ()=>{
    console.log(`server is running at port: ${PORT}`);
})