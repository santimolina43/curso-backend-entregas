import ProductService from './product.service.js'
import cartModel from '../models/carts.model.js'

const productService = new ProductService('./data/products.json')

class CartService {
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
        // Creamos el carritp en la base de datos
        let newCart = await cartModel.create({products: products});
        return newCart
    }  

    /********* ADD PRODUCT TO CART *********/
    async addProductToCart(cartID, productID, quantity, method) {
        // Obtengo el array de carritos de la base de datos
        await this.getCarts()
        // Verifico que el id de producto sea valido
        let productFound = await productService.getProductByID(productID)
        if (!productFound._id) return 'No existe ningun producto con el id: '+productID
        if (quantity > 0) {
            // Verifico que haya suficiente stock para agregar el producto al carrito
            if (productFound.stock < quantity) return 'No hay stock suficiente para añadir el producto al carrito'
        }
        // Busco el carrito en la base de datos y devuelvo error si no lo encuentro
        let cartFound = await this.getCartByID(cartID)
        if (!cartFound) return 'No existe ningun carrito con el id: '+cartID
        // Busco el producto en el array de productos del carrito
        const productFoundInCart = cartFound.products.find(item => item.product._id.toString() == productFound._id.toString())
        if (productFoundInCart) {
            if (quantity > 0) {
                // Verifico que haya suficiente stock para agregar el producto al carrito
                if (productFound.stock < (quantity + productFoundInCart.quantity)) return 'No hay stock suficiente para añadir el producto al carrito'
            } else {
                // Verifico que si se trata de una resta de producto del carrito, la cantidad no quede negativa
                if (productFoundInCart.quantity + quantity < 0) return 'No es posible cargar cantidad negativa en el carrito'
            }
            if (method==="inc") {
                // Si encuentro el producto y el method es "inc" entonces incremento la cantidad en quantity
                await cartModel.updateOne({_id: cartID, 'products.product': productFound._id}, 
                                            {$inc: {'products.$.quantity': quantity}})
            } else if (method==="set") {
                // Si encuentro el producto y el method es "set" entonces seteo la cantidad en quantity
                await cartModel.updateOne({_id: cartID, 'products.product': productFound._id}, 
                                          {$set: {'products.$.quantity': quantity}})
            } else return 'Please specify a valid method to add the products'
        } 
        else {
            // Si no encuentro el producto entonces lo añado al carrito con cantidad quantity
            await cartModel.updateOne({_id: cartID},
                                        {$push: {products: {product: productFound._id, quantity: quantity}}})
        }
        return (await this.getCarts()).find(item => item._id.toString() === cartID)
    }

    /********* DELETE PRODUCT FROM CART *********/
    async deleteProductFromCart(cartID, productID) {
        // Obtengo el array de carritos de la base de datos
        await this.getCarts()
        // Verifico que el id de producto sea valido
        let productFound = await productService.getProductByID(productID)
        if (!productFound._id) return 'No existe ningun producto con ese id'
        // Busco el carrito en la base de datos y devuelvo error si no lo encuentro
        let cartFound = await this.getCartByID(cartID)
        if (!cartFound) return 'No existe ningun carrito con ese id'
        // Busco el producto en el array de productos del carrito
        let productFoundInCart = cartFound.products.find(item => item.product._id.toString() === productFound._id.toString())
        if (productFoundInCart) {
            // Si encuentro el producto, lo elimino
            await cartModel.findOneAndUpdate({_id: cartID}, 
                                             {$pull: {products: {product: productFound._id}}})
        }
        else {
            // Si no encuentro el producto entonces devuelvo error
            return 'No existe ningun producto con ese id en el carrito'
        }
        return (await this.getCarts()).find(item => item._id.toString() === cartID)
    }

    /********* GET CART BY ID *********/
    async getCartByID(idValue) {
        // Busco el carrito a traves del id en el array
        const cartFound = await cartModel.findOne({_id: idValue})
        if (cartFound) {
            return cartFound
        } else {
            return 'No se encontró ningun carrito con ese id'
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
                const product = await productService.getProductByID(item.product.toString());
                return product;
            }));
            return cartProducts
        } else {
            return 'No se encontró ningun carrito con ese id'
        }
    }

    /********* DELETE ALL PRODUCTS FROM CART BY ID *********/
    async deleteAllProductsFromCartById(cartId) {
        // Seteo el array de products a '[]' para el carrito 
        await cartModel.updateOne({_id: cartId},
                                  {$set: {'products': []}})
    }

       /********* DELETE PRODUCT FROM ALL CARTS *********/
       async deleteProductFromAllCarts(productID) {
        try {
            // Actualizar todos los carritos que contienen el producto eliminado
            const carts = await cartModel.find({ 'products.product': productID });
            carts.forEach(async (cart) => {
                // Filtrar el producto eliminado del array de productos en el carrito
                cart.products = cart.products.filter((product) => product.product.toString() !== productID);
                await cart.save();
            });
        } catch (error) {
            console.error('Error al eliminar el producto de los carritos' + error)
        }
        return 'product deleted successfully'
    }

}

export default CartService;