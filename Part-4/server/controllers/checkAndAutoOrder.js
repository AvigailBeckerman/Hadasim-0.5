const { Inventory } = require('../models/inventory');
const { Products } = require('../models/Prodcts');
const { Order } = require('../models/Orders');

exports.checkAndAutoOrder = async () => {
    console.log("checkAndAutoOrder")
    try {
        // שלב 1: שלוף את כל המוצרים במלאי שמתחת למינימום
        const lowStockItems = await Inventory.find({
            $expr: { $lt: ["$quantity", "$minQuantity"] }
        });

        if (lowStockItems.length === 0) {
            return ({ status: 'success', message: 'All items in stock' });
        }

        const supplierOrders = {};

        for (const item of lowStockItems) {
            console.log(lowStockItems)
            const product = await Products.findOne({ name: item.name });

            if (!product || !product.supplierId) continue;

            const neededQuantity = item.minQuantity - item.quantity;

            if (!supplierOrders[product.supplierId]) {
                supplierOrders[product.supplierId] = [];
            }

            supplierOrders[product.supplierId].push({
                productId: product._id,
                quantity: neededQuantity > product.minQuantity ? neededQuantity : product.minQuantity//להזמין את הכמות הנצרכת המינלית הניתנת להזמנה מהספק
            });
            const existingInventory = await Inventory.findOne({ name: item.name });

            if (existingInventory) {
                existingInventory.quantity += neededQuantity > product.minQuantity ? neededQuantity : product.minQuantity;
                await existingInventory.save();
            } 
        }

        // שלב 3: צור הזמנות לפי ספק
        const createdOrders = [];

        for (const supplierId in supplierOrders) {
            const products = supplierOrders[supplierId];

            const newOrder = await Order.create({
                products: products,
                supplierId: supplierId,
                status: 'pending'
            });

            createdOrders.push(newOrder);
        }

        return ({
            status: 'success',
            message: 'Automatic orders created',
            data: createdOrders
        });

    } catch (error) {
        console.error('Auto-order error:', error);
        return ({
            status: 'error',
            message: 'Server error during automatic ordering',
            details: error.message
        });
    }
};
