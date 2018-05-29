var express = require('express');
var DButilsAzure = require('../DButil');
var router = express.Router();
var morgan= require('morgan');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

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

router.get('/twoPopularPoints/:UserID', function (req, res, next) {
    var name = req.params.UserName;
    DButilsAzure.execQuery("SELECT b.PointID, b.PointName, b.Pic FROM (SELECT * FROM UserCategory Where UserName='" + name + "')a JOIN CategoryMaxRank b ON a.CategoryID=b.CategoryID LIMIT 2")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.get('/twoLastPoints/:UserID', function (req, res, next) {
    var name = req.params.UserName;
    DButilsAzure.execQuery("SELECT b.PointID, b.PointName, b.Pic FROM (SELECT * FROM UserFavorite Where UserName='" + name + "' order by desc Date limit 2) a  JOIN Point b ON a.PointID=b.PointID")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.get('/showAllFavorite/:UserID', function (req, res, next) {
    var name = req.params.UserName;
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
    var name = req.params.UserName;
    var points = req.params.points;
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

module.exports = router;