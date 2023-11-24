import CartService from '../dao/services/cart.service.js'

const cartService = new CartService()

export const getProductFromCartById = async (req, res) => {
    const id = req.params.cid
    const cartFound = await cartService.getCartByID(id)
    if (!cartFound) return res.status(404).json({ status:"error", payload: 'No se encontró ningun carrito con ese id'}) 
    res.status(200).json({ status: "success", payload: cartFound })
}

export const createNewCart = async (req, res) => {
    const newCart = await cartService.addCart([])
    if (!newCart._id) return res.status(400).json({ status:"error", payload: newCart})
    res.status(200).json({ status: "success", payload: newCart })
}

export const addProductsToCartById = async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const quantity = req.body.quantity ? req.body.quantity : 1
    const updatedCart = await cartService.addProductToCart(cartId, productId, quantity, "inc")
    if (!updatedCart._id) return res.status(404).json({ status:"error", payload: updatedCart})
    res.status(200).json({ status: "success", payload: updatedCart })
}

export const deleteProductsFromCartById = async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const updatedCart = await cartService.deleteProductFromCart(cartId, productId)
    if (!updatedCart._id) return res.status(404).json({ status:"error", payload: updatedCart})
    res.status(200).json({ status: "success", payload: updatedCart })
}

export const updateCartById = async (req, res) => {
    // Obtengo el parametro del id del carrito y el array con los productos que quiero agregar desde el body de la request
    const id = req.params.cid
    const products = req.body.products
    // Verifico que el carrito con ese id exista, y sino devuelvo error
    try { await cartService.getCartByID(id) } 
    catch (error) {
        return res.status(404).json({ status:"error", payload: 'No se encontró ningun carrito con el id: '+id})
    }
    // Recorro el array de productos y los añado al carrito 
    for (const product of products) {
        const updatedCart = await cartService.addProductToCart(id, product.product, product.quantity, "inc");
        if (!updatedCart._id) return res.status(404).json({ status: "error", payload: updatedCart });
    }      
    // Devuelvo el producto actualizado
    const updatedCart = await cartService.getCartByID(id)
    res.status(200).json({ status: "success", payload: updatedCart })
}

export const updateCartByIdAndProductId = async (req, res) => {
    // Obtengo el parametro del id del carrito y el array con los productos que quiero agregar desde el body de la request
    const cartID = req.params.cid
    const productID = req.params.pid
    const quantity = req.body.quantity
    // Verifico que el carrito con ese id exista, y sino devuelvo error
    try { await cartService.getCartByID(cartID) } 
    catch (error) {
        return res.status(404).json({ status:"error", payload: 'No se encontró ningun carrito con el id: '+cartID})
    }
    // Recorro el array de productos y los añado al carrito 
    const updatedCart = await cartService.addProductToCart(cartID, productID, quantity, "set");
    if (!updatedCart._id) return res.status(404).json({ status: "error", payload: updatedCart });
    // Devuelvo el producto actualizado
    res.status(200).json({ status: "success", payload: updatedCart })
}

export const deleteAllProductsFromCartById = async (req, res) => {
    const cartId = req.params.cid
    try { 
        await cartService.deleteAllProductsFromCartById(cartId)
    } 
    catch (error) {
        return res.status(404).json({ status:"error", payload: 'No se encontró ningun carrito con el id: '+cartId})
    }
    res.status(200).json({ status: "success", payload: await cartService.getCartByID(cartId) })
}


