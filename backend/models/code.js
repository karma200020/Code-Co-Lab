var mongoose = require('mongoose')

const CodeSchema = new mongoose.Schema({
    codetext:String,
    codetitle:String,
    languageid:Number,
    author:{
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
        },
        username:String
      },
    date:{ type: Date, default: Date.now }
})


module.exports = User = mongoose.model('code', CodeSchema);
