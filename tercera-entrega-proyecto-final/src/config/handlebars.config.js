
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
    // Registro el helper de handlebars para calcular el subtotal por producto
    hbs.handlebars.registerHelper('subTotal', function (quantity, price) {
        return (quantity * price)
    });
    // Registro el helper de handlebars para calcular el total del carrito
    hbs.handlebars.registerHelper('calculateTotal', function (products) {
        let totalAmount = 0
        products.forEach(item => {
            const precioProducto = item.product.price;
            const cantidadProducto = item.quantity;
            // Suma el producto de la cantidad por el precio de cada producto al total
            totalAmount += precioProducto * cantidadProducto;
        })
        return totalAmount
    });
    app.engine('handlebars', handlebars.engine())
    app.set('views', './src/views')
    app.set('view engine', 'handlebars')
}
