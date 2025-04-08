const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },           // שם המוצר
  quantity: { type: Number, default: 0 },            // כמה יש
  minQuantity: { type: Number, default: 0 },         // סף התראה
});
const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = { Inventory };
