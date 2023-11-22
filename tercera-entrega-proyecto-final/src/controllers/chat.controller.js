
import ChatService from '../dao/services/chat.service.js'

const chatService = new ChatService()

/************************************/   
/************** VISTAS **************/   
/************************************/ 

export const getChatView = (req, res) => {
    res.render('chat', {}) // de momento solo renderizamos la vista, sin pasarle ningun objeto
}

/************************************/   
/*************** API ****************/   
/************************************/ 

export const postMessage = async (req, res) => {
    const newMessage = await chatService.addMessage(req.body)
    if (!newMessage._id) return res.status(400).json({ status:"error", payload: newMessage})
    res.status(200).json({ status: "success", payload: newMessage })
}