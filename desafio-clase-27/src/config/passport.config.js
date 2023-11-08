import passport from "passport"
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import passport_jwt from 'passport-jwt'
import { generateToken, generateRandomString, extractCookie, createHash, isValidPassword, JWT_PRIVATE_KEY, JWT_COOKIE_NAME, ADMIN_EMAIL, CLIENT_ID, CLIENT_SECRET, ADMIN_FALSE_ID, ADMIN_PASSWORD} from "../middlewares/auth-helpers.js"
import UserModel from "../dao/mongoDB/models/users.model.js"
import CartManager from "../dao/mongoDB/CartManager.js"

const cartManager = new CartManager()
const localStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy

const initializePassport = () => {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                return done(null, false)
            }
            const newCart = await cartManager.addCart([])
            const newUser = {
                first_name, 
                last_name, 
                email, 
                age, 
                password: createHash(password),
                cart: newCart._id
            }
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch(err) {
            return done(err)
        }
    }))

    passport.use('login', new localStrategy({
        usernameField: 'email',
    }, async(username, password, done) => {
        if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const adminUser = {
                first_name: 'Admin',
                last_name: 'User',
                email: username,
                age: 30,
                password: password,
                role: 'admin'
            } 
            return done(null, adminUser)
        } 
        try {
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                console.log('User not found')
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            // generamos el token con el user que inicia sesion
            const token = generateToken(user)
            // agregamos el token al user
            user.token = token   
            return done(null, user)
        } catch(err) {}
    }))

    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/session/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            const user = await UserModel.findOne({ email: profile._json.login+'@gmail.com' })
            if (user) return done(null, user) // si el usuario ya existe entonces devolvemos
                                              // null, user 
            // si el usuario no existia en nuestro sitio web, lo agregamos a la base de datos
            const newCart = await cartManager.addCart([])
            const newUser = {
                first_name: profile._json.login, 
                last_name: profile._json.login+'slastname', // notar como nos toca rellenar los datos que no vienen desde el perfil
                email: profile._json.login+'@gmail.com',
                age:18, // notar como nos toca rellenar los datos que no vienen desde el perfil
                password: createHash(generateRandomString(10)), // al ser autenticacion de terceros, no podemos asignar un password
                cart: newCart._id
            }
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch(err) {
            return done('Error to login with github')
        }
    }))

    // estrategia para extraer la cookie del usuairo iniciado en session y verificarlo
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: passport_jwt.ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        done(null, jwt_payload)
    }))


    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser(async(user, done) => {
        if (!user._id) {
            if (user.email === ADMIN_EMAIL) {
                const adminUser = {
                    _id: ADMIN_FALSE_ID,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    password: user.password,
                    role: user.role
                }
                done(null, adminUser)
            }
        } else {
            const dbUser = await UserModel.findById(user._id)
            done(null, dbUser)
        }
    })

}

export default initializePassport