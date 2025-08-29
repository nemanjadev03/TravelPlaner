require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/travel_planner');

app.get('/', (req,res)=> res.send('Travel Planner API'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/graph', require('./routes/graph'));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(` Server running on http://localhost:${PORT}`));