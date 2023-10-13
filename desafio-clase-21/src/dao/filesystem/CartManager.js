import fs from 'fs'
import ProductManager from './ProductManager.js'

const productManager = new ProductManager('./data/products.json')

class CartManager {
    #_carts
    #_path
    constructor(path) {
        this.#_carts = []
        this.#_path = path
    }

    /********* GET CARTS *********/    
    async getCarts() {
        // Compruebo que exista el archivo, si no existe, lo creo
        if (!fs.existsSync(this.#_path)) { 
            await fs.promises.writeFile(this.#_path, JSON.stringify([], null, '\t'))
            this.#_carts = []
            return this.#_carts
        }
        // Leo y retorno el archivo
        let data = await fs.promises.readFile(this.#_path, 'utf-8')
        if (data == []) return data
        this.#_carts = JSON.parse(data)
        return this.#_carts
    }   

    /********* ADD CART *********/
    async addCart(products) {
        const nextID = await this.#getNextID()
        this.#_carts.push({id: nextID, products: products})
        await fs.promises.writeFile(this.#_path, JSON.stringify(this.#_carts,null,'\t'))
        return {id: nextID, products: products}
    }  

    /********* ADD PRODUCT TO CART *********/
    async addProductToCart(cartID, productID) {
        // Obtengo el array de carritos desde el archivo
        await this.getCarts()
        // Verifico que el id de producto sea valido
        let productFound = await productManager.getProductByID(productID)
        if (!productFound.id) return '[ERR] No existe ningun producto con ese id'
        // Recorro el array de carritos y añado los productos en caso de encontrar el carrito
        let isFound = false
        let newArrayCarts = this.#_carts.map(item => {
            if (item.id === cartID) {
                isFound = true
                productFound = item.products.find(item => item.product === productID)
                if (productFound) {
                    let newArrayProducts = item.products.map(item => {
                        if (item.product === productID) {
                            return {
                                product: item.product, 
                                quantity: item.quantity+1
                            }
                        } else return item
                    })
                    return {
                        id: cartID, 
                        products: newArrayProducts
                    }
                } else {
                    item.products.push({product: productID, quantity: 1})
                    return item
                }
            } else return item
        })
        if (!isFound) return '[ERR] No existe ningun carrito con ese id'
        // Reescribo el archivo con el array de los carritos modificado
        await fs.promises.writeFile(this.#_path, JSON.stringify(newArrayCarts, null, '\t'))
        return (await this.getCarts()).find(item => item.id === cartID)
    }

    /********* GET CART BY ID *********/
    async getCartByID(idValue) {
        // Obtengo el array de carritos desde el archivo
        await this.getcarts()
        // Busco el carrito a traves del id en el array
        const cartFound = this.#_carts.find(item => item.id === idValue)
        if (cartFound) {
            return cartFound
        } else {
            return '[ERR] No se encontró ningun carrito con ese id'
        }
    }

    /********* GET PRODUCTS FROM CART BY ID *********/
    async getCartProductsByID(idValue) {
        // Obtengo el array de carritos desde el archivo
        await this.getCarts()
        // Busco el carrito a traves del id en el array
        const cartFound = this.#_carts.find(item => item.id === idValue)
        if (cartFound) {
            // Mapeo de productos usando Promise.all()
            const cartProducts = await Promise.all(cartFound.products.map(async item => {
                const product = await productManager.getProductByID(item.product);
                return product;
            }));
            return cartProducts
        } else {
            return '[ERR] No se encontró ningun carrito con ese id'
        }
    }

    /********* GET NEXT ID *********/
    async #getNextID() {
        // Obtengo el array de carritos desde el archivo
        await this.getCarts()
        // Corroboro que el array tenga al menos un objeto
        if (this.#_carts.length === 0) {
            return 1
        } else {
            const maxID = await this.#getMaxID()
            // Retorno el mayor id incrementado en 1
            return (maxID + 1) 
        }
    }

    /********* GET MAX ID *********/
    async #getMaxID() {
        // Obtengo el array de carritos desde el archivo
        await this.getCarts()
        // Obtengo el ID mas grande del array proveniente del archivo
        let cont = 0
        let maxID = 0
        this.#_carts.forEach(item => {
            if (cont === 0) {
                maxID = item.id
            } else {
                if (item.id > maxID) {
                    maxID = item.id
                }    
            }
            cont++
        })
        // Devuelvo el mayor ID
        return maxID;
    }
}

export default CartManager;