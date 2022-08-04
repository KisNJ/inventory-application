var express = require("express");
var router = express.Router();
const category = require("../models/category");
const product = require("../models/product");
/* GET home page. */
let categories = [];
router.get("/", function (req, res, next) {
  async function run() {
    categories = await category.find();
    let nC = [];
    async function createNewArr() {
      for (let i = 0; i < categories.length; i++) {
        let c = categories[i];
        let title = c.title;
        let count = await product.countDocuments({ category: title });
        nC.push({title:c.title,url:c.url,image:c.image,description:c.description, count });
      }
    }
    await createNewArr()
    console.log(nC);
    res.render("index", { title: "Categories", categories: nC });
  }
  run();
});
router.get("/new", function (req, res, next) {
  res.render("newCategory", { title: "Add new category" });
});
router.post("/new", function (req, res) {
  async function run() {
    try {
      const categoryCreated = await category.create({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
      });
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.render("error", {
        message: error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
});

module.exports = router;
