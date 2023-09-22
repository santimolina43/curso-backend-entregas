import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: String },
            quantity: { type: Number }
        }
    ]
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel