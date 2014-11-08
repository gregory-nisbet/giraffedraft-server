var path = require('path');
var picker = require('../picker/picker.js')
var fs = require('fs')

module.exports = function (app, express) {

	// Use the client folder as the root public folder.
	// This allows client/index.html to be used on the / route.
	app.use(express.static(__dirname + '/../../client'));

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header("Access-Control-Allow-Headers",  'Content-Type');
		next();
	});

	// chrome extension hits this link to get info on all players
	app.get("/api/init", function (req, res) {

		fs.readFile(__dirname + "/../data/playerjson.txt", function(err,data){
			var data = data + ''
			var data = JSON.parse(data);
			res.send(data);
		})

	});


	// hit this link for suggestions
	app.post("/api/suggest", function (req, res) {
		var data = '';
		req.on("data", function (stuff) {
			data += stuff;
		});

		req.on('end', function() {
			data = JSON.parse(data);
			console.log(data);
			var picks = picker.getPicks(data);
			res.send(JSON.stringify(picks));
		})
	});
};
