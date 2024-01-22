import RouterClass from '../router.js';
import { renderLogin, renderRegister, renderResetPassword, renderResetPasswordFinalStep } from '../../controllers/session.controller.js';

// Sessions Router
export default class SessionsRouter extends RouterClass {
    init() {

        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* LOGIN *********/   
        this.get('/login', ["PUBLIC"], 'next', {}, renderLogin)

        /********* REGISTER *********/    
        this.get('/register', ["PUBLIC"], 'next', {}, renderRegister)

        /********* RESET PASSWORD *********/    
        this.get('/resetpassword', ["PUBLIC"], 'next', {}, renderResetPassword)    

        /********* RESET PASSWORD FINAL STEP *********/    
        this.get('/resetpassword/:token', ["PUBLIC"], 'next', {}, renderResetPasswordFinalStep)   

    }
}

