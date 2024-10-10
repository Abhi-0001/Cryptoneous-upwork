import  {Router} from 'express'
import {  userSignIn } from '../controllers';

const router = Router();

router.post('/signin', userSignIn);

export {router as UserRouter}