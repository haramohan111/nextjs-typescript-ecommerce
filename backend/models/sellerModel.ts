import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Seller document
interface ISeller extends Document {
  name: string;
  status: number;
}

// Create the schema
const sellerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  }
});

// Create the model
const Seller = mongoose.model<ISeller>('Seller', sellerSchema);

export default Seller;
