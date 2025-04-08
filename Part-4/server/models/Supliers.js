const mongoose = require('mongoose');

// מודל סחורות (Goods)

// מודל ספקים (Suppliers)
const supplierSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  phone: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  products: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      minQuantity: { type: Number, required: true },
    },
  ],
});

const Supplier = mongoose.model('Supplier', supplierSchema);

// מודל הזמנות (Orders)


module.exports = { Supplier };
