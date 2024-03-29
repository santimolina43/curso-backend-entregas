import { logger } from '../app.js';
import UserService from '../services/user.service.js';

const userService = new UserService()

/************************************/   
/************** VISTAS **************/   
/************************************/ 

export const getUsersProfileView = async (req, res) => {
    const sessionEmail = req.user.email
    if (sessionEmail === 'adminCoder@coder.com') {
        const user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: sessionEmail,
            age: req.user.age
        } 
        res.render('profile', user)
    } else {
        try {
            const usuarioEncontrado = await userService.getUserByEmail(sessionEmail)
            res.render('profile', usuarioEncontrado)
        } catch (error) {
            req.logger.error('user.controller.js - Error en getUsersProfileView: '+error)
            return res.status(400).json({ status:"error", payload: error})
        } 
    }   
}

export const getUsersCartView = async (req, res) => { 
    const sessionEmail = req.user.email
    if (sessionEmail === 'adminCoder@coder.com') res.status(404).json({ status:"error", payload: "admin doesn´t have a cart"})
    else {
        try {
            const usuarioEncontrado = await userService.getUserByEmail(sessionEmail)
            // if (!usuarioEncontrado._id) return res.status(404).json({ status:"error", payload: "error"})
            // Hago la peticion a la api de los carritos
            fetch(`http://localhost:8080/api/cart/${usuarioEncontrado.cart.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudo completar la solicitud.');
                    }
                    return response.json(); 
                })
                .then(cartProducts => {
                    res.render('cart',  {cart: cartProducts.payload} )
                })
                .catch(error => {
                    logger.error('Ocurrió un error:', error);
                });
        } catch (error) {
            req.logger.error('user.controller.js - Error en getUsersCartView: '+error)
            return res.status(400).json({ status:"error", payload: error})
        } 
    }
}

