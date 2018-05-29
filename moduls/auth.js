var express = require('express');
var DButilsAzure = require('../DButil');
var router = express.Router();
var morgan= require('morgan');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const superSecret="ilanaKarin";


router.post('/register', function (req, res) {     //Add User
    var username = req.body.UserName;
    var password = req.body.Password;
    var firstName = req.body.FirstName;
    var lastName = req.body.LastName;
    var city = req.body.City;
    var country = req.body.Country;
    var email = req.body.Email;
    var a1 = req.body.Answer1;
    var a2 = req.body.Answer2;
    var categories = req.body.Category;
    //var category = categories.split(",");

    query1 = "INSERT INTO Users ([UserName],[Password],[FirstName],[LastName],[City],[Country],[Email],[Answer1],[Answer2]) VALUES ('"  
              + username + "','" + password + "','" + firstName + "','" + lastName + "','" + city + "','" + country + "','" + email + "','" + a1 + "','" + a2 + "')";

    DButilsAzure.execQuery(query1).then(function (result) {
        if (result == true) {
            res.send(true);
           /* for (let i = 0, p = Promise.resolve(); i < length(categories); i++) {
                p = p.then(_ => new Promise(resolve => {
                    var c = categories[i];
                    query2 = "INSERT INTO [UserCategory]" +
                        "([UserName]" +
                        ",[CategotyID])" +
                        " VALUES ('" + (username) +
                        "','" + (c) + "')";

                    DButilsAzure.execQuery(query2).then(function (result) {
                        if (result == true) {
                            res.send(true);
                        }
                        else {
                            res.send(false);
                        }
                    }).catch(function (err) { res.status(400).send(err); });
                }))
            }*/
        }
        else{
            res.send(false);}
    }).catch(function (err) {
        res.status(400).send(err);
    });
});

/*
router.post('/login', function (req,res) {
    var name = req.body.UserName;
    var password = req.body.Password;
    DButilsAzure.execQuery("Select * from Users where UserName = '" + name + "' AND Password = '" + password + "'").then(function (result) {
        if(result.length > 0){

            var payload = {
                UserName: name,
                Password: password
            }

            var token= jwt.sign(payload,superSecret,{
                expiresIn:"1d"
            });

            res.json({
                success: true,
                massage:'enjoy your token!',
                token: token
            });
        }
        else {
            res.send("connection failed");
    }
    }).catch(function(err){ res.status(400).send(err);});
});*/

//login post request--works
router.post('/login', function (req, res) {
    var nameUser = req.body.UserName;
    var password = req.body.Password;
    DButilsAzure.execQuery("Select * from Users Where UserName='" + nameUser + "' AND Password='" + password + "'")
    .then(function (result) {
        if (result.length > 0) {
            //return Token
            var payload={
                userName:nameUser,
                password:password
            }

            var token=jwt.sign(payload,superSecret,{expiresIn:"1d"});

            res.json({
                success:true,
                message:'enjoy your token!',
                token:token
            });

        } else {
            res.send("connection failed");
        }
    }).catch(function (err) { res.status(400).send(err); });

    //res.send("done");
})




module.exports = router;