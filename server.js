const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schemas
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String
}));

const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String,
  name: String
}));

// API endpoints
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/register', async (req, res) => {
  // Implement registration
});

app.post('/api/login', async (req, res) => {
  // Implement login
});

app.listen(5000, () => console.log('Server running on port 5000'));