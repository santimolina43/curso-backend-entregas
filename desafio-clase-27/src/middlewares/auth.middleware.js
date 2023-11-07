export const publicRoutes = (req, res, next) => {
    if (!req.isAuthenticated()) res.redirect('/login')
    else next()
}

export const privateRoutes = (req, res, next) => {
    if (!req.user) res.redirect('/login')
    if (req.user.role !== 'admin') res.redirect('/profile')
    next()
}

export const loginRoutes = (req, res, next) => {
    if (req.user) res.redirect('/')
    next()
}
