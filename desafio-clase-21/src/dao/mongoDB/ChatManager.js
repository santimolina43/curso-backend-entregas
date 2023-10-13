import messageModel from './models/messages.model.js'

class ChatManager {
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
            return '[ERR] No estan informados todos los campos necesarios para enviar el mensaje'
        }
        // Añadimos el mensaje a la base de datos
        let newMessage = await messageModel.create(message);
        return newMessage
    }  

//     /********* UPDATE message *********/
//     async updatemessage(id, campos) {
//         // Creo el objeto del messageo modificado (let updatedmessage = )
//         await messageModel.updateOne({_id: id}, {$set: campos})
//         return (await this.getmessages()).find(item => item._id.toString() === id)
//     }

//     /********* DELETE message *********/
//     async deletemessage(id) {
//         // Obtengo el array de messageos desde el archivo
//         await this.getmessages()
//         // Recorro el array de messageos y modifico los solicitados
//         let isFound = false
//         this.#_messages.forEach(item => {
//             if (item._id == id) {
//                 isFound = true
//             }
//         })
//         if (!isFound) return '[ERR] No existe ningun messageo con ese id'
//         // Elimino el messageo
//         await messageModel.deleteOne({_id: id})
//         // Obtengo el nuevo array de messageos desde la base de datos
//         return this.getmessages()
//     }                         

//     /********* GET message BY ID *********/
//     async getmessageByID(idValue) {
//         const message = await this.getmessageByField('_id', idValue)
//         return message
//     }

//     async getmessageByField(propiedad, valor) {
//         // Obtengo el array de messageos desde el archivo
//         await this.getmessages()
//         // Busco el messageo a traves de la propiedad en el array
//         const messageFound = this.#_messages.find(item => item[propiedad].toString() === valor)
//         if (messageFound) {
//             return messageFound
//         } else {
//             return '[ERR] No se encontró ningun messageo con '+propiedad+' = '+valor
//         }
//     }

}


export default ChatManager;
