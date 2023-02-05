var express = require('express');
var router = express.Router();
const Order = require("../models/Order");

router.post('/addorder', (req, res ,next)=>{
  const newOrder = new Order({
    user : req.body.user ,
    product : req.body.product
  })
  newOrder.save()
  .then(doc=>{
    res.status(200).json({
      message : doc
    })
  })
  .catch(err=>{
    res.status(404).json({
      message : err.message
    })
  })
})

router.get('/',(req, res ,next)=> {
  Order.find().populate('user', 'userName')
  .then(doc=>{
    res.status(200).json({
      message : doc
    })
  })
  .catch(err=>{
    res.status(404).json({
      message : err.message
    })
  })
})

router.patch('/updateorder/:id',(req , res , next)=>{
  Order.findById(req.params.id).
    then(result=>{

      var oldProduct = result.product ;
      var newProduct = req.body.product ;

      for(var newP =0 ; newP<newProduct.length; newP++){
        for(var oldP =0 ; oldP<oldProduct.length; oldP++){
          if (newProduct[newP]._id === oldProduct[oldP]._id){
            oldProduct[oldP].quantity = Number(oldProduct[oldP].quantity) + Number(newProduct[newP].quantity);
            newProduct.splice(newP,1);
          }
        }
      }
      oldProduct = oldProduct.concat(newProduct);


      const newOrder = {
        product : oldProduct ,
      }
      Order.updateOne({_id : req.params.id},{$set : newOrder})
        .then(result=>{
          res.status(200).json({
            message : result 
          })
        })
        .catch(err=>{
          res.status(404).json({
            message : err.message
          })
      })
      console.log(newProduct);
      console.log(oldProduct);  
      console.log(typeof result)
    })
  .catch(err=>{
    res.status(404).json({
      message : err.message
    })
  })
})

router.delete('/:orderID',(req ,res ,next ) =>{
  Order.deleteOne({_id : req.params.orderID})
    .then(result=>{
      res.status(200).json({
        message : "order deleted"
      })
    })
    .catch(err=>{
      res.status(404).json({
        message : err.message
      })
  })
})



module.exports = router;