export const publicRoutes = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    next()
}

export const privateRoutes = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role !== 'admin') res.redirect('/profile')
    next()
}

export const loginRoutes = (req, res, next) => {
    if (req.session.user) res.redirect('/')
    next()
}