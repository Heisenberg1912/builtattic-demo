import mongoose from 'mongoose';
const ProductSchema=new mongoose.Schema({ firm:{type:mongoose.Types.ObjectId,ref:'Firm',index:true}, title:{type:String,index:'text'}, slug:{type:String,unique:true}, description:String, price:Number, currency:{type:String,default:'INR'}, status:{type:String,enum:['draft','published'],default:'draft'}, inventory:{type:Number,default:0}, categories:[String], metafields:Object },{timestamps:true});
ProductSchema.index({ firm:1, status:1, price:1 });
export default mongoose.model('Product', ProductSchema);
