// Validate product form
export const validateProduct = (formData, existingProducts = [], editingId = null) => {
    const errors = {};

    // Name validation
    if (!formData.name || formData.name.trim() === '') {
        errors.name = 'Product name is required';
    } else {
        // Check for duplicate names (case-insensitive)
        const isDuplicate = existingProducts.some(
            product =>
                product.name.toLowerCase() === formData.name.toLowerCase() &&
                product.id !== editingId
        );
        if (isDuplicate) {
            errors.name = 'Product name already exists';
        }
    }

    // Description validation
    if (!formData.description || formData.description.trim() === '') {
        errors.description = 'Description is required';
    }

    // Quantity validation
    if (formData.quantity === '' || formData.quantity === null || formData.quantity === undefined) {
        errors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
        errors.quantity = 'Quantity must be a positive number';
    }

    // Categories validation
    if (!formData.categoryIds || formData.categoryIds.length === 0) {
        errors.categoryIds = 'At least one category must be selected';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
