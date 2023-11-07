import { Router } from 'express'
// import { session } from 'passport';
import { publicRoutes } from '../../middlewares/auth.middleware.js';
import UserManager from '../../dao/mongoDB/UserManager.js';

const userManager = new UserManager()
const cartRouter = Router()
// const user = {}

cartRouter.get('/', publicRoutes, async (req, res) => { 
    const sessionEmail = req.user.email
    if (sessionEmail === 'adminCoder@coder.com') res.status(404).json({ status:"error", payload: "admin doesn´t have a cart"})
    else {
        try {
            const usuarioEncontrado = await userManager.getUserByEmail(sessionEmail)
            if (!usuarioEncontrado._id) return res.status(404).json({ status:"error", payload: "error"})
            // Hago la peticion a la api de los carritos
            fetch(`http://localhost:8080/api/carts/${usuarioEncontrado.cart.toString()}`, {
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
                    res.render('cart',  {cartProducts} )
                })
                .catch(error => {
                    console.error('Ocurrió un error:', error);
                });
        } catch (error) {
            return res.status(400).json({ status:"error", payload: 'Error al buscar el usuario'})
        } 
    }
})

export default cartRouter