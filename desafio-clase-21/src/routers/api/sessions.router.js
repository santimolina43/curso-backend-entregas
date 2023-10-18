import Router from 'express'
import UserManager from '../../dao/mongoDB/UserManager.js'
import passport from "passport";

const userManager = new UserManager()

const sessionsRouter = Router()

/********* POST USERS *********/    
sessionsRouter.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/failRegister'} ), async (req, res) => {
    res.redirect('/login')
})
sessionsRouter.get('/failRegister', (req, res) => res.send({ error: 'Passport register failed' }))


/********* POST SESSION *********/    
sessionsRouter.post('/login', passport.authenticate('login', {failureRedirect: '/login/failLogin'} ), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
    }
    res.redirect('/products')
})

/********* INICIO DE SESION CON GITHUB *********/ 
sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email']}), (req, res) => {

})
sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async(req, res) => {
    console.log('Callback: ', req.user)
    req.session.user = req.user
    res.redirect('/products')
})

export default sessionsRouter
