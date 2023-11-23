import RouterClass from '../router.js';
import { getProductFromCartById, createNewCart, addProductsToCartById, deleteProductsFromCartById, updateCartById, updateCartByIdAndProductId, deleteAllProductsFromCartById } from '../../controllers/cart.controller.js'
import { getUsersCartView } from '../../controllers/user.controller.js';
import { finishPurchaseInCartById, getTicketView } from '../../controllers/ticket.controller.js';

// Carts Router
export default class CartsRouter extends RouterClass {
    init() {

        /************************************/   
        /*************** API ****************/   
        /************************************/ 
        
        /********* GET PRODUCTS FROM CART BY ID *********/    
        this.get('/:cid', ["PUBLIC"], 'next', {}, getProductFromCartById)

        /********* POST CARTS *********/    
        this.post('/', ["PUBLIC"], 'next', {}, createNewCart)

        /********* POST PRODUCTS IN CARTS BY ID *********/    
        this.post('/:cid/product/:pid', ["USER"], 'next', {}, addProductsToCartById)

        /********* DELETE PRODUCTS IN CARTS BY ID *********/    
        this.delete('/:cid/product/:pid', ["USER"], 'next', {}, deleteProductsFromCartById)
       
        /********* UPDATE CART BY ID *********/    
        this.put('/:cid', ["USER"], 'next', {}, updateCartById)
       
        /********* UPDATE CART BY ID AND PRODUCT ID *********/    
        this.put('/:cid/products/:pid', ["USER"], 'next', {}, updateCartByIdAndProductId)
       
        /********* DELETE ALL PRODUCTS IN CART BY ID *********/    
        this.delete('/:cid', ["USER"], 'next', {}, deleteAllProductsFromCartById)
        
        /********* FINISH PURCHASE IN CART BY ID *********/    
        this.post('/:cid/purchase/', ["USER"], 'next', {}, finishPurchaseInCartById)

        
        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* CARRITO *********/   
        this.get('/', ["USER"], 'next', {}, getUsersCartView)
        
        /********* PURCHASE *********/
        this.get('/view/:cid/purchase/:tid', ["USER"], 'next', {}, getTicketView)


    }
}
