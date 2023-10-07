import { Router } from 'express'
import { auth } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', (req, res) => {
    const user = {
        username: 'santiagomolina',
        role: 'admin'
    } 
    req.session.user = user
    res.send('ok')
}) 

router.get('/private', auth, (req, res) => {
    res.render('home')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Logout error')
        return res.send('Logout ok')
    })
})

export default router