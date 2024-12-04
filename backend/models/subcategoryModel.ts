import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Subcategory document
interface ISubcategory extends Document {
  category_id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  status: number;
}

// Create the schema
const subcategorySchema: Schema = new Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
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
}, {
  timestamps: true
});

// Create the model
const Subcategory = mongoose.model<ISubcategory>('Subcategory', subcategorySchema);

export default Subcategory;
