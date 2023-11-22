import userModel from '../models/users.model.js'
import UserDTO from '../DTOs/user.dto.js'

class UserService {
    #_users
    constructor() {
        this.#_users = []
    }

    /********* GET USERS *********/    
    async getUsers() {
        // Leo la base de datos y retorno los useros
        try {
            let users = await userModel.find() 
            if (users.length === 0) return [];
            this.#_users = users
        } catch (error) {
            return 'Error al buscar los useros en la base de datos:'+error
        }
        return this.#_users
    }   
    
    /********* ADD USER *********/
    async addUser(user) {
        // Compruebo que esten todos los campos necesarios
        if (!user.first_name||!user.last_name||!user.email||!user.age||!user.password) {
            return 'No estan informados todos los campos necesarios para añadir el usuario'
        }
        // Chequeo que el email no exista. Si existe, devuelvo error, sino, agrego el user a la bd
        try {
            const found = await userModel.findOne({email: user.email})     
            if(found) {
                return 'Usuario ya existente.'
            } else {
                // Creamos el user en la base de datos
                let newuser = await userModel.create(user);
                return newuser
            } 
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
        
    }  
    
    /********* UPDATE USER *********/
    async updateuser(id, campos) {
        // Creo el objeto del usero modificado (let updateduser = )
        await userModel.updateOne({_id: id}, {$set: campos})
        return (await this.getusers()).find(item => item._id.toString() === id)
    }
    
    /********* DELETE USER *********/
    async deleteuser(id) {
        // Obtengo el array de useros desde el archivo
        await this.getusers()
        // Recorro el array de useros y modifico los solicitados
        let isFound = false
        this.#_users.forEach(item => {
            if (item._id == id) {
                isFound = true
            }
        })
        if (!isFound) return 'No existe ningun usero con ese id'
        // Elimino el usero
        await userModel.deleteOne({_id: id})
        // Obtengo el nuevo array de useros desde la base de datos
        return this.getusers()
    }                         
    
    /********* GET USER BY EMAIL *********/
    async getUserByEmail(emailValue) {
        try {
            const user = await this.getUserByField('email', emailValue)
            const userToFront = new UserDTO(user)
            return userToFront
        } catch (error) {
            return 'Error al buscar el usuario a con email: '+emailValue
        }
    }

    async getUserByField(propiedad, valor) {
        // Obtengo el array de useros desde el archivo
        try {
            await this.getUsers()
            const userFound = this.#_users.find(item => item[propiedad].toString() === valor)
            // Busco el user a traves de la propiedad en el array
            if (userFound) {
                return userFound
            } else {
                return 'No se encontró ningun user con '+propiedad+' = '+valor
            }
        } catch (error) {
            return 'Error al realizar la solicitud de busqueda de usuarios.'
        }
    }

}

export default UserService;
