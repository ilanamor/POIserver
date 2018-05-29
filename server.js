//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DButil');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var users = require('./moduls/users'); // get our users model
var point = require('./moduls/point');
var auth = require('./moduls/auth');

var morgan= require('morgan');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

//-------------------------------------------------------------------------------------------------------------------

const superSecret='ilanaKarin';

app.use('/user', function(req,res,next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){

        jwt.verify(token, router.get(superSecret), function(err, decoded){
            if(err){
                return res.json({success:false, massage:"failed to authenticate"});
            } else{
                var decoded = jwt.decoded(token,{complete:ture});
                req.decoded=decoded;
                next();
            }
        })
    } 
    else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

app.use('/user', users);
app.use('/point', point);
app.use('/auth', auth);