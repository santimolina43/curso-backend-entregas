import { generateProduct } from "../utils/mockingProducts.js"


/************************************/   
/*************** API ****************/   
/************************************/ 
        
export const getMockingProducts = async (req, res) => {
    try {
        const products = []
        for (let index = 0; index < 100; index++) {
            products.push(generateProduct())
        }
        res.status(200).send({ status: 'success', payload: products })
    } catch (error) {
        return res.status(400).json({ status:"error", error: error})
    }
}
