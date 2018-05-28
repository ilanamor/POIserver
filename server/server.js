//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DButil')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//complete your code here

/*DButilsAzure.execQuery('select * from users').then((response)=>{
    
})*/


var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------


