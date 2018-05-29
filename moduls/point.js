var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var DButilsAzure = require('../DButil');

//works
router.get('/', function (req, res) {
    DButilsAzure.execQuery('SELECT PointName, Pic FROM Point').then(function (result) {
        res.send(result).catch(function (err) { res.status(400).send(err); });
    });
});

/*----------------------------------------------------------------------------------------------------------------*/
//works
router.get('/details/:PointID', function (req, res) {
    var point = req.params.PointID;
    DButilsAzure.execQuery("SELECT a.PointID, a.PointName, a.Pic, a.Rank, a.NumOfView, a.Description, b.Review FROM Point a JOIN (select TOP 2 PointID, Review from Reviews where PointID='"+point+"' order by Date DESC) as b on a.PointID=b.PointID")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
//works
router.put('/upViews/:PointID', function (req, res) {
    var point = req.params.PointID;
    DButilsAzure.execQuery("select NumOfView from Point where PointID='" + point + "'")
        .then(function (result) {
            var num = result[0].NumOfView + 1;
            DButilsAzure.execQuery("UPDATE Point SET NumOfView='" + num + "' WHERE PointID='" + point + "'") .then(function (result) {
                res.send(true);
            })
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
//need to check
router.get('/RandomPoints', function (req, res) {
    DButilsAzure.execQuery("SELECT TOP 2 PointID, PointName, Pic FROM Point WHERE Rank>='3' ORDER BY checksum(newid())")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});

/*----------------------------------------------------------------------------------------------------------------*/
//works
router.post('/addRankToPoint', function (req, res) {
    var point = req.body.PointID;
    var rank = req.body.Rank;
    DButilsAzure.execQuery("select Rank, NumOfRanks, CategoryID from Point where PointID='" + point + "'").then(function (result) {
        var x = result[0].Rank;
        var y = result[0].NumOfRanks;
        var z = result[0].CategoryID;
        var newRank = ( ((x * y) + parseInt(rank)) / (y + 1) );
        y = y + 1;
        DButilsAzure.execQuery("UPDATE Point SET NumOfRanks='" + y + "', Rank='" + newRank + "' WHERE PointID='" + point + "'").then(function (result) {
            DButilsAzure.execQuery("select Rank from CategoryMaxRank where CategoryID='" + z + "'").then(function (result) {
                if (newRank > result[0].Rank) {
                    DButilsAzure.execQuery("UPDATE CategoryMaxRank SET Rank='" + newRank + "', PointID='"+point+"' WHERE CategoryID='" + z + "'").then(function (result) {
                            res.send(true);
                    }).catch(function (err) { res.status(400).send(err); });
                }
                else
                    res.send(true);
            }).catch(function (err) { res.status(400).send(err); });
        }).catch(function (err) { res.status(400).send(err); });
    }).catch(function (err) { res.status(400).send(err); });
});

module.exports = router;