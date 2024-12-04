import mongoose, { Schema, Document } from 'mongoose';

interface Category {
  _id: mongoose.Types.ObjectId;
  name: string;
}

interface Subcategory {
  _id:mongoose.Types.ObjectId;
  name: string;
}

// Define the interface for Review document
interface IReview extends Document {
  name: string;
  rating: number;
  comment: string;
}

// Create the schema for reviews
const reviewSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Define the interface for Product document
interface IProduct extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  image: string;
  brand: string;
  size: string;
  color: string;
  seller: string;
  category_id: mongoose.Types.ObjectId | Category;
  subcategory_id: mongoose.Types.ObjectId | Subcategory;
  listsubcategory_id: mongoose.Types.ObjectId;
  description: string;
  reviews: IReview[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  status:number;
  tags:string;
}

// Create the schema for products
const productSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  seller: {
    type: String,
    required: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  subcategory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true
  },
  listsubcategory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listsubcategory",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,

  },
  numReviews: {
    type: Number,
  
  },
  price: {
    type: Number,
    required: true
  },
  countInStock: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Create the model
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
