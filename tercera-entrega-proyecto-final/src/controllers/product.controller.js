import CartService from '../dao/services/cart.service.js';
import ProductService from '../dao/services/product.service.js'

const productService = new ProductService()
const cartService = new CartService()

/************************************/   
/************** VISTAS **************/   
/************************************/ 

export const getHomeProducts = async (req, res) => {
    // Armo la url para hacer la peticion a la api de los productos
    let requesturl = '/' + (req.query.limit ? `?limit=${req.query.limit}` : '?limit=10')
                         + (req.query.page ? `&page=${req.query.page}` : '&page=1')
                         + (req.query.category ? `&category=${req.query.category}` : '')
                         + (req.query.stock ? `&stock=${req.query.stock}` : '')
                         + (req.query.sort ? `&sort=${req.query.sort}` : '')
    // Hago la peticion a la api de los productos pasandole los query params que recibimos en /home
    fetch(`http://localhost:8080/products${requesturl}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
            throw new Error('No se pudo completar la solicitud.');
            }
            return response.json(); 
        })
        .then(products => {
            const user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name, 
                email: req.user.email, 
                age: req.user.age,
                role: req.user.role,
                cart: req.user.cart
            }
            res.render('home', { products, ...user })
        })
        .catch(error => {
            console.error('Ocurrió un error:', error);
        });
}

export const getRealTimeProducts = (req, res) => {
    res.render('realTimeProducts', {})
}


/************************************/   
/*************** API ****************/   
/************************************/ 
        
export const getProducts = async (req, res) => {
    // Query params opcionales para limitar, elegir la pagina y ordenar los documentos
    const { limit, page, sort } = req.query
    const filters = {limit: limit, page: page, sort: {price: sort}}
    // Query params opcionales para filtrar los documentos por categoria y stock mayor a 0
    const query = {};
    req.query.category ? (query.category = req.query.category) : null;
    req.query.stock ? (query.stock = { $gt: 0 }) : null;
    // Hago la consulta a la base de datos directamente desde el router y devuelvo error en caso de no haber respuesta
    const products = await productService.paginateProducts(query, filters)
    if (!products) return res.status(404).json({ status:"error", payload: 'No hay productos cargados'})
    // Armo una cadena de string con todos los queryparams menos la page
    let queryParams = ''
    queryParams = limit ? `${queryParams}&limit=${req.query.limit}` : queryParams
    queryParams = sort ? `${queryParams}&sort=${req.query.sort}` : queryParams
    queryParams = req.query.category ? `${queryParams}&category=${req.query.category}` : queryParams
    queryParams = req.query.stock ? `${queryParams}&stock=${req.query.stock}` : queryParams
    // Respondo la consulta con el formato solicitado
    const { totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = products
    res.status(200).json({
    status: "success", 
    payload: products.docs, 
    totalPages,
    prevPage,
    nextPage,
    page: products.page,
    hasPrevPage,
    hasNextPage,
    prevLink: hasPrevPage ? `http://localhost:8080/?page=${prevPage}${queryParams}` : null,
    nextLink: hasNextPage ? `http://localhost:8080/?page=${nextPage}${queryParams}` : null
    })
}

export const getProductsById = async (req, res) => {
    const id = req.params.pid
    const productoEncontrado = await productService.getProductByID(id)
    if (!productoEncontrado._id) return res.status(404).json({ status:"error", payload: productoEncontrado})
    res.status(200).json({ status: "success", payload: productoEncontrado })
}

export const addNewProduct = async (req, res) => {
    req.body.status = req.body.status == 'true' ? true : false
    req.body.thumbnail = `http://localhost:8080/imgs/${req.file.filename}`
    try {
        const newProduct = await productService.addProduct(req.body)
        if (!newProduct._id) return res.status(400).json({ status:"error", error: newProduct})
        res.status(200).json({ status: "success", payload: newProduct })
    } catch (error) {
        return res.status(400).json({ status:"error", payload: 'Error al añadir el producto'})
    }
}

export const updateProductById = async (req, res) => {
    const id = req.params.pid
    const updatedProduct = await productService.updateProduct(id, req.body)
    if (!updatedProduct._id) return res.status(404).json({ status:"error", payload: updatedProduct})
    res.status(200).json({status:'success', payload: updatedProduct})
}

export const deleteProductById = async (req, res) => {
    const id = req.params.pid
    const msgError = 'No existe ningun producto con ese id'
    const productDeletedMsg = await productService.deleteProduct(id)
    if (productDeletedMsg === msgError) return res.status(404).json({status:'error', payload: productDeletedMsg})
    const productDeletedFromCarts = await cartService.deleteProductFromAllCarts(id)
    if (productDeletedFromCarts === msgError) return res.status(404).json({status:'error', payload: productDeletedMsg})
    res.status(200).json({status: 'success', payload: productDeletedMsg})
}
