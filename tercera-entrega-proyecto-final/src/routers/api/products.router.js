import Router from 'express'
import { uploader } from '../../middlewares/multer-uploader.js'
import { addNewProduct, deleteProductById, getProducts, getProductsById, updateProductById } from '../../controllers/product.controller.js'

const productsRouter = Router()

/********* GET PRODUCTS *********/    
productsRouter.get('/', getProducts)

/********* GET PRODUCTS BY ID *********/    
productsRouter.get('/:pid', getProductsById)

/********* POST PRODUCTS *********/    
productsRouter.post('/',  uploader.single('thumbnail'), addNewProduct)

/********* PUT PRODUCTS *********/    
productsRouter.put('/:pid', updateProductById)

/********* DELETE PRODUCTS *********/    
productsRouter.delete('/:pid', deleteProductById)

export default productsRouter