const express = require('express');
const suplierController=require('../controllers/SupliersController')
const router = express.Router();

// יצירת דירה חדשה
router.post('/register',suplierController.createSuplier);
router.post('/login',suplierController.LoginSuplier);

// מחיקת דירה לפי ID

module.exports = router;
