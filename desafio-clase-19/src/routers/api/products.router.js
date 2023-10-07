import Router from 'express'
import ProductManager from '../../dao/mongoDB/ProductManager.js'
import { socketServer } from '../../app.js'
import multer from 'multer'
import productModel from '../../dao/mongoDB/models/products.model.js'

const products = []

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'src/public/imgs/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }                              
})
const uploader = multer({storage})
const productsRouter = Router()

const productManager = new ProductManager()

/********* GET PRODUCTS *********/    
productsRouter.get('/', async (req, res) => {
    // Query params opcionales para limitar, elegir la pagina y ordenar los documentos
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    const sort = parseInt(req.query.sort)
    const filters = {limit: limit, page: page, sort: {price: sort}}
    // Query params opcionales para filtrar los documentos por categoria y stock mayor a 0
    const query = {};
    req.query.category ? (query.category = req.query.category) : null;
    req.query.stock ? (query.stock = { $gt: 0 }) : null;
    // Hago la consulta a la base de datos directamente desde el router y devuelvo error en caso de no haber respuesta
    const products = await productModel.paginate(query, filters)
    if (!products) return res.status(404).json({ status:"error", payload: 'No hay productos cargados'})
    // Armo una cadena de string con todos los queryparams menos la page
    let queryParams = ''
    queryParams = limit ? `${queryParams}&limit=${req.query.limit}` : queryParams
    queryParams = sort ? `${queryParams}&sort=${req.query.sort}` : queryParams
    queryParams = req.query.category ? `${queryParams}&category=${req.query.category}` : queryParams
    queryParams = req.query.stock ? `${queryParams}&stock=${req.query.stock}` : queryParams
    // Respondo la consulta con el formato solicitado
    res.status(200).json({ 
        status: "success", 
        payload: products.docs, 
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `http://localhost:8080/?page=${page - 1}${queryParams}` : null,
        nextLink: products.hasNextPage ? `http://localhost:8080/?page=${page + 1}${queryParams}` : null
    })
})

/********* GET PRODUCTS BY ID *********/    
productsRouter.get('/:pid', async (req, res) => {
    const id = req.params.pid
    const productoEncontrado = await productManager.getProductByID(id)
    if (!productoEncontrado._id) return res.status(404).json({ status:"error", payload: productoEncontrado})
    res.status(200).json({ status: "success", payload: productoEncontrado })
})

/********* POST PRODUCTS *********/    
productsRouter.post('/',  uploader.single('thumbnail'), async (req, res) => {
    req.body.status = req.body.status == 'true' ? true : false
    req.body.thumbnail = `http://localhost:8080/imgs/${req.file.filename}`
    try {
        const newProduct = await productManager.addProduct(req.body)
        if (!newProduct._id) return res.status(400).json({ status:"error", payload: newProduct})
        // Emito un evento de Socket.io para notificar a todos los clientes conectados sobre la adicion
        socketServer.emit('productsHistory', await productManager.getProducts())
        res.status(200).json({ status: "success", payload: newProduct })
    } catch (error) {
        return res.status(400).json({ status:"error", payload: '[ERR] Error al añadir el carrito'})
    }
})

/********* PUT PRODUCTS *********/    
productsRouter.put('/:pid', async (req, res) => {
    const id = req.params.pid
    const updatedProduct = await productManager.updateProduct(id, req.body)
    if (!updatedProduct._id) return res.status(404).json({ status:"error", payload: updatedProduct})
    // Emito un evento de Socket.io para notificar a todos los clientes conectados sobre la modificación
    socketServer.emit('productsHistory', await productManager.getProducts())
    res.status(200).json({status:'success', payload: updatedProduct})
})

/********* DELETE PRODUCTS *********/    
productsRouter.delete('/:pid', async (req, res) => {
    const id = req.params.pid
    const msgError = '[ERR] No existe ningun producto con ese id'
    const productDeletedMsg = await productManager.deleteProduct(id)
    if (productDeletedMsg === msgError) return res.status(404).json({status:'error', payload: productDeletedMsg})
    // Emito un evento de Socket.io para notificar a todos los clientes conectados sobre la eliminacion
    socketServer.emit('productsHistory', await productManager.getProducts())
    res.status(200).json({status: 'success', payload: productDeletedMsg})
})

export default productsRouter