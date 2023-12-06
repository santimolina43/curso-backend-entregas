import jwt from 'jsonwebtoken';
import { env_parameters_obj } from '../app.js';

export const renderLogin = (req, res) => { 
    res.render('login', {})
}

export const renderRegister = (req, res) => {
    res.render('register', {})
}

export const registerCallback = async (req, res) => {
    res.redirect('/session/login')
}

export const login = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
    }
    const userPayload = {
        _id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        role: req.user.role
        };
    let token = jwt.sign(userPayload, 'secret-jwt-santi', {expiresIn: '24h'}) 
    res.cookie(env_parameters_obj.jwt.jwtCookieName, token, { signed: true }).sendSuccess('inicio de sesion exitoso')
}

export const githubCallback = async(req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
    }
    const userPayload = {
        _id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        role: req.user.role
      };
    let token = jwt.sign(userPayload, 'secret-jwt-santi', {expiresIn: '24h'}) 
    res.cookie(env_parameters_obj.jwt.jwtCookieName, token, { signed: true }).redirect('/')
}

export const logout = (req, res) => {
    res.clearCookie(env_parameters_obj.jwt.jwtCookieName).redirect('/')
}