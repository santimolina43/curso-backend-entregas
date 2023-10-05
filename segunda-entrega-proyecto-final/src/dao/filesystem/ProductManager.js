import fs from 'fs'

class ProductManager {
    #_products
    #_path
    constructor(path) {
        this.#_products = []
        this.#_path = path
    }

    /********* GET PRODUCTS *********/    
    async getProducts() {
        // Compruebo que exista el fichero, si no existe, lo creo
        if (!fs.existsSync(this.#_path)) { 
            await fs.promises.writeFile(this.#_path, JSON.stringify([], null, '\t'))
            this.#_products = []
            return this.#_products
        }
        // Leo y retorno el fichero
        let data = await fs.promises.readFile(this.#_path, 'utf-8')
        if (data == []) return data
        this.#_products = JSON.parse(data)
        return this.#_products
    }   

    /********* ADD PRODUCT *********/
    async addProduct(product) {
        // Compruebo que esten todos los campos necesarios
        if (!product.title||!product.description||!product.price||!product.category||!product.code||!product.stock) {
            return '[ERR] No estan informados todos los campos necesarios para añadir el producto'
        }
        // Obtengo el array de productos desde el archivo
        await this.getProducts()
        // Chequeo que el codigo de producto no exista. Si existe, devuelvo error, sino, lo agrego al array de productos
        const found = this.#_products.find(item => item.code === product.code)      
        if(found) {
            return '[ERR] Codigo invalido, ya existente.'
        } else {
            const nextID = await this.#getNextID()
            this.#_products.push({id: nextID, ...product})
            await fs.promises.writeFile(this.#_path, JSON.stringify(this.#_products,null,'\t'))
            return {id: nextID, ...product}
        }
    }  

    /********* UPDATE PRODUCT *********/
    async updateProduct(id, campos) {
        // Obtengo el array de productos desde el archivo
        await this.getProducts()
        // Recorro el array de productos y modifico los solicitados
        let isFound = false
        let newArrayProducts = this.#_products.map(item => {
            if (item.id === id) {
                isFound = true
                return {
                    ...item,
                    ...campos
                }
            } else return item
        })
        if (!isFound) return '[ERR] No existe ningun producto con ese codigo'
        // Reescribo el archivo con el array modificado
        await fs.promises.writeFile(this.#_path, JSON.stringify(newArrayProducts, null, '\t'))
        return (await this.getProducts()).find(item => item.id === id)
    }

    /********* DELETE PRODUCT *********/
    async deleteProduct(id) {
        // Obtengo el array de productos desde el archivo
        await this.getProducts()
        // Recorro el array de productos y modifico los solicitados
        let isFound = false
        let newArrayProducts = []
        this.#_products.forEach(item => {
            if (item.id !== id) {
                newArrayProducts.push(item)
            } else {
                isFound = true
            }
        })
        if (!isFound) return '[ERR] No existe ningun producto con ese id'
        // Reescribo el archivo con el array modificado
        await fs.promises.writeFile(this.#_path, JSON.stringify(newArrayProducts, null, '\t'))
        // Obtengo el nuevo array de productos desde el archivo
        return this.getProducts()
    }                                                   

    /********* GET PRODUCT BY ID *********/
    async getProductByID(idValue) {
        const product = await this.getProductByField('id', idValue)
        return product
    }

    async getProductByField(propiedad, valor) {
        // Obtengo el array de productos desde el archivo
        await this.getProducts()
        // Busco el producto a traves de la propiedad en el array
        const productFound = this.#_products.find(item => item[propiedad] === valor)
        if (productFound) {
            return productFound
        } else {
            return '[ERR] No se encontró ningun producto con '+propiedad+' = '+valor
        }
    }

    /********* GET NEXT ID *********/
    async #getNextID() {
        // Obtengo el array de productos desde el archivo
        await this.getProducts()
        // Corroboro que el array tenga al menos un objeto
        if (this.#_products.length === 0) {
            return 1
        } else {
            const maxID = await this.#getMaxID()
            return (maxID + 1) 
        }
    }

    /********* GET MAX ID *********/
    async #getMaxID() {
        // Obtengo el array de productos desde el archivo
        await this.getProducts()
        // Obtengo el ID mas grande del array proveniente del archivo
        let cont = 0
        let maxID = 0
        this.#_products.forEach(item => {
            if (cont === 0) {
                maxID = item.id
            } else {
                if (item.id > maxID) {
                    maxID = item.id
                }    
            }
            cont++
        })
        // Devuelvo el mayor ID incrementado en 1
        return maxID;
    }

}


export default ProductManager;
