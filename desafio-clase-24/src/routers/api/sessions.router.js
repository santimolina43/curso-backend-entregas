import RouterClass from '../router.js';
import jwt from 'jsonwebtoken';
// import { loginRoutes } from '../../middlewares/auth.middleware.js'
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY } from '../../middlewares/auth-helpers.js'

// Sessions Router
export default class SessionsRouter extends RouterClass {
    init() {

        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* LOGIN *********/   
        this.get('/login', ["PUBLIC"], 'next', {}, (req, res) => { 
            res.render('login', {})
        })

        /********* REGISTER *********/    
        this.get('/register', ["PUBLIC"], 'next', {}, (req, res) => {
            res.render('register', {})
        })

        /************************************/   
        /*************** API ****************/   
        /************************************/ 

        /********* REGISTER *********/    
        this.post('/register', ["PUBLIC"], 'register', {}, async (req, res) => {
                res.redirect('/session/login')
            }
        )
        // this.get('/failRegister', ["PUBLIC"], (req, res) => res.send({ error: 'Passport register failed' }))

        /********* LOGIN *********/    
        this.post('/login', ["PUBLIC"], 'login', {}, async (req, res) => {
            if (!req.user) {
                return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
            }
            const userPayload = {
                _id: req.user._id,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                cart: req.user.cart,
                role: req.user.role
                };
            let token = jwt.sign(userPayload, 'secret-jwt-santi', {expiresIn: '24h'}) 
            res.cookie(JWT_COOKIE_NAME, token, { signed: true }).sendSuccess('inicio de sesion exitoso')
        })

        /********* GITHUB LOGIN *********/ 
        this.get('/github', ["PUBLIC"], 'github', { scope: ['user:email']}, async (req, res) => {

        })
        this.get('/githubcallback', ["PUBLIC"], 'github', { failureRedirect: '/session/login' }, async(req, res) => {
            if (!req.user) {
                return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
            }
            const userPayload = {
                _id: req.user._id,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                cart: req.user.cart,
                role: req.user.role
              };
            let token = jwt.sign(userPayload, 'secret-jwt-santi', {expiresIn: '24h'}) 
            res.cookie(JWT_COOKIE_NAME, token, { signed: true }).redirect('/products')
        })

        /********* LOGOUT *********/    
        this.get('/logout', ["USER", "ADMIN", "PREMIUM"], 'next', {}, (req, res) => {
            res.clearCookie(JWT_COOKIE_NAME).redirect('/')
        })

    }
}

