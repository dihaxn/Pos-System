const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// All frontend routes through BFF
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/outlets', require('./routes/outletRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/returns', require('./routes/returnRoutes'));
app.use('/api/factory-orders', require('./routes/factoryOrderRoutes'));
app.use('/api/customer-orders', require('./routes/customerOrderRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportingRoutes'));

app.use(errorHandler);

module.exports = app;


