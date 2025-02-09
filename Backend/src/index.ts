import express from "express";
import dotenv from "dotenv";
import { UserRouter, WorkerRouter } from "./routes";
import cors from "cors";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/worker", WorkerRouter);

console.clear();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});
