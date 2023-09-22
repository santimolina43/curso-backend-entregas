import ProductManager from './ProductManager.js'
import cartModel from './models/carts.model.js'

const productManager = new ProductManager('./data/products.json')

class CartManager {
    #_carts
    constructor() {
        this.#_carts = []
    }

    /********* GET CARTS *********/    
    async getCarts() {
        // Leo la base de datos y retorno los carritos
        let carts = await cartModel.find() 
        if (carts.length === 0) return [];
        this.#_carts = carts
        return this.#_carts
    }   

    /********* ADD CART *********/
    async addCart(products) {
        // Creamos el producto en la base de datos
        let newCart = await cartModel.create({products: products});
        return newCart
    }  

    /********* ADD PRODUCT TO CART *********/
    async addProductToCart(cartID, productID) {
        // Obtengo el array de carritos de la base de datos
        await this.getCarts()
        // Verifico que el id de producto sea valido
        let productFound = await productManager.getProductByID(productID)
        if (!productFound._id) return '[ERR] No existe ningun producto con ese id'
        // Busco el carrito en la base de datos y devuelvo error si no lo encuentro
        let cartFound = await this.getCartByID(cartID)
        if (!cartFound) return '[ERR] No existe ningun carrito con ese id'
        // Busco el producto en el array de productos del carrito
        productFound = cartFound.products.find(item => item.product === productID)
        if (productFound) {
            // Si encuentro el producto incremento la cantidad en 1
            await cartModel.updateOne({_id: cartID, 'products.product': productID}, 
                                      {$inc: {'products.$.quantity': 1}})
        }
        else {
            // Si no encuentro el producto entonces lo añado al carrito con cantidad 1
            await cartModel.updateOne({_id: cartID},
                                      {$push: {products: {product: productID, quantity: 1}}})
        }
        return (await this.getCarts()).find(item => item._id.toString() === cartID)
    }

    /********* GET CART BY ID *********/
    async getCartByID(idValue) {
        // Obtengo el array de carritos desde el archivo
        await this.getCarts()
        // Busco el carrito a traves del id en el array
        const cartFound = this.#_carts.find(item => item._id.toString() === idValue)
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
        const cartFound = this.#_carts.find(item => item._id.toString() === idValue)
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

}

export default CartManager;