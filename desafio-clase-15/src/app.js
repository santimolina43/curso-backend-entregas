import express from 'express'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io' 
import mongoose from 'mongoose'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import homeRouter from './routers/home.router.js'
import realtimeproductsRouter from './routers/realTimeProducts.router.js'
import ProductManager from './managers/filesystem/ProductManager.js'

const app = express()
const productManager = new ProductManager('./data/products.json')                               

// configuramos el servidor web para que serva archivos estáticos desde la carpeta public
app.use(express.static('./src/public'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// seteamos handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

// definimos los endpoints del servidor y del front (handlebars)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/home', homeRouter)
app.use('/realtimeproducts', realtimeproductsRouter)

// me conecto a la base de datos y al servidor local asincronicamente al mismo tiempo
try {
    await mongoose.connect('mongodb+srv://santimolina43:SantiMolina43@huapi.hudzda5.mongodb.net/', {
        dbName: 'ecommerce'
    })
} catch(err) {
    console.log(err.message)
}

// abrimos el servidor y lo conectamos con socketServer
const httpServer = app.listen(8080, () => console.log('HTTP Server Up!'))
export const socketServer = new Server (httpServer)
socketServer.on('connection', async (socketClient) => {
    console.log('Socket Server UP!')
    socketServer.emit('history', await productManager.getProducts())
}) 

   
