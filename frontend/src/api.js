import axios from 'axios';

const API_BASE_URL = 'https://p6xckmgk-3000.inc1.devtunnels.ms/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get products with pagination and filters
export const getProducts = async (page = 1, limit = 3, search = '', categories = []) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    if (search) {
      params.append('search', search);
    }

    // if (categories && categories.length > 0) {
    //   // Categories are category names, not IDs
    //   params.append('categories', categories.join(','));
    // }

    
    // ✅ Send categoryIds as array params
    if (Array.isArray(categories) && categories.length > 0) {
      categories.forEach(id => {
        // console.log(id)
        params.append('categoryIds', id);
      });
    }

    // console.log(params)

    const response = await api.get(`/products?${params.toString()}`);

    // Backend returns { data: [...products], pagination: {...} }
    return {
      products: response.data.data || [],
      ...response.data.pagination,
    };
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch products' };
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    // Backend returns { data: [...categories] } or just [...categories]
    return {
      categories: response.data.data || response.data || [],
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return fallback categories
    return {
      categories: [
        // { id: 1, name: 'Electronics' },
        // { id: 2, name: 'Clothing' },
        // { id: 3, name: 'Computers' },
        // { id: 4, name: 'Mobile' },
      ]
    };
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    // Backend expects categoryIds but stores as category names
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create product' };
  }
};

// Update a product
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update product' };
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete product' };
  }
};

export default api;
