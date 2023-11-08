import RouterClass from '../router.js';

export default class RealTimeProductsRouter extends RouterClass {
    init() {

        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* REAL TIME PRODUCTS *********/   
        this.get('/', ["PUBLIC"], 'next', {}, (req, res) => {
            res.render('realTimeProducts', {})
        })
    }
}
