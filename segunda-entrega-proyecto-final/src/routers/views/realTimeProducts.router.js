import { Router } from 'express'

const realtimeproductsRouter = Router()

realtimeproductsRouter.get('/', (req, res) => {
    res.render('realTimeProducts', {})
})

export default realtimeproductsRouter
