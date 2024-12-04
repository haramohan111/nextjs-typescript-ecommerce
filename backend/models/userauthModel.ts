import mongoose, { Document, Schema } from 'mongoose';

interface UserAuthDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  token: string;
  createdAt: Date;
}

const userSchema: Schema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    expires: '1m',
    default: Date.now,
  },
});

const UserAuth = mongoose.model<UserAuthDocument>('Userauth', userSchema);

export default UserAuth;
