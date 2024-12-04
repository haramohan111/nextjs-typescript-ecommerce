import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id:string;
    name:string;
    email:string;
    mobile:string;
    password:string;
    status:number;
    isAdmin:boolean;
    token:string;
    expireAt:Date;
    matchPassword(enteredPassword: string): Promise<string>;
}

const userSchema:Schema<IUser> = new Schema({
    "name": {
        type: String,
        required: [true, "Name is required"]
    },
    "email": {
        type: String
    },
    "mobile": {
        type: String,
        required: [true, "Mobile is required"]
    },
    "password": {
        type: String,
        required: [true, "Password"]
    },
    "status": {
        type: Number
    },
    "isAdmin": {
        type: Boolean,
        required: true,
        default: false
    },
    "token":{
        type:String,
     },

    // expireAt: {
    //     type: Date,
    //     default: () => Date.now(),
    //     index: { expires: '60s' }
    // }
}, { timestamps: true })

// Hashing the password before saving the document
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredpassword:string) {

if (!this.password) {
    throw new Error('Password is undefined');
}
    if (enteredpassword) {
        return await bcrypt.compare(enteredpassword, this.password)
    }

}

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;