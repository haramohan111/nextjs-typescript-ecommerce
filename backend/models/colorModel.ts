import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Color document
interface IColor extends Document {
  name: string;
  status: number;
}

// Create the schema
const colorSchema: Schema = new Schema({
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
const Color = mongoose.model<IColor>('Color', colorSchema);

export default Color;
