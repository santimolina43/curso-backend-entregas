import userModel from '../dao/models/users.model.js'
import UserDTO from '../dao/DTOs/user.dto.js'
import CustomError from './errors/customError.js'
import EErros from '../services/errors/enums.js'

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
            throw new CustomError('Error al buscar los users en la base de datos:'+error, EErros.DATA_NOT_FOUND_ERROR)
        }
        return this.#_users
    }   
    
    
    /********* GET USER BY ID *********/
    async getUserByCartId(cartIdValue) {
        try {
            const user = await this.getUserByField('cart', cartIdValue)
            const userToFront = new UserDTO(user)
            return userToFront
        } catch (error) {
            throw new CustomError('Error al buscar el usuario a con CartId: '+cartIdValue, EErros.DATA_NOT_FOUND_ERROR)
        }
    }
    
    /********* GET USER BY EMAIL *********/
    async getUserByEmail(emailValue) {
        try {
            const user = await this.getUserByField('email', emailValue)
            const userToFront = new UserDTO(user)
            return userToFront
        } catch (error) {
            throw new CustomError('Error al buscar el usuario a con email: '+emailValue, EErros.DATA_NOT_FOUND_ERROR)
        }
    }

    /********* ADD USER *********/
    async addUser(user) {
        // Compruebo que esten todos los campos necesarios
        if (!user.first_name||!user.last_name||!user.email||!user.age||!user.password) {
            throw new CustomError('No estan informados todos los campos necesarios para añadir el usuario', EErros.MISSING_FIELDS_ERROR)
        }
        // Chequeo que el email no exista. Si existe, devuelvo error, sino, agrego el user a la bd
        try {
            const found = await userModel.findOne({email: user.email})     
            if(found) {
                throw new CustomError('Usuario ya existente.', EErros.UNIQUE_KEY_VIOLATED)
            } else {
                // Creamos el user en la base de datos
                let newuser = await userModel.create(user);
                return newuser
            } 
        } catch (error) {
            throw new CustomError('Error al crear el usuario', EErros.DATABASES_ERROR)
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
        if (!isFound) throw new CustomError('No existe ningun usero con ese id', EErros.DATA_NOT_FOUND_ERROR) 
        // Elimino el user
        await userModel.deleteOne({_id: id})
        // Obtengo el nuevo array de useros desde la base de datos
        return this.getusers()
    }                         

    async getUserByField(propiedad, valor) {
        // Obtengo el array de useros desde el archivo
        try {
            const users = await this.getUsers()
            // console.log(users)
            const userFound = users.find(item => item[propiedad] == valor)
            // Busco el user a traves de la propiedad en el array
            if (userFound) {
                return userFound
            } else {
                throw new CustomError('No se encontró ningun user con '+propiedad+' = '+valor, EErros.DATA_NOT_FOUND_ERROR)
            }
        } catch (error) {
            throw new CustomError('Error al realizar la solicitud de busqueda de usuarios.', EErros.DATA_NOT_FOUND_ERROR)
        }
    }

}

export default UserService;
