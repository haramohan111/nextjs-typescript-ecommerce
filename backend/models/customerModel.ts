import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Coupon document
interface ICustomer extends Document {
    email: string;
    mobile: string;
    name: string;
    address: string;
    addressopt: string;
    country: string;
    state: string;
    zip: string;
}

// Create the schema
const customerSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    addressopt: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    zip: {
        type: String
    }
}, { timestamps: true });

// Create the model
const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

export default Customer;
