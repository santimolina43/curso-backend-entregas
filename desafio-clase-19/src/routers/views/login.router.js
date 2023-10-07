import { Router } from 'express'

const loginRouter = Router()

/********* GET LOGIN VIEW *********/    
loginRouter.get('/', (req, res) => {
    res.render('login', {})
})

/********* GET REGISTER VIEW *********/    
loginRouter.get('/register', (req, res) => {
    res.render('register', {})
})

export default loginRouter