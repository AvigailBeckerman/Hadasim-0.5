const express = require('express');
require('dotenv').config();


const cors = require('cors');
const app = express();
const session = require('express-session');
const SuplierRoute = require('./routes/SuplierRouter');
const OrdersRoute = require('./routes/OrdersRoutes');
const AdminRoute = require('./routes/AdminRoutes');
const ProductsRoute = require('./routes/ProductsRoutes');
const { checkAndAutoOrder } = require('./controllers/checkAndAutoOrder')
// הגדרת פורמט JSON בגוף הבקשות
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4200'],
  credentials: true
}));

// סנכרון עם מסד הנתונים (יצירת הטבלה אם היא לא קיימת)
const mongoose = require('mongoose');

// יצירת חיבור למונגו די-בי
console.log(process.env.DATABASE_URL)
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connection successful');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
// יצירת מסלול (route) בסיסי
const sessionConfig = {
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  saveUninitialized: true,
  resave: true,
  secret: 'hachiku1'
};
app.use(session(sessionConfig));

app.use('/api/Suplier', SuplierRoute);
app.use('/api/Orders', OrdersRoute);
app.use('/api/Admin', AdminRoute);
app.use('/api/Products', ProductsRoute);

//פעם בשעה בודק את המלאי ומזמין את המוצרים החסרים
setInterval(async () => {
  const result = await checkAndAutoOrder();
  console.log(result);
}, 60 * 1000 * 60);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
