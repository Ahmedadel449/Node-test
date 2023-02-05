var express = require("express");
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt"); /*to hash password */

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.status(200).json({
    message : "it's work"
  })
});
/*  1- search use find ' compare length of users that compare with all  '
    2- hash pass(pass , number of digits to decode in it , call back function)
    3- add user (take object from User ) and sava it 
    4- all of funcathin used in find() */
router.post("/signup", (req, res, next) => {
  /*search*/
  User.find({ userName: req.body.username })
    .then((result) => {
      console.log(result)
      if (result.length < 1) {
        /*TO HASH PASSWORD */
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(404).json({
              message: err.message,
            });
          } else {
            const user = new User({
              /*add user */ userName: req.body.username,
              password: hash,
            });

            user
              .save() /*save user */
              .then((result) => {
                console.log(result);
                res.status(200).json({
                  message: "user already created",
                });
              })
              .catch((err) => {
                res.status(404).json({
                  message: err.message,
                });
              });
          }
        });
      } else {
        res.status(404).json({
          message: "this user already exist",
        });
      }
    })
    .catch((err) => {
      /*error of find */
      res.status(404).json({
        message: err.message,
      });
    });
});
/*
  1-search useing find by find all usernames which equal the target username 
  2-if user name is exist more than onec start compare by bcrypt
  3-find return arrays  of abject then we can get password by first object of taht array
  4-compare return boolean if true success if false means wrong pass not user name 
 */
router.get("/signin", (req, res, next) => {
  User.find({ userName: req.body.username })
    .then((user) => {
      // console.log(user);
      if (user.length >= 1) {
        bcrypt
          .compare(req.body.password, user[0].password)
          .then((result) => {
            if (result) {
              res.status(200).json({
                message: "success signin",
              });
            } else {
              res.status(404).json({
                message: "wrong password",
              });
            }
          })
          .catch((err) => {
            res.status(404).json({
              message: err.message,
            });
          });
      } else {
        res.status(404).json({
          message: "wrong user name",
        });
      }
    })
    .catch((err) => {
      /*error of find */
      res.status(404).json({
        message: err.message,
      });
    });
});

/*
1-user patch to up date 
2-create the new user but use th bcrypt first
3- use updateOne or findOneAndUpdate 
*/
router.patch("/updateuser/:id", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const newUser = {
        userName: req.body.username,
        password: hash,
      };
      User.findOneAndUpdate({ _id: req.params.id }, { $set: newUser })
        .then((result) => {
          if(result){
            console.log(result);
            res.status(202).json({
              message: "user updated ",
            });
          }else{
              res.status(404).json({
                message: "user not found",
              });
          }
        })
        .catch((err) => {
          res.status(404).json({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        message: err.message,
      });
    });
});

router.delete('/deleteuser/:id' ,(req , res ,next)=>{

  User.findOneAndDelete({_id:req.params.id})
  .then(result=>{
    if(result){
      console.log(result);
      res.status(200).json({
        message : "user deleted"
      })
    }else{
      res.status(404).json({
        message:'user not found to delete'
      })
    }
  })
  .catch((err) => {
    res.status(404).json({
      message: err.message,
    });
  });
})



router.get("/getusers",(req, res, next) => {
  User.find({}, "userName password" )
  .then( resualt =>{
    // console.log(resualt)
    res.status(200).json({
      message : resualt
    })
  })
  .catch(err=>{
    res.status(404).json({
      message : err.message
    })
  })
})
// router.get("/getusers",(req, res, next) => {
//   User.find({}, "userName password", (error, resualt) => {
//     if (error) {
//       console.log(error);
//     }
//     // console.log(resualt);
//     res.status(200).json({
//       massage : resualt
//     })
//   });
// })
module.exports = router;
