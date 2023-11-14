import RouterClass from '../router.js';
import { getChatView, postMessage } from '../../controllers/chat.controller.js';

export default class ChatRouter extends RouterClass {
    init() {

        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* CHAT *********/   
        this.get('/', ["USER", "ADMIN", "PREMIUM"], 'next', {}, getChatView)

        /************************************/   
        /*************** API ****************/   
        /************************************/ 
        
        /********* POST MESSAGES *********/   
        this.post('/api/messages', ["USER", "ADMIN", "PREMIUM"], 'next', {}, postMessage)
    }
}