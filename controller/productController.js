const path = require('path')
const productModel = require('../model/productModel')
const createProduct = async (req, res) => {

    //check incoming data
    console.log(req.body)
    console.log(req.files)

    //Destructuring the body data(json)
    const { productName, productPrice, productCategory, productDescription } = req.body;

    //Validation
    if (!productName || !productPrice || !productCategory || !productDescription) {
        return res.status(400).json({
            "sucess": false,
            "message": "Eanter all fields"
        })
    }

    //validate if there is image
    if (!req.files || !req.files.productImage) {
        return res.status(400).json({
            "sucess": false,
            "message": "Image not found!"
        })
    }
    const { productImage } = req.files;

    //upload image
    //1. Generate new image name (abc.png)->(21343-abc.png)
    const imageName = ` ${Date.now()}-${productImage.name}`

    //2. Make a upload path (/path/upload - diractory)
    const imageUploadPath = path.join(__dirname, `../public/products${imageName}`)

    //3. Move to that directory (await, try-catch)
    try {
        await productImage.mv(imageUploadPath)

        // save to data base 
        const newProduct = new productModel({
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productDescription: productDescription,
            productImage: imageName
        })
        const product = await newProduct.save()
        res.status(201).json({
            "success": true,
            "message": "Product Created Successfully",
            "data": product
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error!",
            "error": error
        })

    }
};

module.exports = {
    createProduct
};