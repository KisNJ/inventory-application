const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  title: { type: String, required: true, minLength: 1,unique:true },
  description: { type: String, required: true, minLength: 1 },
  image:{
    data:Buffer,
    contentType:String
  }
});
categorySchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});
categorySchema.virtual("imgSrc").get(function(){
  if(this.image.contentType!=="undefined"){
    return `data:image/jpeg;base64,${this.image.data?.toString('base64')}`
  }else{
    return ""
  }
})
module.exports = mongoose.model("Category", categorySchema);
