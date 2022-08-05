var express = require("express");
var router = express.Router();
const category = require("../models/category");
const product = require("../models/product");
require("dotenv").config();
router.post("/details/update/:id", function (req, res) {
  console.log(req.body.admin_key_update);
  if (
    req.body.admin_key_update === process.env.SECRET_DEl_UPDATE_KEY ||
    req.query.admin_key_update === process.env.SECRET_DEl_UPDATE_KEY
  ) {
    // console.log("hbdfhd");
    async function run() {
      try {
        const foundProduct = await product.findOne({ _id: req.params.id });
        console.log("found")
        console.log(foundProduct)
        if (foundProduct === null) {
          throw new Error("No such product exists");
        }
        const foundCategory = await category.findOne({
          title: foundProduct.category,
        });
        await product.deleteOne({ _id: req.params.id });
        console.log({
          title: req.body.title,
          description: req.body.description,
          image: req.body.image,
          price: req.body.price,
          category: foundCategory.title,
        });
        await product.create({
          title: req.body.title,
          description: req.body.description,
          image: req.body.image,
          price: req.body.price,
          category: foundCategory.title,
        });
        res.redirect(`/category/${foundCategory._id}`);
      } catch (error) {
        const regexp = /^Cast to ObjectId failed/;
        if (regexp.test(error.message)) {
          res.render("error", {
            message: "No such product exists! Bad ID.",
            error: { status: 400, stack: "bad request" },
          });
        } else {
          res.render("error", {
            message: error.message || error._message,
            error: { status: 400, stack: "bad request" },
          });
        }
      }
    }
    run();
  } else {
    res.render("error", {
      message: "Wrong admin key",
      error: { status: 400, stack: "bad request" },
    });
  }
});
router.post("/details/deletE/:id", function (req, res) {
  if (
    req.body.admin_key_delete === process.env.SECRET_DEl_UPDATE_KEY ||
    req.query.admin_key_delete === process.env.SECRET_DEl_UPDATE_KEY
  ) {
    async function run() {
      try {
        const foundProduct = await product.findOne({ _id: req.params.id });
        if (foundProduct === null) {
          throw new Error("No such product exists");
        }
        const foundCategory = await category.findOne({
          title: foundProduct.category,
        });
        await product.deleteOne({ _id: req.params.id });
        res.redirect(`/category/${foundCategory._id}`);
      } catch (error) {
        const regexp = /^Cast to ObjectId failed/;
        if (regexp.test(error.message)) {
          res.render("error", {
            message: "No such product exists! Bad ID.",
            error: { status: 400, stack: "bad request" },
          });
        } else {
          res.render("error", {
            message: error.message || error._message,
            error: { status: 400, stack: "bad request" },
          });
        }
      }
    }
    run();
  } else {
    res.render("error", {
      message: "Wrong admin key",
      error: { status: 400, stack: "bad request" },
    });
  }
});
router.get("/details/:id", function (req, res) {
  async function run() {
    try {
      const foundProduct = await product.findOne({ _id: req.params.id });
      res.render("productDetail", {
        title: foundProduct.title,
        product: foundProduct,
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

router.get("/:id", function (req, res) {
  async function run() {
    try {
      const catToRender = await category.find({ _id: req.params.id });
      const products = await product.find({ category: catToRender[0].title });
      res.render("categoryDetail", {
        title: catToRender[0].title,
        category: catToRender[0],
        products: products,
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
  async function runTop() {
    async function returnCategoryName() {
      const catArr = await category.find({ _id: req.params.id });
      return catArr;
    }
    const title = await returnCategoryName();
    if (title.length === 0) {
    } else {
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
