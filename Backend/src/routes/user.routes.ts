import  {Router} from 'express'
import { userSignIn, userSignUp } from '../controllers';


const router = Router();

router.post('/signin', userSignIn);

router.post('/signup', userSignUp);

export {router as UserRouter}