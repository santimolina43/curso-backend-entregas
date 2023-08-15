import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()

app.use(express.urlencoded({extended:true}))
app.get('/products', async (req, res) => {
    const productsArray = await ProductManager.getProducts()
    const limit = parseInt(req.query.limit)
    if (limit) {
        let counter = 0
        let newProductsArray = productsArray.map(item => {
            counter ++
            if (counter < result.length) {
                return item
            }
        })
        res.send(newProductsArray)
    } else {
        res.send(productsArray)
    }
})