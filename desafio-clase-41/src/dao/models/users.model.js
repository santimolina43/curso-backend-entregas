import mongoose from 'mongoose';

export const userCollection = 'users'; 

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts", required: true },
    role: { type: String, enum: ['user', 'admin', 'premium'], default: 'user' }
})

export const usersModel = mongoose.model(userCollection, userSchema)
