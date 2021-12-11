var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Code = require('../models/code')

router.post('/',async(req,res)=>{
    const codeId = req.header('codeid');
    const userId = req.header('userid');
    User.findById(userId,function(err,user){
        if(err){
          res.status(500).send(err);
        }
        else{          
          if(codeId==null){
            Code.create(req.body,function(err,code){
                if(err){
                    res.status(500).send(err);
                  }
                  else{
                    code.author.id=userId;
                    // code.author.username=user.name;
                    code.save();
                    user.mycodes.push(code);
                    user.save();
                    res.status(200).send("coded added and linked too user");
                  }
            });
          }  
          else{
            Code.findByIdAndUpdate(codeId,req.body,(err,foundcode)=>{
              if (err){
                res.status(500).send(err);
              } 
              else {
                foundcode.save();
                res.status(200).send("code updated");
              }
            });
          }
        }
      })    
});

router.get('/mycodes',async (req,res)=>{
  const userId = req.header('userid');
  User.findById(userId).populate("mycodes").exec(function(err,user){
      if(err){
          res.status(500).send(err);
      }else{
          res.status(200).send(user.mycodes);
      }
  });
});

router.get('/mycode/:id',async (req,res)=>{
  const codeId = req.params.id;
  Code.findById(codeId,function(err,code){
      //populate comments later
      if(err){
          res.status(500).send(err);
      }else{
          res.status(200).send(code);
      }
  });
  
});


module.exports = router;