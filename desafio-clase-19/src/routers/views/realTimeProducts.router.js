import { Router } from 'express'
import { publicRoutes } from '../../middlewares/auth.middleware.js'

const realtimeproductsRouter = Router()

realtimeproductsRouter.get('/', publicRoutes, (req, res) => {
    res.render('realTimeProducts', {})
})

export default realtimeproductsRouter
