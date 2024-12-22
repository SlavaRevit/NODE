require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const PORT = 3000;

const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_PASSWORD: process.env.CLIENT_PASSWORD,
};

const AUTH_OPTIONS = {
	callbackURL: '/auth/google/callback',
	clientID: config.CLIENT_ID,
	clientSecret: config.CLIENT_PASSWORD,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log(`Google profile`, profile);
	done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

const app = express();

app.use(helmet());
app.use(passport.initialize());

function checkLoggedIn(req, res, next) {
	const isLoggedIn = true;
	if (!isLoggedIn) {
		return res.status(401).json({
			error: 'You must log in',
		});
	}
	next();
}

app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['email', 'profile'],
	})
);

app.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failure',
		successRedirect: '/',
		session: false,
	}),
	(req, res) => {
		console.loo(`Google called us back.`);
	}
);

app.get('/auth/logout', (req, res) => {
	res.clearCookie('connect.sid'); // Adjust cookie name if you're using a different one

	res.json({
		message: 'You have been logged out successfully',
	});
});

app.get('/secret', checkLoggedIn, (req, res) => {
	res.send(`Your personal secret value is 42`);
});

app.get('/failure', (req, res) => {
	res.send('Failed to log in');
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https
	.createServer(
		{
			cert: fs.readFileSync('cert.pem'),
			key: fs.readFileSync('key.pem'),
		},
		app
	)
	.listen(PORT, () => {
		console.log(`Listening on port https://localhost:${PORT}`);
	});
