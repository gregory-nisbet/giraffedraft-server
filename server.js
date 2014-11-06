var express = require('express');
var routes = require('./config/routes');

var app = express();
routes(app, express);

app.listen(9001, function () {
	console.log("now listening on ports over 9000.")
});
