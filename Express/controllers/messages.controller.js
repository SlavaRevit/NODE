
const path = require('path');


function getMessages (req, res) {
	const pathToFile = path.join(__dirname,'..', 'public', 'images', 'test.jpg')
	//dirname current file path / go up / public / test.jpg
	res.sendFile(pathToFile);
}


function postMessage(req, res) {
	res.send(`Updating messages...`);
}


module.exports = {
	getMessages,
	postMessage,
}