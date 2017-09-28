var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var path = require('path');


var bodyParser = require('body-parser'); 
var validator = require('validator');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nodemongoexample';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

 // server.listen(5000, function(){
 // 	console.log("local server running");
 // });

 server.listen(process.env.PORT, function(){
 	console.log("server running");
 });


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');	
app.set('view engine', 'ejs');


app.post('/question', function(request, response){
		var time = new Date();
		console.log(request.body.name);
		console.log(request.body.question);

		if (request.body.name == "ExodiaTheForbiddenOne"){
			db.collection("students").drop();
			response.send(200);
			return;
		}

		var toInsert = {
		"name": request.body.name,
		"quest": request.body.question,
		"created_at": time.getTime
		};

	db.collection("students", function(error, coll){
		coll.insert(toInsert, function(error, records){
			response.send(200);
			io.sockets.emit("change");
		
		});
	});


});

app.post("/remove", function(request, response){
	console.log(request.body);
	console.log(request.body.ID);
	var ObjectId = require('mongodb').ObjectID

	db.collection("students", function(error, coll){
		coll.remove({_id: ObjectId(request.body.ID)}, function(err, obj){
			//console.log(doc);
			response.sendFile(path.join(__dirname + "/public/" + "admin.html"));
			io.sockets.emit("change");
		});
	});
	
	
});
app.get("/admin", function(request, response){
	response.sendFile(path.join(__dirname + "/public/"+ "/admin.html"));
});


app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + "/public/" +"home.html"));

});

app.post("/queue", function(request, response){
	response.set('Content-Type', 'text/html');


	db.collection("students", function(error, coll){
		coll.find().toArray(function(error, list){
			response.send(JSON.stringify(list));
		});
	})
//	var list = [{"name": "Fred", "quest": "Why is the sky blue"}, {"name": "John", "quest": "Why don't girls like me?"}]
//	response.send(JSON.stringify(list));

});
/*
app.get('/vehicle.json', function(request, response){
	response.setHeader('Content-Type', 'application/json');
	var driver = request.query.username;
	if (vehicles.indexOf(driver) != -1){
		db.collection("vehicles", function(error, coll){
			if (error){
	 			console.log("Error: " + error);
				response.send(500);
	 		}
			coll.findOne({"username": driver},function(error, item){
				if (error){
	 				console.log("Error: " + error);
					response.send(500);
	 			} 
	 			response.send(item);
	 		});
	 	});
	}
	else{
		response.send({});
	}


});

app.post('/submit', function(request, response){
	//is submitted name a driver or passenger
	var driver = false;
	var lat = request.body.lat;
	var lng = request.body.lng;
	var username = request.body.username;
	var time = new Date(); 
	

	//adjust to EST
	time.setHours(time.getHours() - time.getTimezoneOffset()/60);
	var toInsert = {
		"username": username,
		"lat": lat,
		"lng": lng,
		"created_at": time.toJSON()
	};

	
	if (vehicles.indexOf(username) != -1){
		db.collection('vehicles', function(error, coll) {

			coll.update({"username": username}, toInsert, function(error, updates){

				updates = JSON.parse(updates);


				if (error){
		 			console.log("Error: " + error);
					response.send(500);
		 		}
		    });
		});

	
		db.collection("passengers", function(error, coll){
			if (error){
	 			console.log("Error: " + error);
				response.send(500);
	 		}
			coll.find().toArray(function(error, items){
				if (error){
	 				console.log("Error: " + error);
					response.send(500);
	 			}
				var now = new Date();
				//adjust to EST
				now.setHours(now.getHours() - now.getTimezoneOffset()/60);
				
				//parse those not matde in last 5 mins
				for (i = items.length - 1; i >= 0; i--){
					then = new Date(items[i].created_at);
					if (now.getTime() - then.getTime() > 300000){
						items.splice(i,1);
					}
				}				
				items = JSON.stringify(items);
				response.send('{"passengers": ' + items + "}");
			});
		});
	} 	


	//if a passenger
	else {
	 	db.collection("passengers", function(error, coll){
	 		coll.update({"username": username}, toInsert, {upsert: true}, function(error, numUpdated){
	 			if (error){
	 				console.log("Error: " + error);
					response.send(500);
	 			}
	 		});
	 	});
	 	db.collection("vehicles", function(error, coll){
			coll.find().toArray(function(error, items){
				if (error){
					console.log("error:" + error);
					response.send(500);
				}
				var now = new Date();
				//adjust to EST
				now.setHours(now.getHours() - now.getTimezoneOffset()/60);
				//parse those not matde in last 5 mins
				for (i = items.length - 1; i >= 0; i--){
					then = new Date(items[i].created_at);
					if ( now.getTime() - then.getTime()  > 300000){
						items.splice(i,1);
					}
				}
				items = JSON.stringify(items);
				response.send('{"vehicles": ' + items + "}");
			});
				
		});
	}
});

	*/


