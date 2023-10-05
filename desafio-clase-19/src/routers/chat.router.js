import { Router } from 'express'
import ChatManager from '../dao/mongoDB/ChatManager.js'

const chatManager = new ChatManager()
const chatRouter = Router()

/********* GET MESSAGES *********/    
chatRouter.get('/', (req, res) => {
    res.render('chat', {}) // de momento solo renderizamos la vista, sin pasarle ningun objeto
})

/********* POST MESSAGES *********/    
chatRouter.post('/api/messages', async (req, res) => {
    const newMessage = await chatManager.addMessage(req.body)
    if (!newMessage._id) return res.status(400).json({ status:"error", payload: newMessage})
    res.status(200).json({ status: "success", payload: newMessage })
})

export default chatRouter