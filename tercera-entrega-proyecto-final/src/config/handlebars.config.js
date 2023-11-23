
import handlebars from 'express-handlebars'

export const setHandlebars = (app) => {
    // Configuración de Handlebars
    const hbs = handlebars.create({
        // Configuración adicional de Handlebars
    });
    // Registro el helper de handlebars para evaluar si el usuario es admin
    hbs.handlebars.registerHelper('isAdmin', function (value) {
        if (value === "admin") return true
        return false;
    });
    app.engine('handlebars', handlebars.engine())
    app.set('views', './src/views')
    app.set('view engine', 'handlebars')
}
