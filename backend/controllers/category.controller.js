const categoryService = require('../services/category.service');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
