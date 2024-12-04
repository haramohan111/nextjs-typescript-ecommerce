import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Cart document
interface ICart extends Document {
  user_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  cart_session_id: string;
  quantity: number;
  price: number;
}

// Create the schema
const cartSchema: Schema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  cart_session_id: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  status:{
    type:Number,
    default:1
  }
}, { timestamps: true });

// Create the model
const Cart = mongoose.model<ICart>('Cart', cartSchema);

export default Cart;
