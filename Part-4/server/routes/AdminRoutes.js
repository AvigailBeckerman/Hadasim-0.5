const express = require('express');
const AdminController=require('../controllers/AdminController')
const router = express.Router();

// יצירת דירה חדשה
router.post('/',AdminController.LoginAdmin);

// מחיקת דירה לפי ID

module.exports = router;
