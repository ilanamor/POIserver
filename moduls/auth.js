var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var DButilsAzure = require('../DButil');

const secret = "ilanaKarin";

//works
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

    query1 = "INSERT INTO Users VALUES ('"
        + username + "','" + password + "','" + firstName + "','" + lastName + "','" + city + "','" + country + "','" + email + "','" + a1 + "','" + a2 + "')";

    DButilsAzure.execQuery(query1).then(function (result) {
        for (var i = 0; i < categories.length; i++) {
            DButilsAzure.execQuery("insert into UserCategory values ('" + username + "', '" + categories[i] + "')").then(function (result) {
                res.send(true)
            }).catch(function (err) { res.status(400).send(err); });
        }
    }).catch(function (err) {
        res.status(400).send(err);
    });
});

//works
router.post('/login', function (req, res) {
    var name = req.body.UserName;
    var password = req.body.Password;

    DButilsAzure.execQuery("Select * from Users where UserName = '" + name + "' AND Password = '" + password + "'").then(function (result) {
        if (result.length > 0) {

            var payload = {
                UserName: name,
                Password: password
            }

            var token = jwt.sign(payload, secret, {
                expiresIn: "1d"
            });

            res.json({
                success: true,
                massage: 'enjoy your token!',
                token: token
            });
        }
        else {
            res.send("connection failed");
        }
    }).catch(function (err) { res.status(400).send(err); });
});

//works
router.post('/retrivePassword', function (req, res) {
    var name = req.body.UserName;
    var a1 = req.body.Answer1;
    var a2 = req.body.Answer2;
    DButilsAzure.execQuery("Select Password from Users Where UserName = '" + name + "' AND Answer1 = '" + a1 + "' AND Answer2 = '" + a2 + "'")
        .then(function (result) {
            if (result.length > 0)
                res.send(result[0].Password);
            else
                res.status(400).send();
        }).catch(function (err) { res.status(400).send(err); });
});


module.exports = router;