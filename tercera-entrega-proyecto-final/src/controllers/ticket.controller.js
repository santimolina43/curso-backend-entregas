import TicketService from '../dao/services/ticket.service.js'

const ticketService = new TicketService()

export const finishPurchaseInCartById = async (req, res) => {
    const cartId = req.params.cid
    // console.log(cartId)
    try { 
        // Creamos el ticket de compra
        const ticket = await ticketService.finishPurchaseInCartById(cartId)
        if (!ticket._id) return res.status(404).json({ status:"error", payload: ticket})
        return res.status(200).json({ status: "success", payload: ticket })
    } 
    catch (error) {
        return res.status(404).json({ status:"error", payload: 'No se pudo finalizar la compra del carrito con el id: '+cartId})
    }
}

export const getTicketView = async (req, res) => { 
    const ticketId = req.params.tid 
    try { 
        const ticket = await ticketService.getTicketByID(ticketId)
        console.log(ticket)
        res.render('ticket', ticket)
    } 
    catch (error) {
        return res.status(404).json({ status:"error", payload: 'Error al obtener la vista del carrito'})
    }
}