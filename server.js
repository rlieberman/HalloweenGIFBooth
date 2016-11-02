
var express = require('express');
var bodyParser = require('body-parser'); //need this to parse request.body
var fs = require('fs'); //fs for writing files

// Create the app
var app = express();

// use body parser so we can parse the request.body from the client
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

// this is for hosting static files
app.use(express.static('public'));
app.use('/gifs', express.static('gifs'));  //https://expressjs.com/en/starter/static-files.html 

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('GIF Generator app is listening at http://' + host + ':' + port);
}

var gifUrl;

//get post request from client with input values to send to twilio
//when the client hits the route /twilio, grab the data from the body of the request
app.post('/savegif', function (req, res) {

  gifUrl = req.body.gif;
  console.log(gifUrl);

  // pass url to saveGIF method to save GIF from base64 string
  saveGIF(gifUrl); 
 
  res.sendStatus(200);
});


function saveGIF(mediaUrl) {

  // saving a data URL as an image (server side)
  var searchFor = "data:image/gif;base64,";
  var strippedImage = mediaUrl.slice(mediaUrl.indexOf(searchFor) + searchFor.length);
  // console.log(strippedImage);

  var binaryImage = new Buffer(strippedImage, 'base64');
  // console.log("dirname is" + __dirname);
  fs.writeFileSync("gifs/" + new Date().getTime() + ".gif", binaryImage);
  
}