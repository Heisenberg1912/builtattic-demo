import mongoose from 'mongoose';
const FirmSchema=new mongoose.Schema({ name:String, slug:{type:String,unique:true,index:true}, approved:{type:Boolean,default:false}, ownerUserId:{type:mongoose.Types.ObjectId,ref:'User'}, payout:{ commissionPct:{type:Number,default:10}, mode:{type:String,enum:['manual','razorpayx'],default:'manual'}, handle:String }},{timestamps:true});
export default mongoose.model('Firm', FirmSchema);
