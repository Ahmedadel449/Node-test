const mongoose=require('mongoose');
const Product = require('./Product');

const orderSchema = mongoose.Schema({

  user : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : 'User' ,
    required :true
  } ,
  product : {
    type : Array ,
    
  }

});


module.exports = mongoose.model('Order' , orderSchema)