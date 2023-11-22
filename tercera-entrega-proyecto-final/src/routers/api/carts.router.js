import Router from 'express'
import { getProductFromCartById, createNewCart, addProductsToCartById, deleteProductsFromCartById, updateCartById, updateCartByIdAndProductId, deleteAllProductsFromCartById } from '../../controllers/cart.controller.js'

const cartsRouter = Router()

/********* GET PRODUCTS FROM CART BY ID *********/    
cartsRouter.get('/:cid', getProductFromCartById)

/********* POST CARTS *********/    
cartsRouter.post('/', createNewCart)

/********* POST PRODUCTS IN CARTS BY ID *********/    
cartsRouter.post('/:cid/product/:pid', addProductsToCartById)

/********* DELETE PRODUCTS IN CARTS BY ID *********/    
cartsRouter.delete('/:cid/product/:pid', deleteProductsFromCartById)

/********* UPDATE CART BY ID *********/    
cartsRouter.put('/:cid', updateCartById)

/********* UPDATE CART BY ID AND PRODUCT ID *********/    
cartsRouter.put('/:cid/products/:pid', updateCartByIdAndProductId)

/********* DELETE ALL PRODUCTS IN CART BY ID *********/    
cartsRouter.delete('/:cid', deleteAllProductsFromCartById)

export default cartsRouter