var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();
const category = require("../models/category");
const product = require("../models/product");
require("dotenv").config();

function validator(supposedAdminKey, supposedID) {
  if (supposedAdminKey !== process.env.SECRET_DEl_UPDATE_KEY) {
    throw new Error("Wrong Admin Key");
  }
  if (!mongoose.isValidObjectId(supposedID)) {
    throw new Error("Invalid ID");
  }
}

//update product
router.post("/details/update/:id", function (req, res) {
  async function run() {
    try {
      validator(req.body.admin_key_update, req.params.id);
      const foundProduct = await product.findOne({ _id: req.params.id });
      if (foundProduct === null) {
        throw new Error("No such product exists");
      }
      const beforeUpdate = await product.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title.trim(),
          description: req.body.description,
          image: req.body.image,
          price: req.body.price,
          category: foundProduct.category,
        },
        { runValidators: true }
      );
      res.redirect(`/category/${beforeUpdate.category}`);
    } catch (error) {
      res.render("error", {
        message: error.message || error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
});

//delete product
router.post("/details/deletE/:id", function (req, res) {
  async function run() {
    try {
      validator(req.body.admin_key_delete, req.params.id);
      const foundProduct = await product.findOne({ _id: req.params.id });
      if (foundProduct === null) {
        throw new Error("No such product exists");
      }
      const foundCategory = await category.findOne({
        title: foundProduct.category,
      });
      const d = await product.deleteOne({ _id: req.params.id });
      console.log(d);
      res.redirect(`/category/${foundCategory._id}`);
    } catch (error) {
      res.render("error", {
        message: error.message || error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
});
//product page
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
//update category
router.post("/update/:id", function (req, res) {
  async function run() {
    try {
      validator(req.body.admin_key_update, req.params.id);
      await category.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title.trim(),
          description: req.body.description,
          image: req.body.image,
        },
        { runValidators: true }
      );
      res.redirect(`/`);
    } catch (error) {
      res.render("error", {
        message: error.message || error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
});
//delete category
router.post("/deletE/:id", function (req, res) {
    async function run() {
      try {
        validator(req.body.admin_key_delete, req.params.id);
        await category.deleteOne({ _id: req.params.id });
        await product.deleteMany({ category: req.params.id });
        res.redirect(`/`);
      } catch (error) {
        res.render("error", {
          message: error.message || error._message,
          error: { status: 400, stack: "bad request" },
        });
      }
    }
    run();
});
//category page
router.get("/:id", function (req, res) {
  async function run() {
    try {
      const catToRender = await category.findOne({ _id: req.params.id });
      const products = await product.find({ category: catToRender._id });
      res.render("categoryDetail", {
        title: catToRender.title,
        category: catToRender,
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
//add item to category
router.post("/:id", function (req, res) {
  async function run() {
    try {
      if (!mongoose.isValidObjectId(req.params.id)||await category.findOne({_id:req.params.id})===null) {
        throw new Error("Invalid ID");
      }
      await product.create({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        category: req.params.id,
      });
      res.redirect("/");
    } catch (error) {
      res.render("error", {
        message: error.message || error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
});

module.exports = router;
