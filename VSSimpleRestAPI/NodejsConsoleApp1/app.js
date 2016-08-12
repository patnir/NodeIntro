var express = require('express');
var app = express();

app.get('/', function (req, res) {
	res.json({ message: 'hooray!' });
});

app.listen(7000);