import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            _id: false,
            product: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: { type: Number }
        }],
        default: []
    }
})

cartSchema.pre('findOne', function() {
    this.populate({
        path: 'products.product',
        match: {_id: {$ne: null}}
    })
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel