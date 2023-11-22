import messageModel from '../models/messages.model.js'

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
            return 'No estan informados todos los campos necesarios para enviar el mensaje'
        }
        // Añadimos el mensaje a la base de datos
        let newMessage = await messageModel.create(message);
        return newMessage
    }  

}


export default ChatService;
