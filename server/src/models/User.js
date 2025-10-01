import mongoose from 'mongoose';
const MembershipSchema=new mongoose.Schema({ firm:{type:mongoose.Types.ObjectId,ref:'Firm',index:true}, role:{type:String,enum:['owner','admin','associate'],required:true}, title:String },{_id:false});
const UserSchema=new mongoose.Schema({ email:{type:String,unique:true,index:true}, passHash:String, rolesGlobal:[{type:String,enum:['superadmin','admin']}], memberships:[MembershipSchema], isClient:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('User', UserSchema);
