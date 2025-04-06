import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig'; 
import { toast } from 'react-toastify';

const SaleModal = ({ product, onClose, onSale }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity <= 0 || quantity > product.stockQuantity) {
      toast.error(`Quantity must be between 1 and ${product.stockQuantity}`);
      return;
    }
    setLoading(true);
    try {
      await axios.post('/sales', { productId: product._id, quantity: parseInt(quantity) });
      toast.success(`Sold ${quantity} ${product.name}(s)!`);
      onSale();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error recording sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sell {product.name}</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>
          <div className="modal-body">
            <p>Available Stock: {product.stockQuantity}</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max={product.stockQuantity}
                  className="form-control"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className={`btn ${loading ? 'btn-secondary' : 'btn-success'} w-100`}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Record Sale'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const StockOverview = () => {
  const [stockData, setStockData] = useState({ products: [], totalItemsSold: 0, totalRevenue: 0 });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [saleProduct, setSaleProduct] = useState(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      stockData.products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, stockData.products]);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token); 
      const response = await axios.get('/stock');
      console.log('Response:', response.data); 
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error.response || error); 
      toast.error(error.response?.data?.message || 'Error fetching stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleSale = () => {
    fetchStockData();
  };

  return (
    <div>
      <h2 className="mb-4 text-center">Stock Overview</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <ul className="list-group mb-4">
          {filteredProducts.map((product) => (
            <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{product.name} - Stock: {product.stockQuantity}</span>
              <button
                onClick={() => setSaleProduct(product)}
                className="btn btn-primary btn-sm"
                disabled={product.stockQuantity === 0}
              >
                Sell
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No products found.</p>
      )}
      <div className="card p-4">
        <h3 className="card-title">Analytics</h3>
        <p className="card-text">Total Items Sold: {stockData.totalItemsSold}</p>
        <p className="card-text">Total Revenue: ${stockData.totalRevenue.toFixed(2)}</p>
      </div>
      {saleProduct && (
        <SaleModal product={saleProduct} onClose={() => setSaleProduct(null)} onSale={handleSale} />
      )}
    </div>
  );
};

export default StockOverview;