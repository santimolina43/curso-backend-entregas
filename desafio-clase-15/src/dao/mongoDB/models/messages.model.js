
import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    user: { type: String, required: true },
    message: { type: String, required: true }
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel
