require('dotenv').config();
const express = require('express');
require('express-async-errors');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const plotRoutes = require('./routes/plots');
const collectionRoutes = require('./routes/collections');
const maintenanceRoutes = require('./routes/maintenance');
const expenseRoutes = require('./routes/expenses');

const { errorHandler } = require('./utils/errors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/expenses', expenseRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
