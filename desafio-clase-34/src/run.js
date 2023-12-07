// Migrated routers
import ProductsRouter from './routers/api/products.router.js'
import CartsRouter from './routers/api/carts.router.js'
import SessionsRouter from './routers/api/sessions.router.js'
import HomeRouter from './routers/views/home.router.js'
import RealTimeProductsRouter from './routers/views/realTimeProducts.router.js'
import ChatRouter from './routers/views/chat.router.js'
import ProfileRouter from './routers/views/profile.router.js'
import MockingProductsRouter from './routers/api/mockingProducts.router.js'
// DB Services
import ProductService from './services/product.service.js'
import ChatService from './services/chat.service.js'
import CartService from './services/cart.service.js'
// Error handler middleware
import errorHandler from './middlewares/error.js'

// Inicializo Clases
// Services
const productService = new ProductService()                               
const chatService = new ChatService()  
const cartService = new CartService()
// Routers
const productsRouter = new ProductsRouter();                             
const cartsRouter = new CartsRouter();                             
const sessionsRouter = new SessionsRouter();                             
// const cartRouter = new CartRouter();                             
const homeRouter = new HomeRouter();                             
const realTimeProductsRouter = new RealTimeProductsRouter();                             
const chatRouter = new ChatRouter();                             
const profileRouter = new ProfileRouter();   
const mockingProductsRouter = new MockingProductsRouter();   

const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    // Me conecto a los endpoints
    app.use('/', homeRouter.getRouter())
    app.use('/session', sessionsRouter.getRouter())
    app.use('/products', productsRouter.getRouter())
    app.use('/cart', cartsRouter.getRouter())
    app.use('/profile', profileRouter.getRouter())
    app.use('/realtimeproducts', realTimeProductsRouter.getRouter())
    app.use('/chat', chatRouter.getRouter())
    app.use('/mockingProducts', mockingProductsRouter.getRouter())
    app.use(errorHandler)


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