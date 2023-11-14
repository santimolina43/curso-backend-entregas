import productModel from '../dao/products.model.js'

class ProductManager {
    #_products
    constructor() {
        this.#_products = []
    }

    /********* GET PRODUCTS *********/    
    async getProducts() {
        // Leo la base de datos y retorno los productos
        try {
            let products = await productModel.find() 
            if (products.length === 0) return [];
            this.#_products = products
        } catch (error) {
            return 'Error al buscar los productos en la base de datos'
        }
        return this.#_products
    }   

    /********* ADD PRODUCT *********/
    async addProduct(product) {
        // Compruebo que esten todos los campos necesarios
        if (!product.title||!product.description||!product.price||!product.category||!product.code||!product.stock) {
            return 'No estan informados todos los campos necesarios para añadir el producto'
        }
        // Obtengo el array de productos desde la base de datos
        await this.getProducts()
        // Chequeo que el codigo de producto no exista. Si existe, devuelvo error, sino, lo agrego al array de productos
        const found = this.#_products.find(item => item.code === product.code)      
        if(found) {
            return 'Codigo invalido, ya existente.'
        } else {
            // Creamos el producto en la base de datos
            let newProduct = await productModel.create(product);
            return newProduct
        }
    }  

    /********* UPDATE PRODUCT *********/
    async updateProduct(id, campos) {
        // Creo el objeto del producto modificado (let updatedProduct = )
        await productModel.updateOne({_id: id}, {$set: campos})
        return (await this.getProducts()).find(item => item._id.toString() === id)
    }

    /********* DELETE PRODUCT *********/
    async deleteProduct(id) {
        // Obtengo el array de productos desde el archivo
        await this.getProducts()
        // Recorro el array de productos y modifico los solicitados
        let isFound = false
        this.#_products.forEach(item => {
            if (item._id == id) {
                isFound = true
            }
        })
        if (!isFound) return 'No existe ningun producto con ese id'
        // Elimino el producto
        await productModel.deleteOne({_id: id})
        // Obtengo el nuevo array de productos desde la base de datos
        return this.getProducts()
    }                         

    /********* GET PRODUCT BY ID *********/
    async getProductByID(idValue) {
        const product = await this.getProductByField('_id', idValue)
        return product
    }

    async getProductByField(propiedad, valor) {
        // Obtengo el array de productos desde el archivo
        await this.getProducts()
        // Busco el producto a traves de la propiedad en el array
        const productFound = this.#_products.find(item => item[propiedad].toString() === valor)
        if (productFound) {
            return productFound
        } else {
            return 'No se encontró ningun producto con '+propiedad+' = '+valor
        }
    }

    /********* PAGINATE PRODUCTS *********/
    async paginateProducts(query, filters) {
        const products = await productModel.paginate(query, filters)
        return products
    }
}


export default ProductManager;