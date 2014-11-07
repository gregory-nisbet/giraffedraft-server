var express = require('express');
var routes = require('./server/config/routes');

var port = process.env.PORT || 9001;

var app = module.exports = express();
routes(app, express);

app.listen(port, function () {
	console.log("now listening on port: " + port);
});
