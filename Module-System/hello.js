
const {get} = require('Module-System/https.mjs');


get('https://www.google.com', (res) => {
	res.on('data', (chunk) => {
		console.log(`Data chunk ${chunk}`);
	})

	res.on('end', () => {
		console.log('no more data.')
	});
})

//always need to do it;
// req.end();




