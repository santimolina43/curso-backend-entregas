import RouterClass from '../router.js';
import { login, githubCallback, logout, registerCallback, renderLogin, renderRegister } from '../../controllers/session.controller.js';

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

    }
}

