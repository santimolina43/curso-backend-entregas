import mongoose from 'mongoose';

const userCollection = 'users'; 

const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: { type: String, unique: true },
    password: { type: String }
})

export const userModel = mongoose.model(userCollection, userSchema)