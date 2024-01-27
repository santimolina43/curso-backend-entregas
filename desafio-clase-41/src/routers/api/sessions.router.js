import RouterClass from '../router.js';
import { login, githubCallback, logout, registerCallback, resetPassword, resetPasswordFinalStep, changeUserRole, deleteUser, getUser, current } from '../../controllers/session.controller.js';

// Sessions Router
export default class SessionsRouter extends RouterClass {
    init() {

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

        /********* DELETE USER *********/    
        this.delete('/:uid', ["USER", "ADMIN", "PREMIUM"], 'next', {}, deleteUser)

        /********* GET USER *********/    
        this.get('/current', ["USER", "ADMIN", "PREMIUM"], 'next', {}, current)
        
        /********* GET USER *********/    
        this.get('/:uid', ["USER", "ADMIN", "PREMIUM"], 'next', {}, getUser)

    }
}

