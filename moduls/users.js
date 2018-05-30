var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var DButilsAzure = require('../DButil');


/*----------------------------------------------------------------------------------------------------------------*/
//works
router.get('/twoPopularPoints/:UserName', function (req, res, next) {
    var name = req.params.UserName;
    DButilsAzure.execQuery("SELECT TOP 2 c.PointID, c.PointName, c.Pic FROM (SELECT * FROM UserCategory Where UserName='" + name + "') a JOIN CategoryMaxRank b ON a.CategoryID=b.CategoryID Join Point c ON b.PointID=c.PointID")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
//works
router.get('/twoLastPoints/:UserName', function (req, res, next) {
    var name = req.params.UserName;
    DButilsAzure.execQuery("SELECT b.PointID, b.PointName, b.Pic FROM (SELECT TOP 2 * FROM UserFavorite Where UserName='" + name + "' order by Date DESC) a JOIN Point b ON a.PointID=b.PointID")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
//works
router.get('/showAllFavorite/:UserName', function (req, res, next) {
    var name = req.params.UserName;
    DButilsAzure.execQuery("SELECT b.PointID, b.PointName, b.Pic, a.OrderNum FROM (SELECT * FROM UserFavorite Where UserName='" + name + "') a JOIN Point b ON a.PointID=b.PointID order by a.OrderNum ASC")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
//works
router.post('/addToFavorite', function (req, res, next) {
    var name = req.body.UserName;
    var point = req.body.PointID;
    var today = new Date().toISOString().slice(0,10);
    var order = req.body.OrderNum;
    DButilsAzure.execQuery("INSERT INTO UserFavorite values ('" + name + "','" + point + "','" + today + "','" + order + "')")
        .then(function (result) {
            res.send(true);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
//works
router.delete('/deleteFromFavorite', function (req, res, next) {
    var name = req.body.UserName;
    var point = req.body.PointID;
    DButilsAzure.execQuery("DELETE FROM UserFavorite WHERE UserName = '"+name+"' AND PointID='"+point+"'")
        .then(function (result) {
            res.send(true);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
//works
router.put('/updateFavOrder', function (req, res, next) {
    var name = req.body.UserName;
    var points = req.body.pointsOrder;
    var pointsOrder = points.split(",");

    for (let i = 0; i < pointsOrder.length; i+=2) {
            var p=pointsOrder[i];
            var num=pointsOrder[i+1];
            DButilsAzure.execQuery("UPDATE UserFavorite SET OrderNum='"+num+"' WHERE PointID='"+p +"' AND UserName='"+name+"'").then(function (result) {
                res.send(true);
            }).catch(function (err) { res.status(400).send(err); });
    }
});

/*----------------------------------------------------------------------------------------------------------------*/
//works
router.post('/addReviewToPoint', function (req, res) {
    var name = req.body.UserName;
    var point = req.body.PointID;
    var review = req.body.Review;
    var today = new Date().toISOString().slice(0,10);
    DButilsAzure.execQuery("INSERT INTO Reviews (PointID, UserName, Date, Review) VALUES ('" + point + "','" + name + "','" + today + "','" + review + "')").then(function (result) {
        res.send(true);
    }).catch(function (err) {
        res.status(400).send(err);
    });
});

module.exports = router;