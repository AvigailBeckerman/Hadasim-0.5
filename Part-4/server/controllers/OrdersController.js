const { Order } = require('../models/Orders');
const { Products } = require('../models/Prodcts');
const {Inventory} = require('../models/inventory');
exports.createOrder = async (req, res) => {
    console.log('Request Body:', req.body);
    const { products, supplierId } = req.body;

    if (products.length === 0) {
        return res.status(400).json({ status: 'error', message: 'products can not be empty' });
    }

    for (const pro of products) {
        try {
            const product = await Products.findOne({ _id: pro.productId });

            console.log(product, pro.quantity, pro.productId);

            if (product.minQuantity > pro.quantity) {
                return res.status(405).json({ status: 'error', message: 'the quantity is lower than the minQuantity' });
            }
        } catch (error) {
            console.error('Error checking product quantity:', error);
            return res.status(500).json({ status: 'error', message: 'Error checking product quantity' });
        }
    }

    try {
        const newOrder = await Order.create({
            products: products,
            status: "pending",
            supplierId: supplierId
        });

        for (const pro of products) {
            const productData = await Products.findById(pro.productId);

            if (!productData) continue; 

            const existingInventory = await Inventory.findOne({ name: productData.name });

            if (existingInventory) {
                existingInventory.quantity += pro.quantity;
                await existingInventory.save();
            } 
        }

        return res.status(201).json({
            status: 'success',
            message: 'newOrder registered successfully',
            data: newOrder
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error during order creation',
            details: error.message
        });
    }
};

exports.GetAllOrders = async (req, res) => {
    try {
        const AllOrder = await Order.find()
        .populate('products.productId', 'name price minQuantity')  // אין צורך לשנות את השם כאן, כי זה שם השדה במודל ה-Order
        .populate('supplierId', 'companyName phone contactPerson email'); 
        
        res.status(201).json( AllOrder );

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ status: 'error', message: 'Server error during getting all orders', details: error.message });
    }
};
exports.GetOrdersOnPending = async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const allOrdersOnWaiting = await Order.find({
            status: "pending",           // חיפוש לפי סטטוס הזמנה
            supplierId: id               // חיפוש לפי ID של הספק
        })
        .populate('products.productId', 'name price minQuantity')  // מלא את פרטי המוצר
        .populate('supplierId', 'companyName phone contactPerson email'); // מלא את פרטי הספק
        

        res.status(201).json( allOrdersOnWaiting );

    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ status: 'error', message: 'Server error during updating', details: error.message });
    }
};
exports.changeOrderStatusProcess = async (req, res) => {

    const id = req.params.id
    console.log(id)
    try {
        const changeOrderStatusProcess = await Order.findOneAndUpdate(
            { _id: id }, // החיפוש לפי ה-ID של ההזמנה
            { status: 'inProgress' }, // השדה שברצונך לעדכן
            { new: true } // אם ברצונך לקבל את המסמך המעודכן לאחר השינוי
        );

        res.status(201).json({ status: 'process' });

    } catch (error) {
        console.error('Error update order:', error);
        res.status(500).json({ status: 'error', message: 'Server Error update order', details: error.message });
    }
};
exports.changeOrderStatusComplete = async (req, res) => {
    const id = req.params.id
    try {
        const changeOrderStatusComplete = await Order.findOneAndUpdate(
            { _id: id }, // החיפוש לפי ה-ID של ההזמנה
            { status: 'completed' }, // השדה שברצונך לעדכן
            { new: true },
            { completionDate: Date.now }
        );

        res.status(201).json({ status: 'Complete' });

    } catch (error) {
        console.error('Error update order:', error);
        res.status(500).json({ status: 'error', message: 'Server Error update order', details: error.message });
    }
};