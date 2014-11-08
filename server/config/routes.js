var path = require('path');
var picker = require('../picker/picker.js')
var fs = require('fs')

module.exports = function (app, express) {

	// Use the client folder as the root public folder.
	// This allows client/index.html to be used on the / route.
	app.use(express.static(__dirname + '/../../client'));

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", '*');
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	// chrome extension hits this link to get info on all players
	app.get("/api/init", function (req, res) {

		fs.readFile(__dirname + "/../data/playerjson.txt", function(err,data){
			var data = data + ''
			var data = JSON.parse(data);
			var picks = JSON.stringify(picker.getPicks(data));
			console.log('get request', picks)
			res.send(picks);
		})

	});

	// hit this link for suggestions
	app.post("/api/suggest", function (req, res) {
		var data = JSON.stringify(req.body);
		console.log(data);

		var picks = picker.getPicks(data);
		res.send(JSON.stringify(picks));
	});
};
