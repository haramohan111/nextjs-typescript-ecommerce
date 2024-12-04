// models/Wishlist.ts
import mongoose, { Schema, Document, Model } from 'mongoose';



// Define the Wishlist interface for the model
export interface WishlistDocument extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
}

// Create the schema for the Wishlist model
const WishlistSchema: Schema = new Schema<WishlistDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },

});

// Define and export the Wishlist model
const Wishlist: Model<WishlistDocument> = mongoose.model<WishlistDocument>('Wishlist', WishlistSchema);
export default Wishlist;
