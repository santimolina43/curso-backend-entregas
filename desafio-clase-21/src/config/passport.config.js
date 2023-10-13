import passport from "passport"
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { createHash, isValidPassword } from "../utils.js"
import UserModel from "../dao/models/user.model.js"

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
        try {
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch(err) {}
    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.0545ae50bd87f751',
        clientSecret: 'caf4af878f8cea8345fdf1d337ecc3f1fc624877',
        callbackURL: 'http://localhost:8080/session/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile) // Recomendado hacer un console.log de toda la informacion
                                 // que viene del perfil
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) return done(null, user) // si el usuario ya existe entonces devolvemos
                                              // null, user 
            // si el usuario no existia en nuestro sitio web, lo agregamos a la base de datos
            const newUser = await UserModel.create({
                first_name: profile._json.name, 
                last_name: '', // notar como nos toca rellenar los datos que no vienen desde el perfil
                age:18, // notar como nos toca rellenar los datos que no vienen desde el perfil
                email: profile._json.email,
                password: '' // al ser autenticacion de terceros, no podemos asignar un password
            })
            return done(null, newUser)
        } catch(err) {
            return done('Error to login with github')
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport