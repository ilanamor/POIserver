var express = require('express');
var DButilsAzure = require('../DButil');
var router = express.Router();

router.post('/register', function (req, res) {     //Add User
    var username = req.body.UserName;
    var password = req.body.Password;
    var firstName = req.body.FirstName;
    var lastName = req.body.LastName;
    var city = req.body.City;
    var country = req.body.Country;
    var email = req.body.Email;
    var q1 = req.body.QuestionID1;
    var q2 = req.body.QuestionID2;
    var a1 = req.body.Answer1;
    var a2 = req.body.Answer2;
    var categories = req.body.categories;
    var category = categories.split(",");

    query1 = "INSERT INTO [Users]" +
        "([UserName]" +
        ",[Password]" +
        ",[FirstName]" +
        ",[LastName]" +
        ",[City]" +
        ",[Country]" +
        ",[Email]" +
        ",[Answer1]" +
        ",[Answer2])" +
        " VALUES ('" + (username) +
        ",'" + (password) +
        "','" + (firstName) +
        "','" + (lastName) +
        "','" + (city) +
        "','" + (country) +
        "','" + (email) +
        "','" + (a1) +
        "','" + (a2) + "')";

    DButilsAzure.execQuery(query1).then(function (result) {
        if (result == true) {
            for (let i = 0, p = Promise.resolve(); i < length(category); i++) {
                p = p.then(_ => new Promise(resolve => {
                    var c = category[i];
                    query2 = "INSERT INTO [UserCategory]" +
                        "([UserName]" +
                        ",[CategotyID])" +
                        " VALUES ('" + (username) +
                        "','" + (c) + "')";

                    DButilsAzure.execQuery(query2).then(function (result) {
                        res.send(result);
                    }).catch(function (err) { res.status(400).send(err); });
                }))
            }
        }
        else
            res.send(false);
    }).catch(function (err) {
        res.status(400).send(err);
    });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.post('/retrivePassword', function (req, res, next) {
    var name = req.body.UserName;
    var a1 = req.body.Answer1;
    var a2 = req.body.Answer2;
    DButilsAzure.execQuery("Select Password from Users Where UserName = '" + name + "' AND Answer1 = '" + a1 + "' AND Answer2 = '" + a2 + "'")
        .then(function (result) {
            if (result[0] == string.empty())
                res.status(400).send();
            else
                res.send(result[0]);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
/*
router.post('/login', function (req,res,next) {
    var name = req.body.UserName;
    var password = req.body.Password;
    DButilsAzure.execQuery("Select * from Users Where UserName = '" + name + "' AND Password = '" + password + "'").then(function (result) {
        if(result.length >0)
            res.send(true);
            //return token
        else
            res.send(false);
    }).catch(function(err){ res.status(400).send(err);});
});*/





/*----------------------------------------------------------------------------------------------------------------*/

router.get('/twoPopularPoints/:UserID', function (req, res, next) {
    var name = req.body.UserName;
    DButilsAzure.execQuery("SELECT b.PointID, b.PointName, b.Pic FROM (SELECT * FROM UserCategory Where UserName='" + name + "')a JOIN CategoryMaxRank b ON a.CategoryID=b.CategoryID LIMIT 2")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.get('/twoLastPoints/:UserID', function (req, res, next) {
    var name = req.body.UserName;
    DButilsAzure.execQuery("SELECT b.PointID, b.PointName, b.Pic FROM (SELECT * FROM UserFavorite Where UserName='" + name + "' order by desc Date limit 2) a  JOIN Point b ON a.PointID=b.PointID")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.get('/showAllFavorite/:UserID', function (req, res, next) {
    var name = req.body.UserName;
    DButilsAzure.execQuery("SELECT b.PointID, b.PointName, b.Pic, b.OrderNum FROM (SELECT * FROM UserFavorite Where UserName='" + name + "') a  JOIN Point b ON a.PointID=b.PointID order by b.OrderNum ASC")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.post('/addToFavorite', function (req, res, next) {
    var name = req.body.UserName;
    var point = req.body.PointID;
    var today = new Date();
    var order=-1;
    DButilsAzure.execQuery("INSERT INTO UserFavorite (UserName, PointID, Date, OrderNum) VALUES ('" + name + "','" + point + "','" + today + "','"+order+"'")
        .then(function (result) {
            if (result == true) {
                res.send(true);
            }
            else {
                res.send(false);
            }
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.delete('/deleteFromFavorite', function (req, res, next) {
    var name = req.body.UserName;
    var point = req.body.PointID;
    DButilsAzure.execQuery("DELETE FROM UserFavorite WHERE UserName = '"+name+"' AND PointID='"+point+"'")
        .then(function (result) {
            if (result == true) {
                res.send(true);
            }
            else {
                res.send(false);
            }
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.put('/updateFavOrder', function (req, res, next) {
    var name = req.body.UserName;
    var points = req.body.points;
    var pointsOrder = points.split(",");

    for (let i = 0, p = Promise.resolve(); i < length(pointsOrder); i+=2) {
        p = p.then(_ => new Promise(resolve => {
            var p=pointsOrder[i];
            var num=pointsOrder[i+1];
            DButilsAzure.execQuery("UPDATE UserFavorite SET NumOrder='"+num+"' WHERE PointID='"+p +"' AND UserName='"+name+"'").then(function (result) {
                if (result == true) {
                    res.send(true);
                }
                else {
                    res.send(false);
                }
            }).catch(function (err) { res.status(400).send(err); });
        }))
    }
});