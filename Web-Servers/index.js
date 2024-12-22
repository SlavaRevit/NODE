const http = require('http');

const PORT = 3000;

const friends = [
	{
		id: 1,
		name: "Slava"
	},
	{
		id: 2,
		name: "Dima"
	},
	{
		id: 3,
		name: "Kolya"
	}
]

const server = http.createServer((req, res) => {
	const items = req.url.split('/')
	if (req.method === 'POST' && items[1] === 'friends') {
		req.on('data', (data) => {
			friends.push(JSON.parse(data));
			console.log(`Request: ${data.toString()}`);
		})
	} else if (req.method  === 'GET' && items[1] === 'friends') {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json')

		if (items.length === 3) {
			const friendIndex = Number(items[2]);
			res.end(JSON.stringify(friends[friendIndex - 1]))
		} else {
			res.end(JSON.stringify(friends))
		}
	} else if (items[1] === 'messages') {
			res.writeHead(200, {
				'Content-Type': 'application/json',
			})

			res.end(JSON.stringify({
				"id": 2,
				"message": "this is url message to test"
			}));
	} else {
		res.statusCode = 200;
		res.end();
	}

})


server.listen(PORT, () => {
	console.log('Server is listening on http://localhost:3000')
});