import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Coupon document
interface ICoupon extends Document {
  coupon: string;
  coupontype: string;
  value: string;
  description: string;
  status: string;
}

// Create the schema
const couponSchema: Schema = new Schema({
  coupon: {
    type: String,
    required: true
  },
  coupontype: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create the model
const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);

export default Coupon;
