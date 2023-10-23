import passport from "passport"
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { createHash, isValidPassword, ADMIN_EMAIL, CLIENT_ID, CLIENT_SECRET, ADMIN_FALSE_ID} from "../helpers/auth-helpers.js"
import UserModel from "../dao/mongoDB/models/users.model.js"


const localStrategy = local.Strategy

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
            const newUser = {
                first_name, last_name, email, age, password: createHash(password)
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
        if (username === ADMIN_EMAIL) {
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
                console.log('este error')
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch(err) {}
    }))

    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/session/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile) // Recomendado hacer un console.log de toda la informacion
                                 // que viene del perfil
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) return done(null, user) // si el usuario ya existe entonces devolvemos
                                              // null, user 
            // si el usuario no existia en nuestro sitio web, lo agregamos a la base de datos
            const newUser = await UserModel.create({
                first_name: profile._json.login, 
                last_name: '', // notar como nos toca rellenar los datos que no vienen desde el perfil
                age:18, // notar como nos toca rellenar los datos que no vienen desde el perfil
                email: profile._json.login+'@gmail.com',
                password: '' // al ser autenticacion de terceros, no podemos asignar un password
            })
            return done(null, newUser)
        } catch(err) {
            return done('Error to login with github')
        }
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