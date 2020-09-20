////////////////////////////////
// PEANUTSJS - MVC Server Authentication template
// NodeJS Server Framework
// Sep 2020
// Alfredo Orozco Quesada
// ae.orozco10@uniandes.edu.co
// Thanks to https://www.youtube.com/watch?v=OH6Z0dJ_Huk
// Run dev with: npm run dev
////////////////////////////////

/* Configuring environment variables file */
const dotenv = require('dotenv').config();

/* Consulting environment variables */
const port = process.env.PORT;

/* Requiring libraries */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');


//IF YOU WANT TO CONFIGURE SOCKET.IO
/*
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const UUID = require('node-uuid');
*/

/* Requiring libraries: Sessions store (mySQL) */

let dbOptions = {
	//database: process.env.DBNAME,
	host: process.env.DBURL,
	port: process.env.DBPORT,
	user: process.env.DBUSER,
	password: process.env.DBPASSWORD,
	database: process.env.DBNAME
};


// Session storage configuration in database
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore(dbOptions);

// Configuring security basics
//const csurf = require('csurf'); // For CSRF protection in request forms
const bcrypt = require('bcryptjs'); // For hashing and encription libraries

/* Requiring MVC modules */
// Note: View files are rendered from the controller module once it has the data.
const model = require('./01-models/mainModel');
const controller = require('./03-controllers/controller');
const router = require('./02-router');

/* Using middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Using middlewares: Static references to views: css, js (client-side), etc. */
app.use('/css', express.static(__dirname + '/02-views/css'));
app.use('/js', express.static(__dirname + '/02-views/js'));
app.use('/ico', express.static(__dirname + '/02-views/favicon'));
app.use('/html', express.static(__dirname + '/02-views/html'));
app.use('/img', express.static(__dirname + '/02-views/img'));

/* Using middlewares: template engine (EJS) */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '02-views'));

/* Using middlewares: in case the front-end is in a different server than the backend */
app.use(cors());

/* Using middlewares: Sessions store (mySQL) */
app.use(
	session({
	name: process.env.SESSIONNAME,
	store: sessionStore, // Comment for prototyping with local memory (just in dev)
	secret: process.env.SESSIONSECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: parseInt(process.env.SESSIONLIFETIME),
		sameSite: true,
		secure: (process.env.PRODUCTION == "true"),
	}
	})
);

//IF YOU WANT TO CONFIGURE SOCKET.IO
//Socket.io will call this function when a client connects, 
//So we can send that client a unique ID we use so we can 
//maintain the list of players.
// Thanks to http://buildnewgames.com/real-time-multiplayer/
/*
io.on('connection', function (client) {

	let itsRoom = 'unica';

	client.join(itsRoom);
    //Generate a new UUID, looks something like 
    //5b2ca132-64bd-4513-99da-90e838ca47d1
    //and store this on their socket/connection
	client.userid = UUID();

    //tell the player they connected, giving them their id
	client.emit('onconnected', { id: client.userid, room:itsRoom} );

    //Useful to know when someone connects
	console.log('\t socket.io:: player ' + client.userid + ' connected');

    //When this client disconnects
	client.on('disconnect', function () {
    	//Useful to know when someone disconnects
    	console.log('\t socket.io:: client disconnected ' + client.userid );
	}); //client.on disconnect

}); //sio.sockets.on connection
*/

/* Initializing modules and listening to requests */
model.init_models(mysql, dbOptions, bcrypt)
.then(data=>{
	console.log(data);
	return controller.init_controller(model);
})
.then(data=>{
	console.log(data);
	return router.init_router(app, controller);
})
.then(data=>{
	console.log(data);
	app.listen(port);
	console.log('::Main:: Ready! Listening on port: '+port);
}, err=>{
	console.log(err);
});