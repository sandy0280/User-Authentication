var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/pms", {useNewUrlParser:true,useUnifiedTopology:true, useCreateIndex:true})
var conn = mongoose.Collection

var userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        index:{unique:true,}
    },
    mobileno:{
        type:String,
        required:true,
        index:{unique:true,}
    },
    email:{
        type:String,
        required:true,
        index:{unique:true,}
    },
    password:{
        type:String,
        required:true,
        
    },
    gender:{
        type:String,
        required:true,
        
    },
    date:{
        type:Date,
        default:Date.now
    }
    //dob:{type:String};
});

var userModule = mongoose.model('users',userSchema)
module.exports= userModule ;