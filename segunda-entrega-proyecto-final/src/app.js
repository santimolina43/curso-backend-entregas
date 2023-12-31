import express from 'express'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io' 
import mongoose from 'mongoose'
// Views routers
import homeRouter from './routers/views/home.router.js'
import cartRouter from './routers/views/cart.router.js'
import realtimeproductsRouter from './routers/views/realTimeProducts.router.js'
// Api routers
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import chatRouter from './routers/chat.router.js'
// DB Managers
import ProductManager from './dao/mongoDB/ProductManager.js'
import ChatManager from './dao/mongoDB/ChatManager.js'

const app = express()
const productManager = new ProductManager()                               
const chatManager = new ChatManager()                               

// configuramos el servidor web para que serva archivos estáticos desde la carpeta public
app.use(express.static('./src/public'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// seteamos handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

// views endpoints 
app.use('/', homeRouter)
app.use('/products', homeRouter)
app.use('/realtimeproducts', realtimeproductsRouter)
app.use('/chat', chatRouter)
app.use('/cart', cartRouter)
// api endpoints
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


// me conecto a la base de datos y al servidor local asincronicamente al mismo tiempo
try {
    await mongoose.connect('mongodb+srv://santimolina43:SantiMolina43@huapi.hudzda5.mongodb.net/', {
        dbName: 'ecommerce'
    })
    console.log('DB Conected!')
} catch(err) {
    console.log(err.message)
}

// abrimos el servidor y lo conectamos con socketServer
const httpServer = app.listen(8080, () => console.log('HTTP Server Up!'))
export const socketServer = new Server (httpServer)
socketServer.on('connection', async (socketClient) => {
    console.log('Socket Server UP!')
    socketServer.emit('productsHistory', await productManager.getProducts())
    socketServer.emit('messagesHistory', await chatManager.getMessages())
    socketClient.on('message', async () => {
        socketServer.emit('messagesHistory', await chatManager.getMessages())
    })
}) 
