import express, { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserProfile, verifyEmail, userVerifyID } from '../../controller/userController';
import { protect } from '../../middleware/authMiddleware';
import jwt, { JwtPayload } from 'jsonwebtoken';
import userModel from '../../models/userModel';
import { decrypt, encrypt } from '../../utils/cryptoUtils';
import Verify from '../../models/verifyModel';
import mongoose from 'mongoose';
import session from 'express-session';

interface CustomRequest extends Request {
  user?: any; // Modify this according to your user type
}
interface DecodedToken extends JwtPayload {
  id: string;
}
const router = express.Router();

router.post('/signup', (req: Request, res: Response, next: NextFunction) => registerUser(req, res, next));
router.post('/userlogin', (req: Request, res: Response, next: NextFunction) => loginUser(req, res, next));
router.get('/profile', protect, (req: Request, res: Response, next: NextFunction) => getUserProfile(req, res, next));

router.post('/userverifyid', (req: Request, res: Response, next: NextFunction) => userVerifyID(req, res,next));
router.post('/verify-email', (req: Request, res: Response, next: NextFunction) => verifyEmail(req, res, next));

router.post('/userrefresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  console.log("refreshToken", refreshToken);
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: string };
    if (!decoded) {
      res.status(401).send('Invalid refresh token');
    }

    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET!, {
      algorithm: 'HS256',
      expiresIn: '60s'
    });
    await userModel.updateOne({ _id: decoded.id }, { $set: { token: newAccessToken } });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).send('Invalid refresh token');
  }
});

router.post('/userverify', async (req: Request, res: Response) => {
  const cookieData = req.cookies.auth_token;
  try {
    if (cookieData) {
      const decoded = jwt.verify(cookieData, process.env.USER_TOKEN_SECRET!) as { id: string };
      if (decoded) {

        const userId = decoded.id;
        const user_sess_id = req.session.user_session_id;
        try {

          const decodeUser = await Verify.findOne({ user_id: userId });

          if (decodeUser) {
            console.log('true');
            res.status(200).send({ success: true, message: 'Session in',user:decodeUser });
          } else {
            console.log('false');
            res.status(200).send({ success: false, message: 'Session out' });
          }

        } catch (error: any) {
          console.log(error);
          res.status(400).send({ success: false, message: 'Invalid user ID' });
        }
      } else {

        res.status(200).send({ success: false, message: 'Session out' });
      }
    } else {
      res.status(200).send({ success: false, message: 'Session out' });
    }
  } catch (error: any) {
    res.status(400).send({ success: false, message: error });
  }
});

router.post('/userlogout', async (req: Request, res: Response) => {
  try {

    // req.session.destroy(err => {
    //   if (err) {
    //     return res.status(500).send('Could not log out.');
    //   }
    //   res.clearCookie('uid');
    //   res.status(200).send({ success: false, message: 'You have been Logged Out' });
    // });
    // console.log(req.session)
    const cookieData = req.cookies.uid;
    const user_sess_id = req.session.user_session_id;
    if (cookieData) {
      const decoded = jwt.verify(cookieData, process.env.ACCESS_TOKEN_SECRET!) as { id: string };
      const userId = decoded.id;
      const userDelete = await Verify.deleteOne({ user_id: userId, user_session_id: user_sess_id });
      console.log(userDelete);
      if (userDelete.acknowledged) {
        res.clearCookie('uid');
        res.status(200).send({ success: false, message: 'Session out' });
      }
    } else {
      res.clearCookie('uid');
      res.status(200).send({ success: false, message: 'Session out' });
    }
  } catch (error) {
    // res.status(400).send({ error: e, message: 'Logged out failed' });
    if (error instanceof Error) {

      console.error('Token has expired:', error);

    }
  }
});
export default router;
