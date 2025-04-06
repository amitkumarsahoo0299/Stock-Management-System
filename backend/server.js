const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'abc@0299'; 

app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/stockManagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stockQuantity: Number,
  description: String,
});
const Product = mongoose.model('Product', productSchema);

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  priceAtSale: Number,
  timestamp: { type: Date, default: Date.now },
});
const Sale = mongoose.model('Sale', saleSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};


app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});


app.get('/products', authenticateToken, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/products', authenticateToken, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

app.put('/products/:id', authenticateToken, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.delete('/products/:id', authenticateToken, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

app.get('/stock', authenticateToken, async (req, res) => {
  const products = await Product.find();
  const sales = await Sale.find().populate('productId');
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.quantity * sale.priceAtSale), 0);

  res.json({ products, totalItemsSold, totalRevenue });
});

app.post('/sales', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (product.stockQuantity < quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  product.stockQuantity -= quantity;
  await product.save();

  const sale = new Sale({
    productId,
    quantity,
    priceAtSale: product.price,
  });
  await sale.save();

  res.status(201).json(sale);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));