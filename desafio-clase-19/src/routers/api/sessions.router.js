import Router from 'express'
import UserManager from '../../dao/mongoDB/UserManager.js'

const userManager = new UserManager()

const sessionsRouter = Router()

/********* POST USERS *********/    
sessionsRouter.post('/user', async (req, res) => {
    try {
        const newUser = await userManager.addUser(req.body)
        if (!newUser._id) return res.status(400).json({ status:"error", payload: newUser})
        res.status(200).json({ status: "success", payload: newUser })
    } catch (error) {
        return res.status(400).json({ status:"error", payload: '[ERR] Error al crear el usuario'})
    }
})

/********* POST SESSION *********/    
sessionsRouter.post('/', async (req, res) => {
    const loginEmail = req.body.email
    const loginPassword = req.body.password
    const role = loginEmail === 'adminCoder@coder.com' && loginPassword === 'adminCod3r123' 
                ? 'admin'
                : 'user'
    if (role === 'admin') {
        const adminUser = {
            email: loginEmail,
            role: role
        } 
        req.session.user = adminUser
        res.status(200).json({ status: "success", payload: adminUser })
    } else if (role === 'user') {
        try {
            const usuarioEncontrado = await userManager.getUserByEmail(loginEmail)
            if (!usuarioEncontrado._id) return res.status(404).json({ status:"error", payload: productoEncontrado})
            if (loginPassword !== usuarioEncontrado.password) return res.status(404).json({ status:"error", payload: '[ERR] Las contraseñas no coinciden'})
            const user = {
                email: loginEmail,
                role: role
            } 
            req.session.user = user
            res.status(200).json({ status: "success", payload: usuarioEncontrado })
        } catch (error) {
            return res.status(400).json({ status:"error", payload: '[ERR] Error al buscar el usuario'})
        }
    }
})

export default sessionsRouter