var express = require("express");
var router = express.Router();
const categoryController = require("../controllers/categoryController");
/* Categories listed*/
router.get("/", categoryController.get_categories);

//Add a new category
router.get("/new", function (req, res, next) {
  res.render("newCategory", { title: "Add new category" });
});
router.post("/new", categoryController.new_category);

module.exports = router;
