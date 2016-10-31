var fs = require('fs');

// helper functions
var count = 0;
var keywordToFind = 'TCP';

fs.readFile('./input.txt', 'utf8', function(err,data) {
	if (err) {
		return console.log('file not found');
	}
	//console.log(data);

	// fake map reduce calls
	var lines = data.split('\n');
	for (var i=0;i<lines.length;i++) {
		map(i, lines[i])
	}
	for (var key in context.map) {
		reduce(key, context.read(key));
	}
	// OUTPUT ALL KEYS AND THEIR FINAL COUNT
	//for (var key in result.map) {
	//	console.log(key, result.read(key))
	//}
	printResult();
});

// *** Start your code here *** //

var context = {
	map: {},
	// TODO
}

var result = {
	map: {},
	// TODO
}

function map(key, value) {
	// TODO
}

function reduce(key, values) {
	// TODO
}

// *** End your code here *** //

function printResult() {
	console.log(count);
}
