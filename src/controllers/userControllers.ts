import { validationResult } from 'express-validator';
import * as jwt  from 'jsonwebtoken';
import  {sha256}   from 'js-sha256';
import {admin,reg,findUser} from './serviceLayer';
import {Request,Response}  from 'express';



const userControllers = async function userAuthController(req: Request, res: Response) {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data',
      });
    }
    const admin2 = await admin();
    
    const { name, password } = req.body;

    const user = await findUser(name);
    
    if (user) {
      if (user.password !== sha256(password + process.env.SALT)) {
        return res.status(400).json({
          message: 'Invalid Password',
        });
      }

      const token = jwt.sign(
        { id: user.id, admin: user.admin, name: user.name },
        process.env.SECRET
      );

      return res.json({
        message: 'User logged in succsessul',
        token,
      });
    }

    const token = await reg(name,admin2, password);
    res.json({
      token,
      message: `User ${name} register`,
    });
  } catch (error) {
    res.status(500).json({
      errors: error,
      message: 'Password invalid.',
    });
  }
};
export default userControllers;
