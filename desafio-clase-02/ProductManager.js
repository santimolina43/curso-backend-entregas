
class ProductManager {
    #_products
    constructor() {
        this.#_products = [] 
    }
    
    getProducts() {
        return this.#_products
    }

    addProduct(product) {
        if (!product.title||!product.description||!product.price||!product.thumbnail||!product.code||!product.stock) {
            return '[ERR] No estan informados todos los campos necesarios para añadir el producto'
        }
        
        const found = this.#_products.find(item => item.code === product.code)
        if(found) {
            return '[ERR] Codigo invalido, ya existente.'
        } else {
            this.#_products.push({id: this.#getNextID(), ...product})
            return 'Agregado correctamente'
        }
    }                                                        

    #getNextID() {
        return this.#_products.length+1;
    }

    getproductByID(id) {
        const productFound = this.#_products.find(item => item.id === id)
        if (productFound) {
            return productFound
        } else {
            return '[ERR] No se encontró ningun producto con ese id'
        }
    }

}

const pm = new ProductManager()

console.log(pm.addProduct({
                title: 'fideos',
                description: 'fideos marolio',
                price: 120,
                thumbnail: 1500,
                code: 200,
                stock: 15
            }))
console.log(pm.addProduct({
                title: 'queso',
                description: 'queso rallado',
                price: 100,
                thumbnail: 1500,
                code: 201,
                stock: 10
            }))


console.log(pm.getProducts())

console.log(pm.getproductByID(4))