import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport';
import crypto from 'crypto';

// Una PRIVATE_KEY sirve para utilizarse al momento de hacer el cifrado del token:
const PRIVATE_KEY = "CoderKeyQueFuncionaComoUnSecret"
export const MONGO_DB_URL = 'mongodb+srv://santimolina43:SantiMolina43@huapi.hudzda5.mongodb.net/';
// export const MONGO_DB_URL = "mongodb://127.0.0.1:27017";
export const MONGO_DB_NAME = 'ecommerce';
export const ADMIN_EMAIL = 'adminCoder@coder.com';
export const ADMIN_PASSWORD = 'adminCod3r123';
export const CLIENT_ID = 'Iv1.c46505a98f4ce012';
export const CLIENT_SECRET = '3adc760e54100eaba6aa7393b28febf797946f73';
export const ADMIN_FALSE_ID = 'adminfalseid12345';
export const JWT_PRIVATE_KEY = 'secret-jwt-santi'
export const JWT_COOKIE_NAME = 'userCookie'

// generateToken: al utlilzar jwt.sign:
// El primer argumento es un objeto con la información
// El segundo argumento es la llave privada con la cual se realizará el cifrado
// El tercer argumento es el tiempo de expiración del token.
export const generateToken = (user) => {
    const token = jwt.sign({user}, JWT_PRIVATE_KEY, {expiresIn:'24h'})
    return token
} 

// funcion para extraer el valor del token de la cookie
// export const extractCookie = req => (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
export const extractCookie = (req) => {
    return (req && req.signedCookies) ? req.signedCookies[JWT_COOKIE_NAME] : null;
}

export const authToken = (req, res, next) => {
    // Recordamos que el token viene desde los headers de autorización
    const authHeader = req.headers.authorizarion;
    if (!authHeader) return res.status(401).send({
        // Si no hay headers, es porque no hay token, y por lo tanto no está
        // autenticado
        error: "Not authenticated"
    })
    const token = authHeader.split(' ')[1]; // Se hace split para retirar 
                                            // la palabra 'Header'
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        // jwt verifica el token existente y corrobora si es un token
        // valido, alterado, expirado, etc
        if (error) return res.status(403).send({error: "Not authorized."})
        // Si todo está en orden, se decifra correctamente el token y se
        // envía el usuario
        req.user = credentials.user;
        next();
    })
} 

// funcion middleware para chequear si hay un usuario autenticado con passport.authenticate
export const passportCall = (strategy, authenticateOptions) => {
    return async (req, res, next) => {
        if (strategy == 'next') {next()}
        else {
            // Verifica si se proporcionó una opcion de autenticacion y ajusta la estrategia en consecuencia
            const authenticateOptionsParameter = authenticateOptions ? authenticateOptions : {};
            await passport.authenticate(strategy, authenticateOptionsParameter, function(err, user, info) {
                if (err) return next(err)
                if (!user) return res.status(401).render('login', {error: 'No tengo token!' })
                req.user = user
                next()
            })(req, res, next)
        }
    }
}

// funcion para manejar los permisos de las rutas para cada rol
export const handlePolicies = policies => (req, res, next) => {
    if (policies.includes('PUBLIC')) return next()
    const user = req.user.user || null
    if (!policies.includes(user.role.toUpperCase())) {
        return res.status(403).render('login', { error: 'No autorizado!'})
    }
    return next()
}

// Genera un string aleatorio de length caracteres
export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charactersLength);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}


//helper function
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// export const createHash = password => password

//helper function
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)
// export const isValidPassword = (user, password) => true
