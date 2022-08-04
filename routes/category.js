var express = require("express");
var router = express.Router();
const category = require("../models/category");
const product = require("../models/product");
router.get("/:id", function (req, res) {
  async function run() {
    try {
      const catToRender = await category.find({ _id: req.params.id });
      const products=await product.find({category:catToRender[0].title})
      console.log(products)
      res.render("categoryDetail", {
        title: catToRender[0].title,
        category: catToRender[0],
        products:products
      });
    } catch (error) {
      res.render("error", {
        message: error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
});
router.post("/:id", function (req, res) {
console.log(req.params)
  async function runTop() {
    async function returnCategoryName() {
      const catArr = await category.find({ _id: req.params.id });
      return catArr;
    }
    const title = await returnCategoryName();
    if (title.length === 0) {
    } else {
    console.log(title)
      async function run() {
        try {
          const productCreated = await product.create({
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            price: req.body.price,
            category: title[0].title,
          });
          res.redirect("/");
        } catch (error) {
          res.render("error", {
            message: error._message,
            error: { status: 400, stack: "bad request" },
          });
        }
      }
      run();
    }
  }
  runTop();
});

module.exports = router;