import { useState } from 'react';
import './ProductFilters.css';

const ProductFilters = ({ categories, onFilterChange, activeFilters }) => {
    const [searchTerm, setSearchTerm] = useState(activeFilters.search || '');
    const [selectedCategories, setSelectedCategories] = useState(activeFilters.categories || []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onFilterChange({
            search: value,
            categories: selectedCategories,
        });
    };

    const handleCategoryToggle = (categoryId) => {
        const newCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];

        setSelectedCategories(newCategories);
        onFilterChange({
            search: searchTerm,
            categories: newCategories,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
        onFilterChange({
            search: '',
            categories: [],
        });
    };

    const hasActiveFilters = searchTerm || selectedCategories.length > 0;

    return (
        <div className="product-filters">
            <div className="filters-header">
                <h3>Filters</h3>
                {hasActiveFilters && (
                    <button className="clear-filters-btn" onClick={handleClearFilters}>
                        Clear All
                    </button>
                )}
            </div>

            <div className="filters-content">
                <div className="filter-group">
                    <label htmlFor="search-input" className="filter-label">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        Search Products
                    </label>
                    <input
                        id="search-input"
                        type="text"
                        className="search-input"
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16v2H4zM4 10h12v2H4zM4 16h8v2H4z"></path>
                        </svg>
                        Categories
                    </label>
                    <div className="category-filters">
                        {categories.map(category => (
                            <label key={category.id} className="category-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleCategoryToggle(category.id)}
                                />
                                <span className="checkbox-label">{category.name}</span>
                                <span className="checkbox-custom"></span>
                            </label>
                        ))}
                    </div>
                    {selectedCategories.length > 0 && (
                        <div className="selected-categories-info">
                            {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
