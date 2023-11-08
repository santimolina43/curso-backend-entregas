// Api routers
import productsRouter from './routers/api/products.router.js'
import cartsRouter from './routers/api/carts.router.js'
// Migration
import SessionsRouter from './routers/api/sessions.router.js'
import CartRouter from './routers/views/cart.router.js'
import HomeRouter from './routers/views/home.router.js'
import RealTimeProductsRouter from './routers/views/realTimeProducts.router.js'
import ChatRouter from './routers/views/chat.router.js'
import ProfileRouter from './routers/views/profile.router.js'
// DB Managers
import ProductManager from './dao/mongoDB/ProductManager.js'
import ChatManager from './dao/mongoDB/ChatManager.js'

// Inicializo Clases
// Managers
const productManager = new ProductManager()                               
const chatManager = new ChatManager()  
// Routers
const sessionsRouter = new SessionsRouter();                             
const cartRouter = new CartRouter();                             
const homeRouter = new HomeRouter();                             
const realTimeProductsRouter = new RealTimeProductsRouter();                             
const chatRouter = new ChatRouter();                             
const profileRouter = new ProfileRouter();   

const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    // Me conecto a los endpoints
    app.use('/', homeRouter.getRouter())
    app.use('/products', homeRouter.getRouter())
    app.use('/realtimeproducts', realTimeProductsRouter.getRouter())
    app.use('/chat', chatRouter.getRouter())
    app.use('/cart', cartRouter.getRouter())
    app.use('/profile', profileRouter.getRouter())
    app.use('/api/products', productsRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/session', sessionsRouter.getRouter())


    socketServer.on('connection', async (socketClient) => {
        console.log('Socket Server UP!')
        socketServer.emit('productsHistory', await productManager.getProducts())
        socketServer.emit('messagesHistory', await chatManager.getMessages())
        socketClient.on('message', async () => {
            socketServer.emit('messagesHistory', await chatManager.getMessages())
        })
    })
}

export default run