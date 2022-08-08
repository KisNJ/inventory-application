var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
require("dotenv").config();

//update product
router.post("/details/update/:id", productController.update_product);
//delete product
router.post("/details/deletE/:id", productController.delete_product);
//product page
router.get("/details/:id", productController.get_product);

//update category
router.post("/update/:id", categoryController.update_category);
//delete category
router.post("/deletE/:id", categoryController.delete_category);
//category page
router.get("/:id", categoryController.get_category);
//add item to category
router.post("/:id", categoryController.add_item_to_category);

module.exports = router;
