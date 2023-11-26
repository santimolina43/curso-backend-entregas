import ProductService from './product.service.js'
import CartService from './cart.service.js'
import ticketModel from '../models/ticket.model.js'
// import userModel from '../models/users.model.js'
import UserService from './user.service.js'
import { v4 as uuidv4} from 'uuid'

const productService = new ProductService()
const cartService = new CartService()
const userService = new UserService()

class TicketService {
    #_tickets
    constructor() {
        this.#_tickets = []
    }


    /********* GET TICKET BY ID *********/
    async getTicketByID(idValue) {
        // Busco el ticket a traves del id en el array
        const ticketFound = await ticketModel.findOne({_id: idValue})
        if (ticketFound) {
            return ticketFound
        } else {
            return 'No se encontró ningun ticket con ese id'
        }
    }

    /********* CREATE TICKET *********/
    async createTicket(amount, purchaserEmail) {
        // Generamos un código único
        let uniqueCode;
        let isCodeUnique = false;
        while (!isCodeUnique) {
            uniqueCode = uuidv4();
            const existingTicket = await ticketModel.findOne({ code: uniqueCode });
            isCodeUnique = !existingTicket;
        }
        // Creamos el ticket en la base de datos
        let newTicket = await ticketModel.create({code: uniqueCode,
                                                  amount: amount,
                                                  purchaser: purchaserEmail});
        return newTicket
    }  

    /********* FINISH PURCHASE IN CART BY ID *********/
    async finishPurchaseInCartById(cartId) {
        try {
            // Obtengo el carrito de compra
            const cart = await cartService.getCartByID(cartId)
            if (!cart._id) return 'Error al obtener el carrito de compra'
            // Obtengo el usuario del carrito
            const cartUser = await userService.getUserByCartId(cart._id.toString())
            if (!cartUser.email) return 'Error al obtener el usuario de compra'
            // Obtengo el mail del usuario
            const userEmail = cartUser.email
            // Obtengo el total de compra
            let totalAmount = 0
            cart.products.forEach(async item => {
                // Si tengo stock del producto, entonces lo sumo y resto stock al producto
                if (item.product.stock >= item.quantity) {
                    const precioProducto = item.product.price;
                    const cantidadProducto = item.quantity;
                    // Suma el producto de la cantidad por el precio de cada producto al total
                    totalAmount += precioProducto * cantidadProducto;
                    // Elimino el producto del carrito
                    await cartService.deleteProductFromCart(cart._id.toString(), item.product._id.toString())
                    // Actualizo el stock del producto
                    let newStock = item.product.stock - item.quantity
                    await productService.updateProduct(item.product._id.toString(), {stock: newStock})
                } 
            })
            // Creamos el ticket de compra
            if (totalAmount > 0) {
                const ticket = await this.createTicket(totalAmount, userEmail)
                if (!ticket._id) return 'Error al crear el ticket'
                return ticket
            } else {
                return 'No hay productos disponibles para este carrito'
            }
        } catch (error) {
            console.error('Error en finishPurchaseInCartById: ', error.message);
            return 'Error al finalizar la compra';
        }
    } 
}

export default TicketService;