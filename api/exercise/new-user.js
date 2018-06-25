const express = require('express');
const router = express.Router();
var User = require('../../model/user');
var Exercise = require('../../model/exercise')



router.post('/new-user',function(req,res){
  const name = req.body.username
  if(!name){
   res.json({msg:"invalid user name"})
  }
  
  else{
    User.findOne({username:name},function(err,user){
      if(err){
        console.log(err)
        res.json({msg:"some thing went wrong"})
      }
      if(user){
        res.json({msg:"this user name is already taken"})
      }
      else{
       var newUser = new User({
                    username:name
                     })
     
     User.addUser(newUser,function(err,user){
       if(err){
         console.log(err)
         res.json({msg:"something went wrong"})
       }
       else{
         res.json({name:user.username,
                  id:user._id})
       
       }
     })
     
      }
    })
    
  }
  
})

router.post('/add',function(req,res){
  //console.log(req.body.date)
  
  if(req.body.date){
    var dt = req.body.date.split('/');
    var year = parseInt(dt[0]);
    var month = parseInt(dt[1]-1)
    var date = parseInt(dt[2]);
    var dte = new Date(year,month,date);
    console.log(dte.toString())
  }
  else{
    dte = new Date();
  }
  var userId = req.body.userId;
  var description = req.body.description;
  var duration = req.body.duration;
  var timestamp = dte;
  if (userId.match(/^[0-9a-fA-F]{24}$/)) {
    User.findOne({_id:userId},function(err,user){
   if(err){
     console.log(err)
     res.json({"msg":"some thing went wrong"})
   
   }
    if(!user){
    res.json({msg:"this userId does not exist"})
    }
    if(user){
    var newExercise = new Exercise({
    userId:userId,
    description:description,
    duration:duration,
    timestamp:timestamp
  })
    Exercise.addExercise(newExercise,function(err,exe){
     if(err){
       console.log(err)
       res.json({msg:"some thing went wrong"})
     }
      else{
        
        res.json({
         name:user.username,
          userId:exe.userId,
          description:exe.description,
          duration:exe.duration,
          timestamp:exe.timestamp.toString()
          
        })
      }
    
    })
    }
  
  })
  // Yes, it's a valid ObjectId, proceed with `findById` call.
}
  else{
  res.end('invalid user id')
  }
  
  
})


router.get('/log',function(req,res){
 var query = req.query;
  if (query.userId.match(/^[0-9a-fA-F]{24}$/)){
   
  var userId = query.userId;
    User.findOne({_id:userId},function(err,user){
     if(err){
      console.log(err)
     }
    if(!user){
    
     res.json({msg:"invalid userId"})
    
    }
      if(user){
        
            if(req.query.from&&req.query.to){
              //var
                var dt1 = req.query.to.split('/');
                var dt2 = req.query.from.split('/');
                var year1 = parseInt(dt1[0]);
                var year2 = parseInt(dt2[0]);
                var month1 = parseInt(dt1[1])-1;
                var month2 = parseInt(dt2[1])-1
                var date1 = parseInt(dt1[2])+1;
                var date2 = parseInt(dt2[2]);
                var dteto = new Date(year1,month1,date1);
                var dtefrom  = new Date(year2,month2,date2)
                //console.log(dte.toString())
                console.log(req.query)
                console.log(dteto);
                console.log(dtefrom)
                 if(req.query.limit){
                  var limit = parseInt(req.query.limit)
                  var q =Exercise.find({userId:userId,timestamp:{"$gte": dtefrom, "$lt": dteto}}).limit(limit);
                   q.exec(function(err,exercises){
                     if(err){
                       console.log(err);
                       res.json({msg:"some thing went wrong"})
                     }
                     else{
                      res.json(exercises)
                      }
                    })
                  }
              else{
                q =Exercise.find({userId:userId,timestamp:{"$gte": dtefrom, "$lt": dteto}})
                q.exec(function(err,exercises){
                     if(err){
                       console.log(err);
                       res.json({msg:"some thing went wrong"})
                     }
                     else{
                      res.json(exercises)
                      }
                    })
                 }
              }
        else if((req.query.to&&!req.query.from)||(!req.query.to&&req.query.from)){
         res.json({msg:"you must specify start and end date"})
        }
        
        else{
        if(req.query.limit){
                  var limit = parseInt(req.query.limit)
                  var q =Exercise.find({userId:userId}).limit(limit);
                   q.exec(function(err,exercises){
                     if(err){
                       console.log(err);
                       res.json({msg:"some thing went wrong"})
                     }
                     else{
                      res.json(exercises)
                      }
                    })
                  }///end of if
          else{
                q =Exercise.find({userId:userId})
                q.exec(function(err,exercises){
                     if(err){
                       console.log(err);
                       res.json({msg:"some thing went wrong"})
                     }
                     else{
                      res.json(exercises)
                      }
                    })
                 }
               }        
            }
       })
    }

})




module.exports = router;