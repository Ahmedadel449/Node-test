var express = require('express');
var router = express.Router();
const Product = require("../models/Product");

const multer = require("multer");
const storage = multer.diskStorage({
  destination :function(req,file,callback){
    callback(null,'./productImage/')
  } ,

  filename : function(req,file,callback){
    callback(null,new Date().toDateString() + file.originalname)
  } 
});
const upload = multer({
  storage :storage,
  limits :{
    fileSize : 1024*1024*5,
  }
})


router.get('/',(req ,res ,next )=>{

  Product.find()
    .select('_id name price')
    .then( result=> {
      const docs ={
        result : result.map(result=>{
          return {
            name : result.name ,
            price : result.price ,
            _id : result._id ,
            url : {
              type : "GET" ,
              urls : "127.0.0.1:3000/products/" + result._id
            }
          }
        })
      }; 

      // console.log(result);
      res.status(200).json({
        product : docs ,
      })
    })
    .catch( err=> {
      res.status(404).json({
        message : err.message
      })
    })
})

router.post('/addproduct',upload.single("myfile"),(req ,res ,next)=>{
  console.log(req.file)
  const product = new Product({
    name :req.body.name ,
    price : req.body.price ,
    image : req.file.path ,
  })
  product.save()
  .then(doc=>{
    console.log(doc);
    res.status(200).json({
      message : "added product" ,
      product : doc
    })
  })
  .catch(err=>{
    res.status(404).json({
      message : err.message
    })
  })
})

router.get("/:productID" , (req ,res ,next)=>{
  Product.findById(req.params.productID)
    .then(result =>{
      res.status(200).json({
        message : result
      })
    })
    .catch(err=>{
      res.status(404).json({
        message : err.message
      })
    })
})

router.patch('/:productID',(req ,res ,next)=>{
  
  const newProduct = {
    name: req.body.name ,
    price: req.body.price 
  }
  Product.updateOne({_id : req.params.productID},{$set : newProduct})
    .then(result=>{
      res.status(202).json({
        message : "success updated"
      })
    })
    .catch(err=>{
      res.status(404).json({
        message : err.message
      })
    })
})

router.delete('/:productID',(req ,res ,next)=>{

  Product.findOneAndDelete({_id : req.params.productID })
    .then(result=>{
      if(result){
        console.log(result);
        res.status(202 ).json({
          message : "product deleted"
        })
      }else{
        res.status(404).json({
          message:'product not found to delete'
        })
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: err.message,
      });
    });
})
module.exports = router;