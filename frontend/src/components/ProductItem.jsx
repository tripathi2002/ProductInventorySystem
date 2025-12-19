import './ProductItem.css';

const ProductItem = ({ product, categories, onEdit, onDelete }) => {
    const getProductCategories = () => {
        // Backend returns categories as an array of strings
        if (!product.categories || !Array.isArray(product.categories)) return [];
        return product.categories.map(catName => ({ id: catName, name: catName }));
    };

    const productCategories = getProductCategories();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const categoryColors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
        '#10b981', '#3b82f6', '#ef4444', '#14b8a6'
    ];

    const getCategoryColor = (index) => {
        return categoryColors[index % categoryColors.length];
    };

    return (
        <div className="product-item">
            <div className="product-header">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-quantity">
                    <span className="quantity-label">Qty:</span>
                    <span className="quantity-value">{product.quantity}</span>
                </div>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-categories">
                {productCategories.length > 0 ? (
                    productCategories.map((category, index) => (
                        <span
                            key={category.id}
                            className="category-tag"
                            style={{ backgroundColor: getCategoryColor(index) }}
                        >
                            {category.name}
                        </span>
                    ))
                ) : (
                    <span className="no-categories">No categories</span>
                )}
            </div>

            <div className="product-footer">
                <div className="product-date">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{formatDate(product.created_at)}</span>
                </div>

                <div className="product-actions">
                    {/* <button
                        className="btn-action btn-edit"
                        onClick={() => onEdit(product)}
                        title="Edit product"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button> */}
                    <button
                        className="btn-action btn-delete"
                        onClick={() => onDelete(product)}
                        title="Delete product"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
