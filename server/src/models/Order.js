import mongoose from 'mongoose';
const ItemSchema=new mongoose.Schema({ product:{type:mongoose.Types.ObjectId,ref:'Product'}, firm:{type:mongoose.Types.ObjectId,ref:'Firm',index:true}, qty:Number, unitPrice:Number, currency:String, lineTotal:Number },{_id:false});
const PaymentSchema=new mongoose.Schema({ provider:{type:String,enum:['razorpay'],default:'razorpay'}, orderId:String, paymentId:String, signatureValid:Boolean, raw:Object },{_id:false});
const FulfilmentSchema=new mongoose.Schema({ status:{type:String,enum:['pending','processing','delivered'],default:'pending'}, deliveredAt:Date, notes:String },{_id:false});
const OrderSchema=new mongoose.Schema({ user:{type:mongoose.Types.ObjectId,ref:'User',index:true}, items:[ItemSchema], amounts:{ subtotal:Number, discount:Number, tax:Number, grand:Number }, status:{type:String,enum:['created','paid','fulfilled','refunded','cancelled'],default:'created',index:true}, payment:PaymentSchema, fulfilment:FulfilmentSchema },{timestamps:true});
OrderSchema.index({ 'items.firm':1, status:1, createdAt:-1 });
export default mongoose.model('Order', OrderSchema);
