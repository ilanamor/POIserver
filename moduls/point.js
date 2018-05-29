var express = require('express');
var DButilsAzure = require('../DButil');
var router = express.Router();
var morgan= require('morgan');
var bodyParser = require('body-parser');

//works
router.get('/', function (req, res) {
    DButilsAzure.execQuery('SELECT PointName, Pic FROM Point').then(function (result) {
        res.send(result).catch(function (err) { res.status(400).send(err); });
    });
});

/*----------------------------------------------------------------------------------------------------------------*/
//need to fix
router.get('/details/:PointID', function (req, res) {
    var point = req.params.PointID;
    DButilsAzure.execQuery("SELECT a.PointID, a.PointName, a.Pic, a.Rank, a.NumOfView, a.Description, b.Review FROM Point a JOIN (select TOP 2 PointID, Review from Reviews where PointID='"+PointID+"' order by Date DESC) as b on a.PointID=b.PointID")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
//need to fix
router.put('/upViews/:PointID', function (req, res) {
    var point = req.params.PointID;
    DButilsAzure.execQuery("select NumOfView from Point where PointID='" + point + "'")
        .then(function (result) {
            var num = result[0].NumOfView + 1;
            DButilsAzure.execQuery("UPDATE Point SET NumOfView='" + num + "' WHERE PointID='" + point + "'");
        }).catch(function (err) { res.status(400).send(err); });
});


/*----------------------------------------------------------------------------------------------------------------*/
//works
router.get('/:CategoryID', function (req, res) {
    var category = req.params.CategoryID;
    DButilsAzure.execQuery("SELECT PointID, PointName, Pic FROM Point WHERE CategoryID='" + category + "'")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/

router.post('/addReviewToPoint', function (req, res) {
    var name = req.body.UserName;
    var point = req.body.PointID;
    var review = req.body.Review;
    var today = new Date().toISOString().slice(0,10);
    DButilsAzure.execQuery("INSERT INTO Reviews (PointID, UserName, Date, Review) VALUES ('" + point + "','" + name + "','" + today + "','" + review + "')").then(function (result) {
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

router.get('/RandomPoints', function (req, res) {
    DButilsAzure.execQuery("SELECT TOP 3 PointID, PointName, Pic FROM Point WHERE Rank>=3 ORDER BY newid()")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
router.post('/addRankToPoint', function (req, res) {
    var point = req.body.PointId;
    var rank = req.body.Rank;
    DButilsAzure.execQuery("select Rank, NumOfRanks, CategoryID from Point where PointID='" + point + "'").then(function (result) {
        var x = result[0].Rank;
        var y = result[0].NumOfRanks;
        var z = result[0].CategoryID;
        var newRank = (x * y + rank) / (y + 1);
        y = y + 1;
        DButilsAzure.execQuery("UPDATE Point SET NumOfRanks='" + y + "' AND Rank='" + newRank + "' WHERE PointID='" + point + "'").then(function (result) {
            DButilsAzure.execQuery("select Rank from CategoryMaxRank where CategoryID='" + z + "'").then(function (result) {
                if (newRank > x) {
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