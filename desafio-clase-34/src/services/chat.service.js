import messageModel from '../dao/models/messages.model.js'
import CustomError from './errors/customError.js'
import EErros from '../services/errors/enums.js'

class ChatService {
    #_messages
    constructor() {
        this.#_messages = []
    }

    /********* GET MESSAGES *********/    
    async getMessages() {
        // Leo la base de datos y retorno los messageos
        let messages = await messageModel.find() 
        if (messages.length === 0) return [];
        this.#_messages = messages
        return this.#_messages
    }   

    /********* ADD MESSAGE *********/
    async addMessage(message) {
        // Compruebo que esten todos los campos necesarios
        if (!message.user||!message.message) {
            throw new CustomError('No estan informados todos los campos necesarios para enviar el mensaje', EErros.MISSING_FIELDS_ERROR)
        }
        // Añadimos el mensaje a la base de datos
        let newMessage = await messageModel.create(message);
        return newMessage
    }  

}


export default ChatService;
