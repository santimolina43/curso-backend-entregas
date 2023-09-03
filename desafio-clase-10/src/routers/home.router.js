import { Router } from 'express'

const homeRouter = Router()

homeRouter.get('/', async (req, res) => {
    fetch('http://localhost:8080/api/products', {
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
        .then(products => {
            const arrayProducts = products.payload
            res.render('home', { products: arrayProducts })
        })
        .catch(error => {
            console.error('Ocurrió un error:', error);
        });
})

export default homeRouter