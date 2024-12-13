import  {Router} from 'express'
import { getPresignedUrl, userSignIn, userSignUp } from '../controllers';
import { authenticate } from '../middlewares/auth.middleware';


const router = Router();

router.post('/signin', userSignIn);

router.post('/signup', userSignUp); 

router.get('/presigned', authenticate, getPresignedUrl);


export {router as UserRouter}