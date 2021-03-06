/*
 * Jonah Feldman, 9-28-17
 * index.js
 * Server file for a Harvard Teaching Fellow Queue
 */

var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);

//sets up socket.io
var io = require('socket.io').listen(server);

var path = require('path');


var bodyParser = require('body-parser'); 
var validator = require('validator');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set up mongodb database
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nodemongoexample';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});


 server.listen(process.env.PORT, function(){
 	console.log("server running");
 });


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');	
app.set('view engine', 'ejs');


//returns the root page when a GET request is received for it
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + "/public/" +"home.html"));

});

// returns the file password.html, which asks for a password to access the admin page
app.get("/admin", function(request, response){
	response.sendFile(path.join(__dirname + "/public/"+ "/password.html"));
});

//sends them to a login screen that asks for the password. If they do not enter
// the correct password, it sends them to a failure screen and asks them to try
// again
app.post("/login", function(request, response){
	if (request.body.pwd == "Ex0dia"){
		response.sendFile(path.join(__dirname + "/public/" + "/admin.html"));
	}
	else{
		response.send("Incorrect Password, hit back and try again")
	}
});

// where your name and question go after you hit submit. Takes a name and question,
// under the argument request, and uploads them to a mongoDB database
app.post('/question', function(request, response){
	var time = new Date();

	//get rid of any opportunistic Cross-Site Scripting
	var name = request.body.name.replace(/[&\/\\#()'":<>{}]/g, '');
	var question = request.body.question.replace(/[&\/\\#()'":<>{}]/g, '');

	var toInsert = {
		"name": name,
		"quest": question,
		"created_at": time.getTime
	};

	db.collection("students", function(error, coll){
		coll.insert(toInsert, function(error, records){
			response.sendStatus(200);

			//tells the clients (both at home.html and on the admin page) that there's
			//been a change to the queue and it needs to update
			io.sockets.emit("change");
		
		});
	});


});

//removes a student/question from the database/queue
// takes as an argument "ID" under request, which is the ID of the MongoDB Document
// we want to remove
app.post("/remove", function(request, response){
	var ObjectId = require('mongodb').ObjectID

	db.collection("students", function(error, coll){
		coll.remove({_id: ObjectId(request.body.ID)}, function(err, obj){
			response.sendFile(path.join(__dirname + "/public/" + "admin.html"));

			//tells the clients the list of questions has changed, asks them to update
			io.sockets.emit("change");
		});
	});
	
	
});

//returns an array of objects which contains each student, their corresponding question
//and the time their question was submitted
app.post("/queue", function(request, response){
	response.set('Content-Type', 'text/html');
	db.collection("students", function(error, coll){
		coll.find().toArray(function(error, list){
			response.send(JSON.stringify(list));
		});
	})

});
