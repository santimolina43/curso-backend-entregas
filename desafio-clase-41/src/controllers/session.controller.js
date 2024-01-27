import jwt from 'jsonwebtoken';
import { env_parameters_obj } from '../config/env.config.js';
import { logger } from '../app.js';
import UserService from '../services/user.service.js';
import UserPasswordService from '../services/userPassword.service.js';
import { sendResetPasswordEmail } from '../utils/resetPasswordEmail.js';
import { createHash, generateToken, isValidPassword } from '../middlewares/auth-helpers.js'

const userService = new UserService()
const userPasswordService = new UserPasswordService()

export const renderLogin = (req, res) => { 
    res.render('login', {})
}

export const renderRegister = (req, res) => {
    res.render('register', {})
}

export const renderResetPassword = (req, res) => {
    res.render('resetPassword', {})
}

export const renderResetPasswordFinalStep = async (req, res) => {
    try {
        const token = req.params.token
        const userFound = await userPasswordService.getUserByField('token', token)
        // si el usuario no es encontrado, probablemente el token expiró, por eso lo redirijo al usuario a la
        // vista en donde podrá enviar nuevamente un email a su cuenta para reestablecer la contraseña
        if (!userFound) {
            logger.error('session.controller.js - Error en renderResetPasswordFinalStep: El token a expirado o es erroneo. Por favor intente nuevamente')
            return res.status(400).render('resetPassword')
        }   
        res.render('resetPasswordFinalStep', userFound)
    } catch (error) {
        logger.error('session.controller.js - Error en renderResetPasswordFinalStep: '+error)
        return res.status(400).json({ status:"error", error: error})
    }
}

export const registerCallback = async (req, res) => {
    try{
        // const userFound = await userService.getUserByIDToBack(req.user._id)
        res.status(200).json({ status:"success", payload: req.user})
    } catch (error) {
        logger.error('session.controller.js - Error en registerCallback: '+error)
        return res.status(400).json({ status:"error", error: error})
    }
}

export const login = async (req, res) => {
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
    res.cookie(env_parameters_obj.jwt.jwtCookieName, token, { signed: true }).sendSuccess('inicio de sesion exitoso')
}

export const githubCallback = async(req, res) => {
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
    res.cookie(env_parameters_obj.jwt.jwtCookieName, token, { signed: true }).redirect('/')
}

export const logout = (req, res) => {
    res.clearCookie(env_parameters_obj.jwt.jwtCookieName).redirect('/')
}

export const resetPassword = async (req, res) => {
    try {
        const userToReset = req.body.email
        logger.info('session.controller.js - req.body.email: '+userToReset)
        const user = await userService.getUserByEmailToBack(userToReset)
        if (!user) {
            logger.info('session.controller.js - El usuario al que quiere cambiar la contraseña no existe')
            logger.error('session.controller.js - User not found')
            return res.status(404).json({ status:"error", payload: 'No existe ningun usuario con ese email'})
        }
        logger.info('session.controller.js - usuario encontrado')
        logger.info('session.controller.js - generamos el token para el reseteo de contraseña')
        const token = generateToken(userToReset);
        logger.info('session.controller.js - creamos el registro de reseteo en la base de datos')
        const newUserToReset = await userPasswordService.addUserToReset(userToReset, token)
        logger.info('session.controller.js - Envio el email de reseteo de contraseña al usuario')
        await sendResetPasswordEmail(userToReset, token)
        return res.status(200).json({ status: "success", payload: req.body.email })
    } catch (error) {
        logger.error('session.controller.js - Error en resetPassword: '+error)
        return res.status(400).json({ status:"error", error: error})
    }
}

export const resetPasswordFinalStep = async (req, res) => {
    try {
        const email = req.body.email
        const newPassword = req.body.password
        // Obtengo el usuario de la base de datos y valido que la nueva contraseña sea distinta
        logger.info('session.controller.js - Obtengo el usuario de la base de datos y valido que la nueva contraseña sea distinta')
        const user = await userService.getUserByEmailToBack(email)
        if (isValidPassword(user, newPassword)) return res.status(404).json({ status:"error", payload: 'Debes usar una contraseña distinta a la contraseña actual'})
        // Actualizo la contraseña del usuario
        logger.info('session.controller.js - Actualizo la contraseña del usuario')
        const updatedUser = await userService.updateUserPassword(email, newPassword)
        // Elimino el registro de reseteo de usuario de la base de datos
        logger.info('session.controller.js - Elimino el registro de reseteo de usuario de la base de datos')
        await userPasswordService.deleteUser(updatedUser.email)
        return res.status(200).json({ status: "success", payload: updatedUser })
    } catch (error) {
        logger.error('session.controller.js - Error en resetPasswordFinalStep: '+error)
        return res.status(400).json({ status:"error", error: error})
    }
}

export const changeUserRole = async (req, res) => {
    try {
        const userId = req.params.uid
        const userToUpdate = await userService.getUserByIDToBack(userId)
        if (!userToUpdate) return res.status(400).json({ status:"error", error: 'user no encontrado'})
        if (userToUpdate.role.toUpperCase() === "PREMIUM") {
            const updatedUser = await userService.updateUserRole(userToUpdate.email, "user")
            return res.status(200).json({ status: "success", payload: updatedUser })
        } else if (userToUpdate.role.toUpperCase() === "USER") {
            const updatedUser = await userService.updateUserRole(userToUpdate.email, "premium")
            return res.status(200).json({ status: "success", payload: updatedUser })
        }
    } catch (error) {
        logger.error('session.controller.js - Error en changeUserRole: '+error)
        return res.status(400).json({ status:"error", error: error})
    }
}

export const deleteUser = async (req, res) => {
    try {
        logger.info('session.controller.js - deleteUser - Start')
        const userId = req.params.uid
        const userLogged = req.user
        if (userLogged._id !== userId && req.user.role.toUpperCase() !== "ADMIN") return res.status(400).json({ status:"error", error: 'No estas autorizado para eliminar este usuario'})
        logger.info('session.controller.js - deleteUser - Deleting user')
        const userToDelete = await userService.deleteUser(userId)
        if (userToDelete !== 'Usuario eliminado correctamente') return res.status(400).json({ status:"error", error: 'No ha sido posible eliminar el usuario'})
        logger.info(`session.controller.js - deleteUser - ${userToDelete}`)
        return res.status(200).json({ status: "success", message: userToDelete })
    } catch (error) {
        logger.error('session.controller.js - Error en deleteUser: '+error)
        return res.status(400).json({ status:"error", error: error})
    }
}

export const getUser = async (req, res) => {
    try {
        logger.info('session.controller.js - getUser - Start')
        const userId = req.params.uid
        const userLogged = req.user
        if (userLogged._id !== userId && req.user.role.toUpperCase() !== "ADMIN") return res.status(400).json({ status:"error", error: 'No estas autorizado para buscar este usuario'})
        const userToGet = await userService.getUserByIDToBack(userId)
        return res.status(200).json({ status: "success", payload: userToGet })
    } catch (error) {
        logger.error('session.controller.js - Error en getUser: '+error)
        return res.status(401).json({ status:"error", error: error})
    }
}

export const current = async(req,res) =>{
    const token = req.signedCookies[env_parameters_obj.jwt.jwtCookieName]
    let user = jwt.verify(token, env_parameters_obj.jwt.jwtPrivateKey) // verifico que el token tenga bien la palabra secreta de firma
    if(user) return res.status(200).send({status:"success",payload:user})
    else return res.status(401).send({status:"Error", errorMsg: 'No user logged'})
}