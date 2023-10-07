import Router from 'express'
import UserManager from '../../dao/mongoDB/UserManager.js'
import userModel from '../../dao/mongoDB/models/users.model.js'

const userManager = new UserManager()

const sessionsRouter = Router()

/********* POST USERS *********/    
sessionsRouter.post('/', async (req, res) => {
    try {
        console.log('aca llegue')
        console.log(req.body)
        // if (req.body.password !== req.body.confirmPassword) 
        //     return res.status(500).json({ status:"error", payload: '[ERR] Contraseñas diferentes'})
        // else {const user = {
        //     first_name: req.body.first_name,
        //     last_name: req.body.last_name,
        //     email: req.body.email,
        //     age: req.body.age,
        //     password: req.body.password
        // }}
        const newUser = await userManager.addUser(req.body)
        if (!newUser._id) return res.status(400).json({ status:"error", payload: newUser})
        res.status(200).json({ status: "success", payload: newUser })
    } catch (error) {
        return res.status(400).json({ status:"error", payload: '[ERR] Error al crear el usuario'})
    }
})

export default sessionsRouter