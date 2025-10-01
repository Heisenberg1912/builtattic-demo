import mongoose from 'mongoose';
const PayoutSchema=new mongoose.Schema({ firm:{type:mongoose.Types.ObjectId,ref:'Firm',index:true}, order:{type:mongoose.Types.ObjectId,ref:'Order'}, amountGross:Number, commissionPct:Number, commissionAmount:Number, amountNet:Number, status:{type:String,enum:['pending','processing','paid','failed'],default:'pending',index:true} },{timestamps:true});
export default mongoose.model('Payout', PayoutSchema);
