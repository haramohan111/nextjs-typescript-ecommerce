import mongoose, { Document, Schema } from 'mongoose';

// Interface representing the Verification Token data
export interface IVerificationToken extends Document {
    user: mongoose.Types.ObjectId;  // Reference to the User model
    token: string;                   // The verification token itself
    expiresAt: Date;                 // Expiration date of the token
}

// Mongoose Schema for the Verification Token
const verificationTokenSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // This is a reference to the User model
            required: true
        },
        token: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true  // Adds createdAt and updatedAt fields automatically
    }
);

// Create and export the model
const VerificationToken = mongoose.model<IVerificationToken>('VerificationToken', verificationTokenSchema);

export default VerificationToken;
