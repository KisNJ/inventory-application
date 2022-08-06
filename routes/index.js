var express = require("express");
var router = express.Router();
const category = require("../models/category");
const product = require("../models/product");
const fileUpload = require("express-fileupload");
const fs = require("fs");
router.use(fileUpload());
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
          image: c.imgSrc,
          description: c.description,
          count,
        });
      }
    }
    await createNewArr();

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
      if (req.files === null) {
        await category.create({
          title: req.body.title.trim(),
          description: req.body.description,
          image: "",
        });
      } else {
        await category.create({
          title: req.body.title.trim(),
          description: req.body.description,
          image: {
            data: req.files.image.data,
            contentType: req.files.image.mimetype,
          },
        });
      }

      res.redirect("/");
    } catch (error) {
      console.log(error)
      res.render("error", {
        message: error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
});

module.exports = router;
