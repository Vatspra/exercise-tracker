const mongoose = require('mongoose');

var exerciseSchema = mongoose.Schema({
  userId:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  timestamp:{
    type:Date,
    required:false,
    default:Date.now()
  },
  duration:{
    type:String,
    required:true
  }

})

var Exercise = module.exports = mongoose.model('Exercise',exerciseSchema);


module.exports.addExercise = function(newExercise,callback){
  newExercise.save(callback);
}