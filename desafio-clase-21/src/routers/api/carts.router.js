import Router from 'express'
import CartManager from '../../dao/mongoDB/CartManager.js'
import cartModel from '../../dao/mongoDB/models/carts.model.js'

const cartManager = new CartManager()
const cartsRouter = Router()

/********* GET PRODUCTS FROM CART BY ID *********/    
cartsRouter.get('/:cid', async (req, res) => {
    const id = req.params.cid
    const cartFound = await cartModel.findOne({_id: id})
    if (!cartFound) return res.status(404).json({ status:"error", payload: '[ERR] No se encontró ningun carrito con ese id'}) 
    res.status(200).json({ status: "success", payload: cartFound })
    // const errorMsg = '[ERR] No se encontró ningun carrito con ese id';
    // const productos = await cartManager.getCartProductsByID(id)
    // if (productos == errorMsg) return res.status(404).json({ status:"error", payload: productos})
    // res.status(200).json({ status: "success", payload: productos })
})

/********* POST CARTS *********/    
cartsRouter.post('/', async (req, res) => {
    const newCart = await cartManager.addCart([])
    if (!newCart._id) return res.status(400).json({ status:"error", payload: newCart})
    res.status(200).json({ status: "success", payload: newCart })
})

/********* POST PRODUCTS IN CARTS BY ID *********/    
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const updatedCart = await cartManager.addProductToCart(cartId, productId, 1, "inc")
    if (!updatedCart._id) return res.status(404).json({ status:"error", payload: updatedCart})
    res.status(200).json({ status: "success", payload: updatedCart })
})

/********* DELETE PRODUCTS IN CARTS BY ID *********/    
cartsRouter.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const updatedCart = await cartManager.deleteProductFromCart(cartId, productId)
    if (!updatedCart._id) return res.status(404).json({ status:"error", payload: updatedCart})
    res.status(200).json({ status: "success", payload: updatedCart })
})

/********* UPDATE CART BY ID *********/    
cartsRouter.put('/:cid', async (req, res) => {
    // Obtengo el parametro del id del carrito y el array con los productos que quiero agregar desde el body de la request
    const id = req.params.cid
    const products = req.body.products
    // Verifico que el carrito con ese id exista, y sino devuelvo error
    try { await cartModel.findOne({_id: id}) } 
    catch (error) {
        return res.status(404).json({ status:"error", payload: '[ERR] No se encontró ningun carrito con el id: '+id})
    }
    // Recorro el array de productos y los añado al carrito 
    for (const product of products) {
        const updatedCart = await cartManager.addProductToCart(id, product.product, product.quantity, "inc");
        if (!updatedCart._id) return res.status(404).json({ status: "error", payload: updatedCart });
    }      
    // Devuelvo el producto actualizado
    const updatedCart = await cartModel.findOne({_id: id})
    res.status(200).json({ status: "success", payload: updatedCart })
})

/********* UPDATE CART BY ID AND PRODUCT ID *********/    
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    // Obtengo el parametro del id del carrito y el array con los productos que quiero agregar desde el body de la request
    const cartID = req.params.cid
    const productID = req.params.pid
    const quantity = req.body.quantity
    // Verifico que el carrito con ese id exista, y sino devuelvo error
    try { await cartModel.findOne({_id: cartID}) } 
    catch (error) {
        return res.status(404).json({ status:"error", payload: '[ERR] No se encontró ningun carrito con el id: '+cartID})
    }
    // Recorro el array de productos y los añado al carrito 
    const updatedCart = await cartManager.addProductToCart(cartID, productID, quantity, "set");
    if (!updatedCart._id) return res.status(404).json({ status: "error", payload: updatedCart });
    // Devuelvo el producto actualizado
    res.status(200).json({ status: "success", payload: updatedCart })
})

/********* DELETE ALL PRODUCTS IN CART BY ID *********/    
cartsRouter.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid
    try { 
        await cartModel.updateOne({_id: cartId},
                                  {$set: {'products': []}})
    } 
    catch (error) {
        return res.status(404).json({ status:"error", payload: '[ERR] No se encontró ningun carrito con el id: '+cartId})
    }
    res.status(200).json({ status: "success", payload: await cartManager.getCartByID(cartId) })
})

export default cartsRouter