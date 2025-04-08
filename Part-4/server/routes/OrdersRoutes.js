const express = require('express');
const OrdersController=require('../controllers/OrdersController');
const { verifyTokenSuplier ,verifyTokenAdmin} = require('../middleware/auth');
const router = express.Router();

router.get('/GetOrdersOnWaiting/:id',verifyTokenSuplier, OrdersController.GetOrdersOnPending);
router.get('/',verifyTokenAdmin,OrdersController.GetAllOrders);
router.put('/Process/:id',verifyTokenSuplier,OrdersController.changeOrderStatusProcess);
router.post('/',verifyTokenAdmin,OrdersController.createOrder);
router.put('/Complete/:id',verifyTokenAdmin,OrdersController.changeOrderStatusComplete);


module.exports = router;
