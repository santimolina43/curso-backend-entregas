import { Router } from 'express'
import { loginRoutes } from '../../middlewares/auth.middleware.js'

const loginRouter = Router()

/********* GET LOGIN VIEW *********/    
loginRouter.get('/', loginRoutes, (req, res) => {
    res.render('login', {})
})

/********* GET REGISTER VIEW *********/    
loginRouter.get('/register', loginRoutes, (req, res) => {
    res.render('register', {})
})

/********* GET LOGOUT *********/    
loginRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Logout error')
        return res.render('login')
    })
})

export default loginRouter