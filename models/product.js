const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  description: { type: String, required: true, minLength: 1 },
  price: { type: Number, required: true, min: 0 },
  image: {
    data: Buffer,
    contentType: String,
  },
  category: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
});
productSchema.virtual("url").get(function () {
  return `/${this._id}`;
});
productSchema.virtual("imgSrc").get(function(){
  if(this.image.contentType!=="undefined"){
    return `data:image/jpeg;base64,${this.image.data?.toString('base64')}`
  }else{
    return ""
  }
})
module.exports = mongoose.model("Product", productSchema);
