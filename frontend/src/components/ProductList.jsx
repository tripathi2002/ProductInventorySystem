import ProductItem from './ProductItem';
import './ProductList.css';

const ProductList = ({ products, categories, onEdit, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="product-list-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="product-list-container">
                <div className="empty-state">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <path d="M16 8h6a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <line x1="1" y1="8" x2="23" y2="8"></line>
                    </svg>
                    <h3>No Products Found</h3>
                    <p>Start by adding your first product using the form above.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            <div className="product-grid">
                {products.map(product => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        categories={categories}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
