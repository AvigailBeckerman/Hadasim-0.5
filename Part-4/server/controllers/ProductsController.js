const { Products } = require('../models/Prodcts');

exports.GetAllProducts = async (req, res) => {
    try {
        const AllOrder = await Products.find();
        res.status(201).json(  AllOrder );

    } catch (error) {
        console.error('Error getting all products:', error);
        res.status(500).json({ status: 'error', message: 'Server error during getting products', details: error.message });
    }
};