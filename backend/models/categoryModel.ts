import mongoose, { Schema, Document } from 'mongoose';

// Interface for Category
interface ICategory extends Document {
  name: string;
  status: number;
  slug: string;
}

// Create the category schema
const categorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true
  },
  status: {
    type: Number,
    required: [true, 'Status is required']
  },
  slug: {
    type: String,
    required: true
  }
}, { timestamps: true });

const categoryModel = mongoose.model<ICategory>('Category', categorySchema);
export default categoryModel;
