import React, { useState, useEffect } from 'react';
import './Todo.css';
import axios from 'axios';
import { toast } from 'react-toastify';

function CategoryForm({ category, onSuccess, onError, closeModal }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    colorCode: '#000000',
    subTypes: []
  });
  const [newSubType, setNewSubType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        colorCode: category.colorCode || '#000000',
        subTypes: category.subTypes || []
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      let response;
      if (category) {
        // Update existing category
        response = await axios.put(`http://localhost:3000/api/categories/${category._id}`, formData, { headers });
        toast.success('Category updated successfully!');
      } else {
        // Create new category
        response = await axios.post('http://localhost:3000/api/categories', formData, { headers });
        toast.success('Category created successfully!');
      }
      
      if (response.status === 200 || response.status === 201) {
        // Reset form after successful submission
        setFormData({
          name: '',
          description: '',
          colorCode: '#000000',
          subTypes: []
        });
        setNewSubType('');
        
        // Notify parent component of success
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
      if (onError) {
        onError(error.response?.data?.message || 'Failed to save category');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubTypeAdd = () => {
    if (newSubType.trim()) {
      setFormData(prev => ({
        ...prev,
        subTypes: [...prev.subTypes, newSubType.trim()]
      }));
      setNewSubType('');
    }
  };

  const handleSubTypeRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      subTypes: prev.subTypes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <h2>{category ? 'Edit Category' : 'Create Category'}</h2>
      <div className="form-group">
        <label htmlFor="name">Category Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="colorCode">Color:</label>
        <input
          type="color"
          id="colorCode"
          name="colorCode"
          value={formData.colorCode}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>Sub Types:</label>
        <div className="subtype-input">
          <input
            type="text"
            value={newSubType}
            onChange={(e) => setNewSubType(e.target.value)}
            placeholder="Add sub type"
            disabled={isLoading}
          />
          <button type="button" onClick={handleSubTypeAdd} disabled={isLoading}>Add</button>
        </div>
        <div className="subtype-list">
          {formData.subTypes.map((subType, index) => (
            <div key={index} className="subtype-item">
              <span>{subType}</span>
              <button type="button" onClick={() => handleSubTypeRemove(index)} disabled={isLoading}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={closeModal} disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}

export default CategoryForm; 