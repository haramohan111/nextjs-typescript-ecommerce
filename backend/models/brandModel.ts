import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Brand document
interface IBrand extends Document {
  name: string;
  status: number;
}

// Create the schema
const brandSchema: Schema = new Schema({
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
const Brand = mongoose.model<IBrand>('Brand', brandSchema);

export default Brand;
