const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username:{type:String,
           required:true}

})

var User = module.exports = mongoose.model('User',userSchema);


module.exports.addUser = function(newUser,callback){
  newUser.save(callback);
}