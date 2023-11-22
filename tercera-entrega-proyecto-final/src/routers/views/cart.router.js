import RouterClass from '../router.js';
import { getUsersCartView } from '../../controllers/user.controller.js';

export default class CartRouter extends RouterClass {
    init() {

        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* CARRITO *********/   
        this.get('/', ["USER", "ADMIN", "PREMIUM"], 'next', {}, getUsersCartView)
    }
}

