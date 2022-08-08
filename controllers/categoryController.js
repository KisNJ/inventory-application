const mongoose=require("mongoose")
const category = require("../models/category");
const product = require("../models/product");
function validator(supposedAdminKey, supposedID) {
  if (supposedAdminKey !== process.env.SECRET_DEl_UPDATE_KEY) {
    throw new Error("Wrong Admin Key");
  }
  if (!mongoose.isValidObjectId(supposedID)) {
    throw new Error("Invalid ID");
  }
}
exports.new_category = function (req, res) {
  async function run() {
    try {
      if (req.files === null) {
        await category.create({
          title: req.body.title.trim(),
          description: req.body.description,
          image: {
            data: "undefined",
            contentType: "undefined",
          },
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
      res.render("error", {
        message: error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
};
exports.get_categories = function (req, res) {
  let categories = [];
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
};

exports.update_category = function (req, res) {
  async function run() {
    try {
      validator(req.body.admin_key_update, req.params.id);

      if (req.files === null) {
        await category.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              title: req.body.title.trim(),
              description: req.body.description,
            },
          },
          { runValidators: true }
        );
      } else {
        await category.findByIdAndUpdate(
          req.params.id,
          {
            title: req.body.title.trim(),
            description: req.body.description,
            image: {
              data: req.files.image.data,
              contentType: req.files.image.mimetype,
            },
          },
          { runValidators: true }
        );
      }

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
};

exports.delete_category = function (req, res) {
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
};

exports.get_category = function (req, res) {
  async function run() {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        throw new Error("Invalid ID");
      }
      const catToRender = await category.findOne({ _id: req.params.id });
      const products = await product.find({ category: catToRender._id });
      res.render("categoryDetail", {
        title: catToRender.title,
        category: catToRender,
        products: products,
      });
    } catch (error) {
      res.render("error", {
        message: error.message || error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
};
exports.add_item_to_category = function (req, res) {
  async function run() {
    try {
      if (
        !mongoose.isValidObjectId(req.params.id) ||
        (await category.findOne({ _id: req.params.id })) === null
      ) {
        throw new Error("Invalid ID");
      }
      console.log(req.files);
      if (req.files === null) {
        await product.create({
          title: req.body.title,
          description: req.body.description,
          image: {
            data: "undefined",
            contentType: "undefined",
          },
          price: req.body.price,
          category: req.params.id,
        });
      } else {
        await product.create({
          title: req.body.title,
          description: req.body.description,
          image: {
            data: req.files.image.data,
            contentType: req.files.image.mimetype,
          },
          price: req.body.price,
          category: req.params.id,
        });
      }
      res.redirect(`/category/${req.params.id}`);
    } catch (error) {
      res.render("error", {
        message: error.message || error._message,
        error: { status: 400, stack: "bad request" },
      });
    }
  }
  run();
};
