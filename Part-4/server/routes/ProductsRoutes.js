const express = require('express');
const ProductsController=require('../controllers/ProductsController');
const { verifyTokenSuplier ,verifyTokenAdmin} = require('../middleware/auth');
const router = express.Router();

router.get('/',verifyTokenAdmin, ProductsController.GetAllProducts);


module.exports = router;
