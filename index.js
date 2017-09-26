var express = require('express'); 
var app = express();

/*var bodyParser = require('body-parser'); 
var validator = require('validator');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); */

var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nodemongoexample';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.set('port', (process.env.PORT || 5000));


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');	
app.set('view engine', 'ejs');


app.post('/question', function(request, response){

});
app.get('/', function(request, response) {


	response.set('Content-Type', 'text/html');
	var indexPage = "<!DOCTYPE HTML><html><head><title>tf-queue Server</title></head><style>" + 
	"body {background-color: fuchsia;} p {color: yellow; font-size: 24px;} </style> <body>";
	// db.collection("passengers", function(error, coll){
	// 	coll.find().toArray(function(error, items){
	// 		//sorts by time
	// 		items.sort(compare);
	// 		for (i = 0; i < items.length; i++){
	// 			indexPage = indexPage + "<p>" + items[i].username + " requested a vehicle at " + 
	// 						items[i].lat + ", " + items[i].lng + " on " + 
	// 						items[i].created_at + "</p>";
	// 		}
			indexPage = indexPage + "</body></html>";
			response.send(indexPage);

	// 	});
	// });
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



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});