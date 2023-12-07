import CartService from '../services/cart.service.js'

const cartService = new CartService()

export const getProductFromCartById = async (req, res) => {
    const id = req.params.cid
    try {
        const cartFound = await cartService.getCartByID(id)
        res.status(200).json({ status: "success", payload: cartFound })
    } catch (error) {
        res.status(400).json({ status:"error", error: error})
    }
}

export const createNewCart = async (req, res) => {
    try {
        const newCart = await cartService.addCart([])
        res.status(200).json({ status: "success", payload: newCart })
    } catch (error) {
        res.status(400).json({ status:"error", error: error})
    }
}

export const addProductsToCartById = async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const quantity = req.body.quantity ? req.body.quantity : 1
    try {
        const updatedCart = await cartService.addProductToCart(cartId, productId, quantity, "inc")
        res.status(200).json({ status: "success", payload: updatedCart })
    } catch (error) {
        res.status(400).json({ status:"error", error: error})
    }
}

export const deleteProductsFromCartById = async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    try {
        const updatedCart = await cartService.deleteProductFromCart(cartId, productId)
        return res.status(200).json({ status: "success", payload: updatedCart })
    } catch (error) {
        res.status(400).json({ status:"error", error: error})
    }
}

export const updateCartById = async (req, res) => {
    // Obtengo el parametro del id del carrito y el array con los productos que quiero agregar desde el body de la request
    const id = req.params.cid
    const products = req.body.products
    try { 
        // Verifico que el carrito con ese id exista, y sino devuelvo error
        await cartService.getCartByID(id) 
        // Recorro el array de productos y los añado al carrito 
        for (const product of products) {
            await cartService.addProductToCart(id, product.product, product.quantity, "inc");
        }      
        // Devuelvo el producto actualizado
        const updatedCart = await cartService.getCartByID(id)
        res.status(200).json({ status: "success", payload: updatedCart })
    } 
    catch (error) {
        return res.status(404).json({ status:"error", payload: error})
    }
}

export const updateCartByIdAndProductId = async (req, res) => {
    // Obtengo el parametro del id del carrito y el array con los productos que quiero agregar desde el body de la request
    const cartID = req.params.cid
    const productID = req.params.pid
    const quantity = req.body.quantity
    try { 
        // Verifico que el carrito con ese id exista, y sino devuelvo error
        await cartService.getCartByID(cartID) 
        // Recorro el array de productos y los añado al carrito
        const updatedCart = await cartService.addProductToCart(cartID, productID, quantity, "set");
        // Devuelvo el producto actualizado
        res.status(200).json({ status: "success", payload: updatedCart })
    } catch (error) {
        return res.status(404).json({ status:"error", payload: error})
    }
}

export const deleteAllProductsFromCartById = async (req, res) => {
    const cartId = req.params.cid
    try { 
        await cartService.deleteAllProductsFromCartById(cartId)
        res.status(200).json({ status: "success", payload: await cartService.getCartByID(cartId) })
    } 
    catch (error) {
        return res.status(404).json({ status:"error", payload: error})
    }
}


