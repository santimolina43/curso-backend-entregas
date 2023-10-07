export const publicRoutes = (req, res, next) => {
    if (!req.session) res.redirect('/login')
    next()
}