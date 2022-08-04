const mongoose = require("mongoose");
const {Schema}=mongoose;

const productSchema=new Schema({
    title:{type:String,required: true,minLength:1},
    description:{type:String,required: true,minLength:1},
    price:{type:Number,required: true,min:0},
    image:{type:String,default:""},
    category:{type:String,required: true,minLength:1}
})
productSchema.virtual('url').get(function() {
    return `/${this._id}`
  });
  
module.exports=mongoose.model("Product",productSchema)