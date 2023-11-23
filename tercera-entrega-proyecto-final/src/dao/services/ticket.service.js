// import ProductService from './product.service.js'
import CartService from './cart.service.js'
import ticketModel from '../models/ticket.model.js'
// import userModel from '../models/users.model.js'
import UserService from './user.service.js'

// const productService = new ProductService()
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
        // Creamos el ticket en la base de datos
        let newTicket = await ticketModel.create({amount: amount,
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
            cart.products.forEach(item => {
                const precioProducto = item.product.price;
                const cantidadProducto = item.quantity;
                // Suma el producto de la cantidad por el precio de cada producto al total
                totalAmount += precioProducto * cantidadProducto;
            })
            // Creamos el ticket de compra
            const ticket = await this.createTicket(totalAmount, userEmail)
            if (!ticket._id) return 'Error al crear el ticket'
            
            return ticket
        } catch (error) {
            console.error('Error en finishPurchaseInCartById: ', error.message);
            return 'Error al finalizar la compra';
        }
    } 
}

export default TicketService;