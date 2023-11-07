import { Router } from 'express'
import { JWT_COOKIE_NAME } from '../../helpers/auth-helpers.js'
import { loginRoutes } from '../../middlewares/auth.middleware.js'

const loginRouter = Router()

/********* GET LOGIN VIEW *********/    
// loginRouter.get('/', loginRoutes, (req, res) => { //
//     res.render('login', {})
// })

/********* GET REGISTER VIEW *********/    
// loginRouter.get('/register', loginRoutes, (req, res) => {
//     res.render('register', {})
// })

/********* GET LOGOUT *********/    
// loginRouter.get('/logout', (req, res) => {
//     console.log(req.signedCookies)
//     res.clearSignedCookie(JWT_COOKIE_NAME).redirect('/login')
//     // req.session.destroy(err => {
//     //     if (err) return res.send('Logout error')
//     //     return res.render('login')
//     // })
// })

/********* GET LOGIN ERROR *********/    
// loginRouter.get('/failLogin', (req, res) => res.send({ error: 'Passport login failed' }))

export default loginRouter