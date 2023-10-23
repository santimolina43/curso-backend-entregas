import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Una PRIVATE_KEY sirve para utilizarse al momento de hacer el cifrado del token:
const PRIVATE_KEY = "CoderKeyQueFuncionaComoUnSecret"
export const ADMIN_EMAIL = 'adminCoder@coder.com';
export const ADMIN_PASSWORD = 'adminCod3r123';
export const CLIENT_ID = 'Iv1.c46505a98f4ce012';
export const CLIENT_SECRET = '3adc760e54100eaba6aa7393b28febf797946f73';
export const ADMIN_FALSE_ID = 'adminfalseid12345';

// generateToken: al utlilzar jwt.sign:
// El primer argumento es un objeto con la información
// El segundo argumento es la llave privada con la cual se realizará el cifrado
// El tercer argumento es el tiempo de expiración del token.
const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn:'24h'})
    return token
} 

const authToken = (req, res, next) => {
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

//helper function
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//helper function
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)
