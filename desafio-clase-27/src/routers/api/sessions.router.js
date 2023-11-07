import Router from 'express'
import UserManager from '../../dao/mongoDB/UserManager.js'
import passport from "passport";
import RouterClass from '../router.js';
import jwt from 'jsonwebtoken';
import { loginRoutes } from '../../middlewares/auth.middleware.js'
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY } from '../../helpers/auth-helpers.js'

const userManager = new UserManager()

const sessionsRouter = Router()

// Sessions Router con login hardCodeado (No estamos aquí para validar cosas con el login, sino para practicar políticas).
export default class SessionsRouter extends RouterClass {
    init() {

        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* LOGIN *********/   
        this.get('/login', ["PUBLIC"], (req, res) => { //
            res.render('login', {})
        })

        /********* REGISTER *********/    
        this.get('/register', ["PUBLIC"], (req, res) => {
            res.render('register', {})
        })

        /************************************/   
        /*************** API ****************/   
        /************************************/ 

        /********* REGISTER *********/    
        this.post('/register', ["PUBLIC"], 'register',
            async (req, res) => {
                res.redirect('/session/login')
            }
        )
        // this.get('/failRegister', ["PUBLIC"], (req, res) => res.send({ error: 'Passport register failed' }))

        /********* LOGIN *********/    
        this.post('/login', ["PUBLIC"], 'login',
        async (req, res) => {
                console.log('llegue')
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
                    // Otras propiedades que desees incluir
                  };
                console.log('antes de generar el token de la cookie')
                let token = jwt.sign(userPayload, 'secret-jwt-santi', {expiresIn: '24h'}) 
                console.log('antes de generar la cookie')
                res.cookie(JWT_COOKIE_NAME, token, { signed: true }).sendSuccess('inicio de sesion exitoso')
            } 
        )

        /********* LOGOUT *********/    
        this.get('/logout', ["USER", "ADMIN", "PREMIUM"], (req, res) => {
            res.clearCookie(JWT_COOKIE_NAME).redirect('/')
        })

    }
}

/********* POST USERS *********/    
// sessionsRouter.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/failRegister'} ), async (req, res) => {
//     res.redirect('/login')
// })
// sessionsRouter.get('/failRegister', (req, res) => res.send({ error: 'Passport register failed' }))


/********* POST SESSION *********/    
// sessionsRouter.post('/login', passport.authenticate('login', {failureRedirect: '/login/failLogin'} ), async (req, res) => {
//     if (!req.user) {
//         return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
//     }
//     res.redirect('/products')
// })

/********* INICIO DE SESION CON GITHUB *********/ 
sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email']}), (req, res) => {

})
sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async(req, res) => {
    console.log('Callback: ', req.user)
    req.session.user = req.user
    res.redirect('/products')
})

// export default sessionsRouter
