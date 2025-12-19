const express = require("express");
const router = express.Router();
const Joi = require("joi");

const productController = require("../controllers/product.controller");

const { validate } = require("../middlewares/validate.middleware");
const {
  createProductSchema,
  listProductsSchema,
} = require("../validations/product.validation");

router.post(
  "/",
  validate(createProductSchema),
  productController.createProduct
);
router.get(
  "/",
  validate(listProductsSchema, "query"),
  productController.listProducts
);
router.delete(
  "/:id",
  validate(
    Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    "params"
  ),
  productController.deleteProduct
);

module.exports = router;
