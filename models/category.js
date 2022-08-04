const mongoose = require("mongoose");
const { Schema } = mongoose;
const product = require("./product");

const categorySchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  description: { type: String, required: true, minLength: 1 },
  image: { type: String, default: "" },
});
categorySchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});

categorySchema.method("getCount", function () {
    let title = this.title;
    return title
  })
module.exports = mongoose.model("Category", categorySchema);
