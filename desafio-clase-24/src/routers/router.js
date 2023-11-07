import {Router} from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY, passportCall } from '../helpers/auth-helpers.js';

// Crear el router como un objeto creando una clase es otra forma de hacerlo y es totalmente valida
// y sirve para hacer toda la programacion orientada a objetos
export default class RouterClass{
    constructor() {
        this.router = Router();
        this.init();
    }
    getRouter() {
        return this.router;
    }
    init(){} // Esta inicializacion sera para sus clases heredadas

    get(path, policies, ...callbacks) { // policies será un array con los roles aceptados en cada ruta
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    };
    post(path, policies, authInstance, ...callbacks) {
        this.router.post(path, passportCall(authInstance),
        this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }
    // post(path, policies, ...callbacks) {
    //     this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    // }
    put(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }
    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }
    
    // metodo que ejecutará todas las funciones callbacks del router, aunque principalmente la funcion callback que 
    // tenemos casi siempre es la propia funcion que ejecuta cada router:
            // (req, res) => {
            //     res.sendSuccess("Hola Coders!");
            // }
    applyCallbacks(callbacks) {
        // mapearemos los callbacks uno a uno, obteniendo todos sus parámetros a partir de ...
        // console.log('entro al apply callbacks 1')
        return callbacks.map((callback) => async (...params) => {
            try {
                // apply, ejecutará la funcion callback apuntando directamente a una instancia de la
                // clase, por elo, colocamos this para que se utilice sólo en el contexto de este router,
                // los parámetros son internos de cada callback, sabemos que los params de un callback
                // corresponden a req, res y next
                console.log('entro al apply callbacks')
                await callback.apply(this, params)
            } catch (error) {
                console.log(error)
                // params[1] hace referencia a res, por ello puedo mandar un send desde éste
                params[1].status(500).send(error)
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        console.log('entro al generateCustomResponses')
        // sendSuccess permitirá que el desarrollador sólo tenga que enviar el payload,
        // ya que el formato se gestionará de manera interna.
        res.sendSuccess = payload => res.send({status: "success", payload})
        res.sendServerError = error => res.status(500).send({status: "error", error})
        res.sendUserError = error => res.status(400).send({status: "error", error})
        next();
    }

    // middleware que comprueba que el usuario tenga un rol que este permitido para entrar
    // a la ruta a la que se esta queriendo acceder
    handlePolicies = policies => (req, res, next) => {
        console.log('entro al handle policies')
        if (policies[0] === "PUBLIC") return next(); // Cualquiera puede entrar
        // puedo enviar el token en el header de la peticion:
                // const authHeaders = req.headers.authorization;
                // if (!authHeaders) return res.status(401).send({status: "error", error: "Unauthorized"});
                // const token = authHeaders.split(" ")[1]; // Removemos el Bearer
        // o puedo enviar el token en una cookie:
        const token = req.signedCookies[JWT_COOKIE_NAME]
        if (!token) return res.send('Not Authenticated')
        // Obtenemos el usuario a partir del token
        let user = jwt.verify(token, JWT_PRIVATE_KEY) // verifico que el token tenga bien la palabra secreta de firma
        // ¿El rol del usuario eciste dentro del arreglo de políticas?
        console.log(user.role.toUpperCase())
        if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({error: "Unauthorized"})
        req.user = user;
        next();
    }
}