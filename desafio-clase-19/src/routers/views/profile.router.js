import { Router } from 'express'
import { privateRoutes, publicRoutes } from '../../middlewares/auth.middleware.js'
import UserManager from '../../dao/mongoDB/UserManager.js'

const userManager = new UserManager()

const profileRouter = Router()

/********* GET PROFILE VIEW *********/    
profileRouter.get('/', publicRoutes, async (req, res) => {
    const sessionEmail = req.session.user.email
    try {
        const usuarioEncontrado = await userManager.getUserByEmail(sessionEmail)
        if (!usuarioEncontrado._id) return res.status(404).json({ status:"error", payload: productoEncontrado})
        const user = {
            first_name: usuarioEncontrado.first_name,
            last_name: usuarioEncontrado.last_name,
            email: usuarioEncontrado.email,
            age: usuarioEncontrado.age
        } 
        res.render('profile', user)
    } catch (error) {
        return res.status(400).json({ status:"error", payload: '[ERR] Error al buscar el usuario'})
    } 
    
})

/********* GET PRIVATE ROUTE *********/    
profileRouter.get('/private', privateRoutes, (req, res) => {
    res.send('this is private')
})


export default profileRouter