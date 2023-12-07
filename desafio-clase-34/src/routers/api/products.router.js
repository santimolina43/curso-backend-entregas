import RouterClass from '../router.js';
import { uploaderThumbnail } from '../../middlewares/multer-uploader.js'
import { addNewProduct, deleteProductById, getHomeProducts, getProducts, getProductsById, updateProductById } from '../../controllers/product.controller.js'

// Products Router
export default class ProductsRouter extends RouterClass {
    init() {

        /************************************/   
        /*************** API ****************/   
        /************************************/ 

        /********* GET PRODUCTS *********/    
        this.get('/', ["PUBLIC"], 'next', {}, getProducts)

        /********* GET PRODUCTS BY ID *********/    
        this.get('/:pid', ["PUBLIC"], 'next', {}, getProductsById)

        /********* POST PRODUCTS *********/    
        this.post('/', ["ADMIN"], 'next', {}, uploaderThumbnail, addNewProduct )

        /********* PUT PRODUCTS *********/    
        this.put('/:pid', ["ADMIN"], 'next', {}, updateProductById)
       
        /********* DELETE PRODUCTS *********/    
        this.delete('/:pid', ["ADMIN"], 'next', {}, deleteProductById)



        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* HOME *********/   
        this.get('/home', ["USER", "ADMIN", "PREMIUM"], 'jwt', {}, getHomeProducts)

    }
}
