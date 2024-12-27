import { Router } from "express";
import {
  createTask,
  getPresignedUrl,
  getUserAllTasks,
  getUserTask,
  userSignIn,
  userSignUp,
} from "../controllers";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signin", userSignIn);

router.post("/signup", userSignUp);

router.use(authenticate);
router.get("/presigned", getPresignedUrl);

router.post("/task", createTask);

router.get("/task", getUserAllTasks);
router.get("/task/:id", getUserTask);

export { router as UserRouter };
