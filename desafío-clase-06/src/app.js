import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
const productManager = new ProductManager('./data/products.json')

app.use(express.urlencoded({extended:true}))
app.get('/products', async (req, res) => {
    const productsArray = await productManager.getProducts()
    const limit = parseInt(req.query.limit)
    if (limit || limit===0) {
        let limitProductsArray = productsArray.slice(0, limit).map(item => item)
        res.status(200).json(limitProductsArray)
    } else {
        res.status(200).json(productsArray)
    }
})

app.get('/products/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const productoEncontrado = await productManager.getProductByID(id) 
    res.status(200).json(productoEncontrado)
})

app.listen(8080, () => console.log('server up')) 