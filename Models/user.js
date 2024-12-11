import mongoose ,{ model , Schema} from 'mongoose';


const UserSchema =new Schema({
     photo:{
        type:String,
     },
     FullName:{
        type:String,
        required:true
     },
     emailID:{
        type:String,
        required:true
     },
     address1:{
        type:String
     },
     phone:{
      type:Number,
     },
     address2:{
      type:String
   },
     gender:{
        type:String
     },
     birthDay:{
        type:Date
     },
     role:{
            type:String,
            default:'user'
     },
     password:{
         type:String,
        min:6,
        max:20,
        required:true
     }


    


}, {timeStamp:true});

export const UserModel=model('user',UserSchema);