const add = require('./test');

const cluster = require('cluster');
const express = require('express');

cluster.schedualingPolicy = cluster.SCHED_RR;
const app = express();

app.get('/', (req, res) => {
	res.send(`teeeest`);
});


if (cluster.isPrimary) {
	console.log('Master has been started');

	cluster.fork();
	cluster.fork();
} else {
	console.log(`Worker process started`);
	app.listen(3000);
}


add(2,3);







