import { useState, useEffect } from 'react';
import './ProductForm.css';
import { validateProduct } from '../utils/validation';

const ProductForm = ({
    onSubmit,
    categories,
    editingProduct,
    existingProducts,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: '',
        categoryIds: [],
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name || '',
                description: editingProduct.description || '',
                quantity: editingProduct.quantity || '',
                categoryIds: editingProduct.categoryIds || [],
            });
        }
    }, [editingProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleCategoryChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(parseInt(options[i].value));
            }
        }
        setFormData(prev => ({
            ...prev,
            categoryIds: selected,
        }));

        if (errors.categoryIds) {
            setErrors(prev => ({
                ...prev,
                categoryIds: '',
            }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({
            ...prev,
            [field]: true,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            name: true,
            description: true,
            quantity: true,
            categoryIds: true,
        });

        // Validate form
        const validation = validateProduct(
            formData,
            existingProducts,
            editingProduct?.id
        );

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                quantity: parseInt(formData.quantity),
            });

            // Reset form after successful submission
            setFormData({
                name: '',
                description: '',
                quantity: '',
                categoryIds: [],
            });
            setTouched({});
            setErrors({});
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            name: '',
            description: '',
            quantity: '',
            categoryIds: [],
        });
        setTouched({});
        setErrors({});
        onCancel();
    };

    return (
        <div className="product-form-container">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="name">Product Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        className={touched.name && errors.name ? 'error' : ''}
                        placeholder="Enter product name"
                    />
                    {touched.name && errors.name && (
                        <span className="error-message">{errors.name}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={() => handleBlur('description')}
                        className={touched.description && errors.description ? 'error' : ''}
                        placeholder="Enter product description"
                        rows="3"
                    />
                    {touched.description && errors.description && (
                        <span className="error-message">{errors.description}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Quantity *</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        onBlur={() => handleBlur('quantity')}
                        className={touched.quantity && errors.quantity ? 'error' : ''}
                        placeholder="Enter quantity"
                        min="0"
                    />
                    {touched.quantity && errors.quantity && (
                        <span className="error-message">{errors.quantity}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="categories">Categories * (Hold Ctrl/Cmd to select multiple)</label>
                    <select
                        id="categories"
                        multiple
                        value={formData.categoryIds.map(String)}
                        onChange={handleCategoryChange}
                        onBlur={() => handleBlur('categoryIds')}
                        className={touched.categoryIds && errors.categoryIds ? 'error multi-select' : 'multi-select'}
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <div className="selected-categories">
                        {formData.categoryIds.length > 0 && (
                            <span className="selected-count">
                                {formData.categoryIds.length} categor{formData.categoryIds.length === 1 ? 'y' : 'ies'} selected
                            </span>
                        )}
                    </div>
                    {touched.categoryIds && errors.categoryIds && (
                        <span className="error-message">{errors.categoryIds}</span>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingProduct && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancelEdit}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
