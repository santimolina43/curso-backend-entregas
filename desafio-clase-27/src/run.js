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
// DB Services
import ProductService from './services/product.service.js'
import ChatService from './services/chat.service.js'
import CartService from './services/cart.service.js'

// Inicializo Clases
// Services
const productService = new ProductService()                               
const chatService = new ChatService()  
const cartService = new CartService()
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
        socketServer.emit('productsHistory', await productService.getProducts())
        socketServer.emit('messagesHistory', await chatService.getMessages())
        socketClient.on('deletedOrAddedProduct', async () => {
            socketServer.emit('productsHistory', await productService.getProducts())
        })
        socketClient.on('message', async () => {
            socketServer.emit('messagesHistory', await chatService.getMessages())
        })
        socketClient.on('deletedOrAddedProductToCart', async (cid) => {
            const productsInCart = await cartService.getCartByID(cid)
            socketServer.emit('cartProductsHistory', productsInCart)
        })
    })
}

export default run