import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Listsubcategory document
interface IListSubcategory extends Document {
  category_id: mongoose.Types.ObjectId;
  subcategory_id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  status: number;
}

// Create the schema
const listSubcategorySchema: Schema = new Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Create the model
const Listsubcategory = mongoose.model<IListSubcategory>('Listsubcategory', listSubcategorySchema);

export default Listsubcategory;
