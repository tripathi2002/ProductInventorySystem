import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import ProductFilters from "./components/ProductFilters";
import Pagination from "./components/Pagination";

import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 5;

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
  });

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters or page changes
  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories || data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      // Set some default categories for demo if API fails
      setCategories([
        // { id: 1, name: 'Electronics' },
        // { id: 2, name: 'Accessories' },
        // { id: 3, name: 'Computers' },
        // { id: 4, name: 'Mobile' },
      ]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(
        currentPage,
        productsPerPage,
        filters.search,
        filters.categories
      );

      setProducts(data.products || data.data || []);
      setTotalPages(
        data.totalPages || Math.ceil((data.total || 0) / productsPerPage) || 1
      );
      setTotalProducts(data.total || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData);
      toast.success("Product created successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage = error.message || "Failed to create product";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleUpdateProduct = async (productData) => {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, productData);
      toast.success("Product updated successfully!");
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage = error.message || "Failed to update product";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEditProduct = (product) => {
    // Convert category names to category IDs for editing
    const categoryIds = product.categories
      ? product.categories
          .map((catName) => {
            const cat = categories.find((c) => c.name === catName);
            return cat ? cat.id : null;
          })
          .filter(Boolean)
      : [];

    setEditingProduct({
      ...product,
      categoryIds,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (product) => {
    setProductToDelete(product);
  };

  // const handleDeleteProduct = async (product) => {
  //   const confirmed = window.confirm(
  //     `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
  //   );

  //   if (!confirmed) return;

  //   try {
  //     await deleteProduct(product.id);
  //     toast.success('Product deleted successfully!');

  //     // If we deleted the last item on a page and it's not page 1, go back one page
  //     if (products.length === 1 && currentPage > 1) {
  //       setCurrentPage(currentPage - 1);
  //     } else {
  //       fetchProducts();
  //     }
  //   } catch (error) {
  //     console.error('Error deleting product:', error);
  //     const errorMessage = error.message || 'Failed to delete product';
  //     toast.error(errorMessage);
  //   }
  // };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      toast.success("Product deleted successfully!");

      if (products.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 7h-9"></path>
              <path d="M14 17H5"></path>
              <circle cx="17" cy="17" r="3"></circle>
              <circle cx="7" cy="7" r="3"></circle>
            </svg>
            <div>
              <h1>Product Inventory System</h1>
              <p className="header-subtitle">
                Manage your products efficiently
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-value">{totalProducts}</span>
              <span className="stat-label">Total Products</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{categories.length}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <ProductForm
            onSubmit={
              editingProduct ? handleUpdateProduct : handleCreateProduct
            }
            categories={categories}
            editingProduct={editingProduct}
            existingProducts={products}
            onCancel={handleCancelEdit}
          />

          <ProductFilters
            categories={categories}
            onFilterChange={handleFilterChange}
            activeFilters={filters}
          />

          <div className="results-header">
            <h2>Products</h2>
            {!loading && products.length > 0 && (
              <span className="results-count">
                Showing {products.length} of {totalProducts} products
              </span>
            )}
          </div>

          <ProductList
            products={products}
            categories={categories}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            loading={loading}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          &copy; 2025 Product Inventory System. Built with React & MERN Stack.
        </p>
      </footer>
      
      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="modal-overlay">
          <div className="delete-card">
            <h3>Delete Product</h3>

            <p>
              Are you sure you want to delete
              <strong> "{productToDelete.name}"</strong>?
            </p>

            <p className="warning-text">This action cannot be undone.</p>

            <div className="actions">
              <button
                className="btn cancel"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                className="btn delete"
                onClick={confirmDeleteProduct}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
