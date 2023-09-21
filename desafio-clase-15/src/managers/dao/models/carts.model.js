import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    products: [
        {
            product: { type: Number },
            quantity: { type: Number }
        }
    ]
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel