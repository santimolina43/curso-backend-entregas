import Router from 'express'
import CartManager from '../dao/mongoDB/CartManager.js'

const cartManager = new CartManager()
const cartsRouter = Router()

/********* GET PRODUCTS FROM CART BY ID *********/    
cartsRouter.get('/:cid', async (req, res) => {
    const id = req.params.cid
    const errorMsg = '[ERR] No se encontró ningun carrito con ese id';
    const productos = await cartManager.getCartProductsByID(id)
    if (productos == errorMsg) return res.status(404).json({ status:"error", payload: productos})
    res.status(200).json({ status: "success", payload: productos })
})

/********* POST CARTS *********/    
cartsRouter.post('/', async (req, res) => {
    const newCart = await cartManager.addCart([])
    if (!newCart._id) return res.status(400).json({ status:"error", payload: newCart})
    res.status(200).json({ status: "success", payload: newCart })
})

/********* POST PRODUCTS IN CARTS BY IDS *********/    
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const updatedCart = await cartManager.addProductToCart(cartId, productId)
    if (!updatedCart._id) return res.status(404).json({ status:"error", payload: updatedCart})
    res.status(200).json({ status: "success", payload: updatedCart })
})

export default cartsRouter