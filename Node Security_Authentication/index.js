require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

const PORT = 3000;

const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_PASSWORD: process.env.CLIENT_PASSWORD,
	COOKIE_KEY_1: process.env.COOKIE_KEY_1,
	COOKIE_KEY_2: process.env.COOKIE_KEY_2,
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

// Save the session to cookie
passport.serializeUser((user, done) => {
	console.log('Serializing user:', user); // Add a log here
	done(null, user.id);
});

// Read the session from the cookie
passport.deserializeUser((user, done) => {
	console.log(`iD is: ${user}`);
	done(null, user);
});

const app = express();
app.use(helmet());

app.use((req, res, next) => {
	res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
	next();
});

//in new versions of passport .regenerate and .save makes mistake, and this
// middleware needed to handle it.
app.use(
	cookieSession({
		name: 'session',
		maxAge: 24 * 60 * 60 * 1000, // 1 day
		keys: ['key1', 'key2'], // Your secret keys,
		sameSite: 'none',
		secure: 'true',
	})
);

app.use((req, res, next) => {
	if (req.session && !req.session.regenerate) {
		req.session.regenerate = cb => {
			cb();
		};
	}
	if (req.session && !req.session.save) {
		req.session.save = cb => {
			cb();
		};
	}
	next();
});

function checkLoggedIn(req, res, next) {
	console.log(`current user is ${req.id}`);
	//isAuthenticated ---> coming from passport.
	const isLoggedIn = req.user;
	// console.log(isLoggedIn);
	if (!isLoggedIn) {
		return res.status(401).json({
			error: 'You must log in',
		});
	}
	next();
}

//sets passports session
app.use(passport.initialize());
app.use(passport.session());

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
		session: true,
	}),
	(req, res) => {
		console.log(`Google called us back.`);
	}
);

app.get('/auth/logout', (req, res) => {
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
