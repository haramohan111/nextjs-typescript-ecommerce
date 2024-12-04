import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import { generateAccessToken, generateRefreshToken, generateVerifyAdminToken } from '../utils/generateToken';
import { hashPassword } from '../helpers/authHelper';
import { createHashedPassword } from '../utils/generatePassword';
import Verify from '../models/verifyModel';
import { serialize } from 'cookie';

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email }) as IUser;

  if (admin && await admin.matchPassword(password)) {
    

    const accessToken = generateAccessToken(admin._id.toString());
    const refreshToken = generateRefreshToken(admin._id.toString());
    const uid = admin._id.toString();
    req.session.adminId = uid;
    //console.log(req.session);
    const user = await User.updateOne({ _id: admin._id }, { $set: { token: accessToken } });
    const verify = await Verify.findOne({user_id:admin._id});
    let verifyuser;
    if(!verify){
    verifyuser = await Verify.create({user_id: admin._id,token: accessToken  });
    }
    const encryptedData = generateVerifyAdminToken(admin._id.toString());
    res.cookie('uaid', encryptedData,{ maxAge: 24 * 60 * 1000, httpOnly: false})
    res.status(200).send({
      success: true,
      message: "login successfully",
      accessToken,
      refreshToken
    });
  } else {
    res.status(401).json({
      success: false,
      message: "unauthorized user",
    });
  }
}
