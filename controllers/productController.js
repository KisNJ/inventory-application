const mongoose=require("mongoose")
const product = require("../models/product");
const category = require("../models/category");

function validator(supposedAdminKey, supposedID) {
  if (supposedAdminKey !== process.env.SECRET_DEl_UPDATE_KEY) {
    throw new Error("Wrong Admin Key");
  }
  if (!mongoose.isValidObjectId(supposedID)) {
    throw new Error("Invalid ID");
  }
}
exports.update_product = function (req, res) {
  async function run() {
    try {
      validator(req.body.admin_key_update, req.params.id);
      const foundProduct = await product.findOne({ _id: req.params.id });
      if (foundProduct === null) {
        throw new Error("No such product exists");
      }
      let beforeUpdate = {};
      if (req.files === null) {
        beforeUpdate = await product.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              title: req.body.title.trim(),
              description: req.body.description,
              price: req.body.price,
              category: foundProduct.category,
            },
          },
          { runValidators: true }
        );
      } else {
        beforeUpdate = await product.findByIdAndUpdate(
          req.params.id,
          {
            title: req.body.title.trim(),
            description: req.body.description,
            image: {
              data: req.files.image.data,
              contentType: req.files.image.mimetype,
            },
            price: req.body.price,
            category: foundProduct.category,
          },
          { runValidators: true }
        );
      }

      res.redirect(`/category/${beforeUpdate.category}`);
    } catch (error) {
      res.render("error", {
        message: error.message || error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
};

exports.delete_product = function (req, res) {
  async function run() {
    try {
      validator(req.body.admin_key_delete, req.params.id);
      const foundProduct = await product.findOne({ _id: req.params.id });
      if (foundProduct === null) {
        throw new Error("No such product exists");
      }
      const foundCategory = await category.findOne({
        _id: foundProduct.category,
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
};

exports.get_product=function (req, res) {
    async function run() {
      try {
        if (!mongoose.isValidObjectId(req.params.id)) {
          throw new Error("Invalid ID");
        }
        const foundProduct = await product.findOne({ _id: req.params.id });
        res.render("productDetail", {
          title: foundProduct.title,
          product: foundProduct,
        });
      } catch (error) {
        res.render("error", {
          message: error.message || error._message,
          error: { status: 400, stack: "bad request" },
        });
      }
    }
    run();
  }