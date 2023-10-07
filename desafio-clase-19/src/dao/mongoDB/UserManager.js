import userModel from './models/users.model.js'

class UserManager {
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
            return '[ERR] Error al buscar los useros en la base de datos'
        }
        return this.#_users
    }   

    /********* ADD USER *********/
    async addUser(user) {
        console.log('aca 0')
        // Compruebo que esten todos los campos necesarios
        if (!user.first_name||!user.last_name||!user.email||!user.age||!user.password) {
            console.log('aca 3')

            return '[ERR] No estan informados todos los campos necesarios para añadir el usuario'
        }
        // Obtengo el array de users desde la base de datos
        
        // Chequeo que el email no exista. Si existe, devuelvo error, sino, agrego el user a la bd
        try {
            const found = await userModel.findOne({email: user.email})     
            if(found) {
                console.log('aca 2')
    
                return '[ERR] Usuario ya existente.'
            } else {
                // Creamos el user en la base de datos
                console.log('aca 1')
                let newuser = await userModel.create(user);
                return newuser
            } 
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
        
    }  

    /********* UPDATE user *********/
    async updateuser(id, campos) {
        // Creo el objeto del usero modificado (let updateduser = )
        await userModel.updateOne({_id: id}, {$set: campos})
        return (await this.getusers()).find(item => item._id.toString() === id)
    }

    /********* DELETE user *********/
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
        if (!isFound) return '[ERR] No existe ningun usero con ese id'
        // Elimino el usero
        await userModel.deleteOne({_id: id})
        // Obtengo el nuevo array de useros desde la base de datos
        return this.getusers()
    }                         

    /********* GET user BY ID *********/
    async getuserByID(idValue) {
        const user = await this.getuserByField('_id', idValue)
        return user
    }

    async getuserByField(propiedad, valor) {
        // Obtengo el array de useros desde el archivo
        await this.getusers()
        // Busco el usero a traves de la propiedad en el array
        const userFound = this.#_users.find(item => item[propiedad].toString() === valor)
        if (userFound) {
            return userFound
        } else {
            return '[ERR] No se encontró ningun usero con '+propiedad+' = '+valor
        }
    }

}


export default UserManager;
