var path = require('path');

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
		console.log("init api request");
		res.sendFile(path.resolve(__dirname + "/../data/playerjson.txt"));
	});

	// hit this link for suggestions
	app.post("/api/suggest", function (req, res) {
		var data = '';
		req.on("data", function (stuff) {
			data += stuff;
		});

		req.on('end', function() {
			console.log(JSON.stringify(data));
			res.send(data);
			res.status(200);
		})
	});
};
