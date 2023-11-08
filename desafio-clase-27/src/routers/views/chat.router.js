import RouterClass from '../router.js';
import ChatManager from '../../dao/mongoDB/ChatManager.js'

const chatManager = new ChatManager()

export default class ChatRouter extends RouterClass {
    init() {

        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* CHAT *********/   
        this.get('/', ["USER", "ADMIN", "PREMIUM"], 'next', {}, (req, res) => {
            res.render('chat', {}) // de momento solo renderizamos la vista, sin pasarle ningun objeto
        })

        /************************************/   
        /*************** API ****************/   
        /************************************/ 
        
        /********* POST MESSAGES *********/   
        this.post('/api/messages', ["USER", "ADMIN", "PREMIUM"], 'next', {}, async (req, res) => {
            const newMessage = await chatManager.addMessage(req.body)
            if (!newMessage._id) return res.status(400).json({ status:"error", payload: newMessage})
            res.status(200).json({ status: "success", payload: newMessage })
        })
    }
}