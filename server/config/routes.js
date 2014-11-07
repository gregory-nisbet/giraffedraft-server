var path = require('path');

module.exports = function (app, express) {

	// Use the client folder as the root public folder.
	// This allows client/index.html to be used on the / route.
	app.use(express.static(__dirname + '/../../client'));

	app.get("/api", function (req, res) {
		res.sendFile(path.resolve(__dirname + "/../data/data.json"));
	});
};
