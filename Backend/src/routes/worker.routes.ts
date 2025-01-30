import Router from "express";
import { getWorkerProfile, nextTask, submitPayout, submitTask, workerSignIn, workerSignUp } from "../controllers";
import { workerAuthentication } from "../middlewares/auth.middleware";

const router = Router();


router.post("/signin", workerSignIn);

router.post("/signup", workerSignUp);

router.use(workerAuthentication);


router.get('/profile', getWorkerProfile);
router.get('/nextTask', nextTask);
router.post('/submission', submitTask);

router.put('/payout', submitPayout)

export { router as WorkerRouter };
