import { Router } from 'express'
import { publicRoutes } from '../../middlewares/auth.middleware.js'
import { passportCall } from '../../helpers/auth-helpers.js'

const homeRouter = Router()

homeRouter.get('/', passportCall('jwt'), async (req, res) => {
    console.log('imprimo los productos')
    // Armo la url para hacer la peticion a la api de los productos
    let requesturl = '/' + (req.query.limit ? `?limit=${req.query.limit}` : '?limit=10')
                         + (req.query.page ? `&page=${req.query.page}` : '&page=1')
                         + (req.query.category ? `&category=${req.query.category}` : '')
                         + (req.query.stock ? `&stock=${req.query.stock}` : '')
                         + (req.query.sort ? `&sort=${req.query.sort}` : '')

    // Hago la peticion a la api de los productos pasandole los query params que recibimos en /home
    fetch(`http://localhost:8080/api/products${requesturl}`, {
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
            const user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name, 
                email: req.user.email, 
                age: req.user.age,
                role: req.user.role,
                cart: req.user.cart
            }
            console.log('renderizo home')
            res.render('home', { products, ...user })
        })
        .catch(error => {
            console.error('Ocurrió un error:', error);
        });
})

export default homeRouter