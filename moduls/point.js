var express = require('express');
var DButilsAzure = require('../DButil');
var router = express.Router();
var morgan= require('morgan');
var bodyParser = require('body-parser');


router.get('/', function (req, res) {
    DButilsAzure.execQuery('SELECT PointName, Pic FROM Point').then(function (result) {
        res.send(result).catch(function (err) { res.status(400).send(err); });
    });
});

/*----------------------------------------------------------------------------------------------------------------*/
//need to fix
router.get('/:PointID', function (req, res) {
    var point = req.params.PointID;
    DButilsAzure.execQuery("SELECT a.PointID, a.PointName, a.Pic, a.Rank, a.NumOfView, a.Description, b.Review as Review1, c.Review as Review2 FROM Point a JOIN (select Review from Reviews where PointID='"+PointID+"'order by Date DESC LIMIT 2) b on a.PointID=b.PointID JOIN (select Review from Reviews where PointID='"+PointID+"'order by Date DESC LIMIT 2) c on b.PointID=c.PointID Where b.Review<>c.Review")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
router.put('/:PointID', function (req, res, next) {
    var point = req.params.PointID;
    DButilsAzure.execQuery("SELECT NumOfView FROM Point WHERE PointID='" + point + "'")
        .then(function (result) {
            var num = result[0] + 1;
            DButilsAzure.execQuery("UPDATE Point SET NumOfView='" + num + "' WHERE PointID='" + point + "'").then(function (result) {
                res.send(result);
            }).catch(function (err) { res.status(400).send(err); });
        }).catch(function (err) { res.status(400).send(err); });
});
/*----------------------------------------------------------------------------------------------------------------*/

router.get('/:CategoryID', function (req, res, next) {
    var category = req.params.CategoryID;
    DButilsAzure.execQuery("SELECT PointID, PointName, Pic, FROM Point WHERE CategoryID='" + category + "'")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.post('/addReviewToPoint', function (req, res, next) {
    var name = req.body.UserName;
    var point = req.body.PointId;
    var review = req.body.Review;
    var today = new Date();
    DButilsAzure.execQuery("INSERT INTO Reviews (PointID, UserName, Date, Review) VALUES ('" + point + "','" + name + "','" + today + "','" + review + "'").then(function (result) {
        if (result == true) {
            res.send(true);
        }
        else {
            res.send(false);
        }
    }).catch(function (err) {
        res.status(400).send(err);
    });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.get('/RandomPoints', function (req, res, next) {
    DButilsAzure.execQuery("SELECT PointID, PointName, Pic, FROM Point WHERE Rank>=3 ORDER BY RAND() LIMIT 3")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
router.post('Point/addReviewToPoint', function (req, res, next) {
    var point = req.body.PointId;
    var rank = req.body.Rank;
    DButilsAzure.execQuery("select Rank, NumOfRanks, CategoryID from Point where PointID='" + point + "'").then(function (result) {
        var x = result[0][0];
        var y = result[0][1];
        var z = result[0][2];
        var newRank = (x * y + rank) / (y + 1);
        y = y + 1;
        DButilsAzure.execQuery("UPDATE Point SET NumOfRanks='" + y + "' AND Rank='" + newRank + "' WHERE PointID='" + point + "'").then(function (result) {
            DButilsAzure.execQuery("select Rank from CategoryMaxRank where CategoryID='" + z + "'").then(function (result) {
                if (newRank > result[0]) {
                    DButilsAzure.execQuery("UPDATE CategoryMaxRank a JOIN Point b ON a.PointID=b.PointID SET a.Rank='" + newRank + "' AND a.PointName=b.PointName AND a.Pic=b.Pic WHERE a.CategoryID='" + z + "'").then(function (result) {
                        if (result == true) {
                            res.send(true);
                        }
                        else {
                            res.send(false);
                        }
                    }).catch(function (err) { res.status(400).send(err); });
                }
                else
                    res.send(true);
            }).catch(function (err) { res.status(400).send(err); });
        }).catch(function (err) { res.status(400).send(err); });
    }).catch(function (err) { res.status(400).send(err); });
});

module.exports = router;