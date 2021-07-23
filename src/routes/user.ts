import { Router } from 'express';
import { check, body } from 'express-validator';
import userController  from '../controllers/userControllers';


const router = Router();



router.post(
  '/register',
  [
    check('password', 'Password must be atleast 6 characters long.').isLength({
      min: 6,
    }),
    
    body('name').custom((value: string) => {
      const regRule = /^[A-Za-z0-9]+$/;
      // if (!(value.length > 3 && regRule.test(value))) {
      //   return false;
      // }
      return value.length > 3 && regRule.test(value);
    }),
  ],
  userController 
  );

export default router
