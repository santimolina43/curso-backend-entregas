import ProductManager from './ProductManager.js'

const mockProduct1 = {
    title: 'Producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}
const mockProduct2 = {
    title: 'Producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc124',
    stock: 25
}
const mockProduct3 = {
    title: 'Producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc125',
    stock: 25
}
const mockProduct4 = {
    title: 'Producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc126',
    stock: 25
}
const mockProduct5 = {
    title: 'Producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc137',
    stock: 25
}
const mockProduct6 = {
    title: 'Producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc128',
    stock: 25
}
const mockProduct7 = {
    title: 'Producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc129',
    stock: 25
}
const mockProduct8 = {
    title: 'Producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc120',
    stock: 25
}
const productManager = new ProductManager('./data/products.json')

const test = async () => {
    // console.log(await productManager.addProduct(mockProduct1))
    // console.log(await productManager.addProduct(mockProduct2))
    // console.log(await productManager.addProduct(mockProduct3))
    // console.log(await productManager.addProduct(mockProduct4))
    // console.log(await productManager.addProduct(mockProduct5))
    // console.log(await productManager.addProduct(mockProduct6))
    // console.log(await productManager.addProduct(mockProduct7))
    // console.log(await productManager.addProduct(mockProduct8))
    // console.log(await productManager.getProducts())
    // console.log(await productManager.getProductByID(2))
}

test()
