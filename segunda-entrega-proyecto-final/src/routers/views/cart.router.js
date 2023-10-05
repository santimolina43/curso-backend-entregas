import { Router } from 'express'

const cartRouter = Router()

cartRouter.get('/651d70aee46c0698f0e4d87c', async (req, res) => {
    // Hago la peticion a la api de los carritos para un carrito en especial harcodeado
    fetch('http://localhost:8080/api/carts/651d70aee46c0698f0e4d87c', {
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
})

export default cartRouter