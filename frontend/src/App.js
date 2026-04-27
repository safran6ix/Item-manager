import React, { useState, useEffect } from 'react';
import { getItems, createItem, updateItem, deleteItem } from './api';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: ''  // NEW FIELD
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load items when page loads
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await getItems();
      setItems(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load items');
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      setError('Name and price are required');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // Update existing item
        await updateItem(editingId, formData);
        setEditingId(null);
      } else {
        // Create new item
        await createItem(formData);
      }

      // Reset form and reload items
      setFormData({ name: '', price: '', category: '' });
      await loadItems();
      setError('');
    } catch (err) {
      setError('Operation failed');
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category || ''
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      try {
        await deleteItem(id);
        await loadItems();
      } catch (err) {
        setError('Delete failed');
      }
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', category: '' });
  };

  return (
    <div className="container">
      <h1 className='main-title'>Item Manager</h1>

      {error && <div className="error">{error}</div>}

      {/* Form to Add/Edit Item */}
      <form onSubmit={handleSubmit} className="item-form">
        <h2>{editingId ? 'Edit Item' : 'Add New Item'}</h2>

        <input
          type="text"
          name="name"
          placeholder="Item Name *"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price *"
          value={formData.price}
          onChange={handleChange}
          required
        />

        {/* NEW FIELD INPUT */}
        <input
          type="text"
          name="category"
          placeholder="Category (Optional)"
          value={formData.category}
          onChange={handleChange}
        />

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {editingId ? 'Update' : 'Add'} Item
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Items List */}
      <div className="items-list">
        <h2 className='items-title'>Items ({items.length})</h2>
        {loading && <p>Loading...</p>}

        {items.length === 0 && !loading && (
          <p>No items yet. Add your first item!</p>
        )}

        {items.map(item => (
          <div key={item._id} className="item-card">
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              {/* NEW FIELD DISPLAY */}
              <p className="category">Category: {item.category || 'Uncategorized'}</p>
              <small>Added: {new Date(item.createdAt).toLocaleDateString()}</small>
            </div>
            <div className="item-actions">
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;