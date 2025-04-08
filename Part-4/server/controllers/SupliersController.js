const { Supplier } = require('../models/Supliers');
const { Products } = require('../models/Prodcts');
const { Inventory } = require('../models/inventory');

const { generateToken } = require('../middleware/generateToken')
const bcrypt = require('bcryptjs'); // חבילת הצפנה לסיסמא
// יצירת דירה חדשה
exports.createSuplier = async (req, res) => {
  console.log('Request Body:', req.body);

  const { companyName, phone, products, password, email, contactPerson, } = req.body;//מקבל מהמבקש את כל הנתונים כדי ליצור ספק חדש

  try {
    // בדיקה אם המשתמש קיים
    const existingSuplier = await Supplier.findOne({ email: email });
    if (existingSuplier) {
      return res.status(409).json({ message: 'Suplier already exists' });
    }

    const salt = await bcrypt.genSalt(parseInt(6));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newSupplier = await Supplier.create({
      companyName, phone, products, password, email, contactPerson,
      password: hashedPassword,
    });
    if (products.length)
      for (const pro of products) {
        await Inventory.create({
          name: pro.name,
          quantity: pro.quantity,
          minQuantity: pro.minQuantity*2
        });
        try {
          await Products.create({
            name: pro.name,
            price: pro.price,
            minQuantity: pro.minQuantity,
            supplierId: newSupplier.id
          });
        } catch (error) {
          console.error('Error creating product:', error);
        }
      }
    res.status(201).json({ status: 'success', message: 'Supplier registered successfully', data: newSupplier });

  } catch (error) {
    console.error('Error registering Supplier:', error);
    res.status(500).json({ status: 'error', message: 'Server error during registration', details: error.message });
  }
};
exports.LoginSuplier = async (req, res) => {
  const { email, password } = req.body;

  try {
    const supplier = await Supplier.findOne({ email: email });
    if (!supplier) {
      return res.status(404).json({ status: 'error', message: 'supplier not found' });
    }

    // השוואת סיסמאות
    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    const token = generateToken(email, "suplier")
    res.status(200).send({ supplier: supplier._id, token: token })
  }
  catch (e) {
    console.log(e)
    res.send(e)
  }
};