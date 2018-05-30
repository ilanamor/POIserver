var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var DButilsAzure = require('../DButil');

//works
router.get('/', function (req, res) {
    DButilsAzure.execQuery('SELECT PointID, PointName, Pic FROM Point').then(function (result) {
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
//works
router.get('/RandomPoints/:Rank', function (req, res) {
    var rank = req.params.Rank;
    DButilsAzure.execQuery("SELECT TOP 3 PointID, PointName, Pic FROM Point WHERE Rank>='"+rank+"' ORDER BY checksum(newid())")
        .then(function (result) {
            res.send(result);
        }).catch(function (err) { res.status(400).send(err); });
});



module.exports = router;