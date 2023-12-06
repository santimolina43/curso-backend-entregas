import mongoose from 'mongoose';
import { v4 as uuidv4} from 'uuid'

const ticketCollection = 'tickets'; 

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true, default: uuidv4() },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
})

// Antes de guardar el documento, asigna un nuevo valor único para el código
ticketSchema.pre('validate', async function (next) {
    if (!this.code) {
        this.code = uuidv4();
    }
    next();
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel