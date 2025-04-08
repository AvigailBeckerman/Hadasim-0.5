const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    minQuantity: { type: Number, required: true },
    supplierId:{type:mongoose.Schema.Types.ObjectId,ref:"Supplier",required: true }
});

const Products = mongoose.model('Product', productsSchema);  // שם המודל הנכון

module.exports = { Products };
