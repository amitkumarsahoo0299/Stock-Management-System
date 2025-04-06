import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig'; 
import { toast } from 'react-toastify';

const ProductForm = ({ product, onSave, loading }) => {
  const [formData, setFormData] = useState(product || { name: '', category: '', price: '', stockQuantity: '', description: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be a positive number';
    if (!formData.stockQuantity || formData.stockQuantity < 0) newErrors.stockQuantity = 'Stock must be non-negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token); // Debug: Log the token
      if (product) {
        await axios.put(`/products/${product._id}`, formData);
        toast.success('Product updated successfully!');
      } else {
        await axios.post('/products', formData); // Debug point
        toast.success('Product added successfully!');
      }
      onSave();
    } catch (error) {
      console.error('Error saving product:', error.response || error); // Debug: Log full error
      toast.error(error.response?.data?.message || 'Error saving product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4">
      <div className="mb-3">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          disabled={loading}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      <div className="mb-3">
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className={`form-control ${errors.category ? 'is-invalid' : ''}`}
          disabled={loading}
        />
        {errors.category && <div className="invalid-feedback">{errors.category}</div>}
      </div>
      <div className="mb-3">
        <input
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className={`form-control ${errors.price ? 'is-invalid' : ''}`}
          disabled={loading}
        />
        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
      </div>
      <div className="mb-3">
        <input
          name="stockQuantity"
          type="number"
          value={formData.stockQuantity}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className={`form-control ${errors.stockQuantity ? 'is-invalid' : ''}`}
          disabled={loading}
        />
        {errors.stockQuantity && <div className="invalid-feedback">{errors.stockQuantity}</div>}
      </div>
      <div className="mb-3">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="form-control"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className={`btn ${loading ? 'btn-secondary' : 'btn-success'} w-100`}
        disabled={loading}
      >
        {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
};

const ProductList = ({ products, onEdit, onDelete, loading }) => (
  <ul className="list-group">
    {products.map((product) => (
      <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
        <span>
          {product.name} ({product.category}) - ${product.price} - Stock: {product.stockQuantity}
        </span>
        <div>
          <button
            onClick={() => onEdit(product)}
            className="btn btn-primary btn-sm me-2"
            disabled={loading}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="btn btn-danger btn-sm"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
);

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.response || error);
      toast.error(error.response?.data?.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/products/${id}`);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-center">Product Management</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>
      <ProductForm product={editingProduct} onSave={handleSave} loading={loading} />
      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      ) : (
        <p className="text-center mt-4">No products found.</p>
      )}
    </div>
  );
};

export default ProductManagement;