import express from 'express'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import homeRouter from './routers/home.router.js'
import realtimeproductsRouter from './routers/realTimeProducts.router.js'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io' 
import ProductManager from './entities/ProductManager.js'

const app = express()

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

// abrimos el servidor y lo conectamos con socketServer
const httpServer = app.listen(8080, () => console.log('HTTP Server Up!'))
export const socketServer = new Server (httpServer)

const productManager = new ProductManager('./data/products.json')                               

socketServer.on('connection', async (socketClient) => {
    console.log('Socket Server UP!')
    socketServer.emit('history', await productManager.getProducts())
})
