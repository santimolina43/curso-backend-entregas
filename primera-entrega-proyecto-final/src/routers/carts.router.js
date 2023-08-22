import Router from 'express'
import ProductManager from '../entities/ProductManager.js'
import CartManager from '../entities/CartManager.js'

const cartManager = new CartManager('./data/carts.json')
const cartsRouter = Router()

/********* GET PRODUCTS FROM CART BY ID *********/    
cartsRouter.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid)
    const errorMsg = '[ERR] No se encontró ningun carrito con ese id';
    const productos = await cartManager.getCartProductsByID(id)
    if (productos == errorMsg) return res.status(404).json({ status:"error", payload: productos})
    res.status(200).json(productos)
})

/********* POST CARTS *********/    
cartsRouter.post('/', async (req, res) => {
    const newCart = await cartManager.addCart([])
    if (!newCart.id) return res.status(400).json({ status:"error", payload: newCart})
    res.status(200).json(newCart)
})

/********* POST CARTS BY ID *********/    
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid)
    const productId = parseInt(req.params.pid)
    const newCart = await cartManager.addCart(req.body)
    if (!newCart.id) return res.status(400).json({ status:"error", payload: newCart})
    res.status(200).json(newCart)
})

export default cartsRouter