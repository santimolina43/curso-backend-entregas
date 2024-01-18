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
        this.post('/:cid/product/:pid', ["USER", "PREMIUM"], 'next', {}, addProductsToCartById)

        /********* DELETE PRODUCTS IN CARTS BY ID *********/    
        this.delete('/:cid/product/:pid', ["USER", "PREMIUM"], 'next', {}, deleteProductsFromCartById)
       
        /********* UPDATE CART BY ID *********/    
        this.put('/:cid', ["USER", "PREMIUM"], 'next', {}, updateCartById)
       
        /********* UPDATE CART BY ID AND PRODUCT ID *********/    
        this.put('/:cid/products/:pid', ["USER", "PREMIUM"], 'next', {}, updateCartByIdAndProductId)
       
        /********* DELETE ALL PRODUCTS IN CART BY ID *********/    
        this.delete('/:cid', ["USER", "PREMIUM"], 'next', {}, deleteAllProductsFromCartById)
        
        /********* FINISH PURCHASE IN CART BY ID *********/    
        this.post('/:cid/purchase/', ["USER", "PREMIUM"], 'next', {}, finishPurchaseInCartById)

        
        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* CARRITO *********/   
        this.get('/', ["USER", "PREMIUM"], 'next', {}, getUsersCartView)
        
        /********* PURCHASE *********/
        this.get('/view/:cid/purchase/:tid', ["USER", "PREMIUM"], 'next', {}, getTicketView)


    }
}
