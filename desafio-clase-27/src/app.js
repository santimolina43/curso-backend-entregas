import express from 'express'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io' 
import mongoose from 'mongoose'
import session from 'express-session'
import passport from "passport";
import cookieParser from "cookie-parser";
import run from './run.js'
import initializePassport from "./config/passport.config.js";
import { JWT_PRIVATE_KEY, MONGO_DB_NAME, MONGO_DB_URL } from './middlewares/auth-helpers.js'

const app = express()                       

// configuramos el servidor web para que serva archivos estáticos desde la carpeta public
app.use(express.static('./src/public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// configuramos cookie parser
app.use(cookieParser(JWT_PRIVATE_KEY))

// seteamos handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

// STORAGE
app.use(session({
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
    // abrimos el servidor y lo conectamos con socketServer
    const httpServer = app.listen(8080, () => console.log('HTTP Server Up!'))
    const socketServer = new Server (httpServer)
    httpServer.on("error", (e) => console.log("ERROR: " + e))
    // corro los routers
    run(socketServer, app)
} catch(err) {
    console.log(err.message)
}
