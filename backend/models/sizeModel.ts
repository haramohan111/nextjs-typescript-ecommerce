import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Size document
interface ISize extends Document {
  name: string;
  status: number;
}

// Create the schema
const sizeSchema: Schema = new Schema({
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
const Size = mongoose.model<ISize>('Size', sizeSchema);

export default Size;
