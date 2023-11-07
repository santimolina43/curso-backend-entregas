import express from 'express'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io' 
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from "passport";
import cookieParser from "cookie-parser";
// Views routers
import homeRouter from './routers/views/home.router.js'
import cartRouter from './routers/views/cart.router.js'
import realtimeproductsRouter from './routers/views/realTimeProducts.router.js'
// Api routers
import productsRouter from './routers/api/products.router.js'
import cartsRouter from './routers/api/carts.router.js'
import sessionRouter from './routers/api/sessions.router.js'
import chatRouter from './routers/views/chat.router.js'
import loginRouter from './routers/views/login.router.js'
import profileRouter from './routers/views/profile.router.js'
// DB Managers
import ProductManager from './dao/mongoDB/ProductManager.js'
import ChatManager from './dao/mongoDB/ChatManager.js'

// Migration
import SessionsRouter from './routers/api/sessions.router.js'
// Config
import initializePassport from "./config/passport.config.js";

import { passportCall } from './helpers/utils.js'
import { JWT_PRIVATE_KEY, MONGO_DB_NAME, MONGO_DB_URL } from './helpers/auth-helpers.js'

const app = express()
const productManager = new ProductManager()                               
const chatManager = new ChatManager()  
const sessionsRouter = new SessionsRouter();                             

// configuramos el servidor web para que serva archivos estáticos desde la carpeta public
app.use(express.static('./src/public'))
app.use(cookieParser(JWT_PRIVATE_KEY))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// seteamos handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

// STORAGE
app.use(session({
    // store: MongoStore.create({
    //     mongoUrl: 'mongodb+srv://santimolina43:SantiMolina43@huapi.hudzda5.mongodb.net/',
    //     dbName: 'ecommerce'
    // }),
    secret: 'mi_secreto', 
    resave: true, 
    saveUninitialized: false 
}))
// Agregamos la inicializacion de passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// me conecto a la base de datos y al servidor local asincronicamente al mismo tiempo
try {
    await mongoose.connect(MONGO_DB_URL, {
        dbName: MONGO_DB_NAME
    })
    console.log('DB Conected!')
    // Me conecto a los endpoints
    // views endpoints 
    app.use('/', homeRouter)
    app.use('/products', homeRouter)
    app.use('/realtimeproducts', realtimeproductsRouter)
    app.use('/chat', chatRouter)
    app.use('/cart', cartRouter)
    app.use('/sessionsRouter', loginRouter)
    app.use('/login', loginRouter)
    app.use('/profile', profileRouter)
    // api endpoints
    app.use('/api/products', productsRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/session', sessionsRouter.getRouter())
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
