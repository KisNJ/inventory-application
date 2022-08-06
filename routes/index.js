var express = require("express");
var router = express.Router();
const category = require("../models/category");
const product = require("../models/product");
/* Categories listed*/
let categories = [];
router.get("/", function (req, res, next) {
  async function run() {
    categories = await category.find();
    let nC = [];
    async function createNewArr() {
      for (let i = 0; i < categories.length; i++) {
        let c = categories[i];
        let _id = c._id;
        let count = await product.countDocuments({ category: _id });
        nC.push({
          title: c.title,
          url: c.url,
          image: c.image,
          description: c.description,
          count,
        });
      }
    }
    await createNewArr();
    console.log(nC);
    res.render("index", { title: "Categories", categories: nC });
  }
  run();
});

//Add a new category
router.get("/new", function (req, res, next) {
  res.render("newCategory", { title: "Add new category" });
});
router.post("/new", function (req, res) {
  //category names must be unique
    async function run() {
      try {
        await category.create({
          title: req.body.title.trim(),
          description: req.body.description,
          image: req.body.image,
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
});

module.exports = router;
