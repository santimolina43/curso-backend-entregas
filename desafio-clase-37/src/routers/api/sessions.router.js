import RouterClass from '../router.js';
import { login, githubCallback, logout, registerCallback, renderLogin, renderRegister, renderResetPassword, resetPassword, renderResetPasswordFinalStep, resetPasswordFinalStep, changeUserRole } from '../../controllers/session.controller.js';

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

        /************************************/   
        /*************** API ****************/   
        /************************************/ 

        /********* REGISTER *********/    
        this.post('/register', ["PUBLIC"], 'register', {}, registerCallback)

        /********* LOGIN *********/    
        this.post('/login', ["PUBLIC"], 'login', {}, login)

        /********* GITHUB LOGIN *********/ 
        this.get('/github', ["PUBLIC"], 'github', { scope: ['user:email']})
        this.get('/githubcallback', ["PUBLIC"], 'github', { failureRedirect: '/session/login' }, githubCallback)

        /********* LOGOUT *********/    
        this.get('/logout', ["USER", "ADMIN", "PREMIUM"], 'next', {}, logout)

        /********* RESET PASSWORD *********/    
        this.post('/resetpassword', ["PUBLIC"], 'next', {}, resetPassword)

        /********* RESET PASSWORD FINAL STEP *********/    
        this.post('/resetpasswordfinalstep', ["PUBLIC"], 'next', {}, resetPasswordFinalStep)

        /********* CHANGE ROL USER-PREMIUM *********/    
        this.put('/users/premium/:uid', ["USER", "PREMIUM"], 'next', {}, changeUserRole)

    }
}

