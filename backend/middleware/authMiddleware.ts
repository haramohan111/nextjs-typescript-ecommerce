import jwt, { JwtPayload } from 'jsonwebtoken';
import userModel from '../models/userModel';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

interface DecodedToken extends JwtPayload {
  id: string;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as DecodedToken;

      const decodeUser = await userModel.findById(decode.id).select('-password');
      if (decodeUser) {
        const user = await userModel.findOne({ token: token }).select('-password');
        if (user) {
          next();
        } else {
          res.status(401).send('Not Authorized, Token expired');
        }
      }
    } catch (error) {
      res.status(401).send({
        success: false,
        message: 'Not Authorized, Token failed',
      });
    }
  }

  if (!token) {
    res.status(401).send('Not Authorized, no token');
  }
});
