var fs = require('fs');

var contents = fs.readFileSync('package.json').toString();

console.log(contents);

fs.readFile('package.json',
	function(err, buf) {
		console.log(buf.toString());
	});


// Call back style programming

/*
	Event loops result in call back style programming when 
	you break apart a program into its underlying dataflow
*/

// Promises

/*
	A funtion will return a promise for an object in the future
	Promises can be chained together
	Simplifying programming of async systems
*/