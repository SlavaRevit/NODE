const express = require('express');
const path = require('path');

const friendsRouter = require('./routes/friends.router');
const messagesRouter = require('./routes/messages.router');


const PORT = 3000;
const app = express();

//Middlewares
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`)
	next();
})

app.use('/site', express.static(path.join(__dirname, 'public')));
app.use(express.json());

//Routes
app.use('/friends', friendsRouter);
app.use('/messages', messagesRouter);




app.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:3000`);
})


