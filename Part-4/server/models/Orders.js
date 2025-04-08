const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  status: { type: String, enum: ['pending', 'inProgress', 'completed'], default: 'pending' },
  orderDate: { type: Date, default: Date.now },
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product",  // מפנה למודל המוצרים
        required: true
      },
      quantity: { 
        type: Number, 
        required: true 
      }
    }
  ],
  completionDate: { type: Date },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = { Order };
