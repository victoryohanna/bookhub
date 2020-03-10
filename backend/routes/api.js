const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const secret = 'secretKey';
const router = express.Router();

const Publisher = require("../models/publisher.model");
const Distributor = require("../models/distributor.model");
const UserId = require('../models/userId')

//Register new Publisher
router.post("/publisher", (req, res) => {
  let requestBody = req.body;
  Publisher.findOne(
    {
      $or: [
        { publisherId: requestBody.publisherId },
        { email: requestBody.email }
      ]
    },
    (err, data) => {
      if (err) {
        console.log("Error");
      } else {
        if (data) {
          res.status(401).send("Publisher Already exist");
        } else {
          let user = new Publisher(requestBody);
          bcrypt.genSalt(10, (err, salt)=>{
              bcrypt.hash(user.password, salt, (err, hash)=>{
                if(err) throw err;
                user.password = hash;
                user.saltSecret = salt;
                user.save(res, (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    let payload = {subject: data};
                    let token = jwt.sign(payload, secret)
                    res.status(200).send({token});   
                  }
                });
              })
          })
        }
      }
    }
  );
});    

//Register new Distributor
router.post("/distributor", (req, res) => {
  let requestBody = req.body;
  //Check if record already exist 
  Distributor.findOne({ email: requestBody.email}, (err, data) => {
    if (err){
      console.log("Error");
    } else {
		//If record found
      if(data){
        /*
          Check if distributor is already registerred to avoid duplication 
          by the same publisher
        */
        UserId.findOne({publisherId : requestBody.publisherId,
          distributorId : requestBody.distributorId}, (err, result)=>{
            if(result){
              //res.send(result)
              res.status(401).send('Distributor Already registerred ');
            }else{
                  /*
                  If record found in collection then create new instance of 
                  user id model and save to id collection. This avoid 
                  duplication of distributor record in collection. 
                */
                let userId = new UserId(requestBody);

                userId.save(res, (err, result)=>{
                    if(!err){
                        res.status(200).send(result)
                    }else{
                        res.status(401).send(err)
                    }
                });
            }
           
          })  
      }else{
        // Create new distributor record 
        let user = new Distributor(requestBody);
        user.save(res, (err, data)=>{
          if (err){
            console.log(err);
          } else {
            res.status(200).send(data);
          }
        });
      }
    }
  });
});

//Publisher Login

//Login User
router.post("/login/publisher", (req, res) => {
  let requestBody = req.body; 
  Publisher.findOne({ email: requestBody.email},(err, data) => {
      //console.log(data)
      if(data){
        if(bcrypt.compareSync(req.body.password, data.password)){
            
            let payload = { subject: data };
            let token = jwt.sign(payload, secret, {
                expiresIn : 1440
            });
            res.status(200).send({ token });
        }
      } else {
          res.status(401).send("Invalid Email or password");
        }
    });
});

//Retreive all Publishers

router.get("/publishers", (req, res) => {
  Publisher.find((err, data) => {
    if (!err) {
      res.status(200).send(data);
    } else {
      res
        .status(400)
        .send("Record not found " + JSON.stringify(err, undefined, 2));
    }
  });
});

// Retreive Single record from Publisher
router.get("/find/publisher", (req, res) => {
  let requestBody = req.body;
  Publisher.findOne({email : requestBody.email }, (err, data) => {
    if (err) {
      res.status(400).send("Error occured " + JSON.stringify(err, undefined, 2));
    } else if (!data) {
      res.status(401).send("Data not found ");
    } else {
      res.status(200).send(data);
    }
  });
});

// Retreive Single record from Publisher
router.get("/find/distributor", (req, res) => {
  let reqBody = req.body;
  Distributor.findOne({distributorId : reqBody.distributorId, publisherId : reqBody.publisherId }, (err, data) => {
   if(data){
     res.status(200).send( 'Response from condition 1: ' + data);
   }else{
     UserId.findOne({distributorId : reqBody.distributorId, publisherId : reqBody.publisherId}, (err, data)=>{
       if(data){
         Distributor.findOne({email : data.email}, (err, data)=>{
           if(data){
             res.send('Response from condition 2: ' + data);
           }else{
             res.send('No Data found');
           }
         });
         //res.status(200).send(data);
       }else{
         res.status(401).send('Result not found');
       }
     });
   }
  });
});

module.exports = router;
