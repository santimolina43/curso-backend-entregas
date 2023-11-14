import express from 'express'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io' 
import mongoose from 'mongoose'
import session from 'express-session'
import passport from "passport";
import cookieParser from "cookie-parser";
import { Command } from 'commander'
import run from './run.js'
import initializePassport from "./config/passport.config.js";
import {env_parameters} from './config/env.config.js'

// configuramos variables de entorno
const program = new Command()
program
    .option('-p <port>', 'Puerto del servidor', 8080) 
    .option('--mode <mode>', 'Modo de ejecución', 'PRODUCTION')
program.parse()
export const env_parameters_obj = env_parameters(program.opts().mode)

// configuramos el servidor web con express
const app = express()                       
app.use(express.static('./src/public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// configuramos cookie parser
app.use(cookieParser(env_parameters_obj.jwt.jwtPrivateKey))

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
    await mongoose.connect(env_parameters_obj.mongoDB.uri, {
        dbName: env_parameters_obj.mongoDB.name
    })
    console.log('DB Conected!')
    // abrimos el servidor y lo conectamos con socketServer
    const httpServer = app.listen(env_parameters_obj.app.port, () => console.log(`HTTP Server Up on port ${env_parameters_obj.app.port}! (${env_parameters_obj.app.persistence})`))
    const socketServer = new Server (httpServer)
    httpServer.on("error", (e) => console.log("ERROR: " + e))
    // corro los routers
    run(socketServer, app)
} catch(err) {
    console.log(err.message)
}
