import Router from 'express'
import ProductManager from '../entities/ProductManager.js'
import { socketServer } from '../app.js'

const productManager = new ProductManager('./data/products.json')
const productsRouter = Router()

/********* GET PRODUCTS *********/    
productsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    if (!products) return res.status(404).json({ status:"error", payload: 'No hay productos cargados'})
    const limit = parseInt(req.query.limit)
    if (limit || limit===0) {
        let limitProducts = products.slice(0, limit).map(item => item)
        res.status(200).json({ status: "success", payload: limitProducts })
    } else {
        res.status(200).json({ status: "success", payload: products })
    }
})

/********* GET PRODUCTS BY ID *********/    
productsRouter.get('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const productoEncontrado = await productManager.getProductByID(id)
    if (!productoEncontrado.id) return res.status(404).json({ status:"error", payload: productoEncontrado})
    res.status(200).json({ status: "success", payload: productoEncontrado })
})

/********* POST PRODUCTS *********/    
productsRouter.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body)
    if (!newProduct.id) return res.status(400).json({ status:"error", payload: newProduct})
    // Emito un evento de Socket.io para notificar a todos los clientes conectados sobre la adicion
    socketServer.emit('history', await productManager.getProducts())
    res.status(200).json({ status: "success", payload: newProduct })
})

/********* PUT PRODUCTS *********/    
productsRouter.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const updatedProduct = await productManager.updateProduct(id, req.body)
    if (!updatedProduct.id) return res.status(404).json({ status:"error", payload: updatedProduct})
    res.status(200).json({status:'success', payload: updatedProduct})
})

/********* DELETE PRODUCTS *********/    
productsRouter.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const msgError = '[ERR] No existe ningun producto con ese id'
    const productDeletedMsg = await productManager.deleteProduct(id)
    if (productDeletedMsg === msgError) return res.status(404).json({status:'error', payload: productDeletedMsg})
    // Emito un evento de Socket.io para notificar a todos los clientes conectados sobre la eliminacion
    socketServer.emit('history', await productManager.getProducts())
    res.status(200).json({status: 'success', payload: productDeletedMsg})
})

export default productsRouter