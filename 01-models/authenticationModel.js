////////////////////////////////
// This model handles the database for 
// users storage and authentication
////////////////////////////////

let mysql; 
let dbOptions;
let con;
let bcrypt;


// init_model (public)
let init_model = function(pMySQL, pDBOptions, pBcript){
	return new Promise((resolve, reject)=>{
		mysql = pMySQL;
		dbOptions = pDBOptions;
		bcrypt = pBcript;

		// Initialize tables:
		createTableOfusers()
		.then(data=>{
			console.log(data);
			resolve('::Auth Model:: Authentication Model initialized.');
		}, err=>{
			console.log('::Auth Model:: Error initializing Authentication Model.');
			reject(err);
		});
	});
}

/*
	validateDBConnection (private)
	This function returns a Promise.
	It assures there is an active connection to the database in the 
	con variable.
*/
let validateDBConnection = function(){
	return new Promise((resolve, reject)=>{
		if(con){
			// There is an existing connection, let's return it
			resolve('::Auth Model:: There is already a connection with the DB.');
		} else {
			con = mysql.createConnection(dbOptions);
			con.connect(function(err){
				if(err){console.log('::Auth Model:: Error connecting to DB.', err);}
			});
			resolve('::Auth Model:: Connection with the DB was created.');
		}
	});
}

// createTableOfusers (private)
let createTableOfusers = function(){
	return new Promise((resolve, reject)=>{
		validateDBConnection()
		.then(data=>{
			
			// There is already a con
			console.log(data);

			let sql = 'CREATE TABLE IF NOT EXISTS users (id INT, username VARCHAR(40), hash CHAR(200))';

			con.query(sql, function(err, result){
			
			if (err) {console.log('::Auth Model:: Error creating table of users.');reject(err);}
				resolve('::Auth Model:: Table of users created.');
			});

		}, err=>{
			reject('::Auth Model:: Error creating connection with the database.');
		});
	});
}

// validateLogin (public)
let validateLogin = function(pUser, pPass){
	return new Promise((resolve, reject)=>{
		// We first validate data format
		validateLoginDataFormat()
		.then(data=>{
			
			// Fine: validated, we validate database connection
			return validateDBConnection()
			.then(data=>{
				console.log(data);			

				let sql = 'SELECT * FROM users WHERE username = "'+pUser+'"';

				con.query(sql, function(err, result){
					console.log('result[0]');
					console.log(result[0]);
					if(err){console.log('::Auth Model:: Error authenticating user. ');reject(err);}
					else if (result != undefined && result[0] != undefined){
						if(result[0].hash != undefined && bcrypt.compareSync(pPass, result[0].hash)) {
							console.log('::Auth Model:: User authenticated. '); resolve({id:result[0].id});
								
						} else {
							reject('::Auth Model:: User not authenticated.');
						}
					} else {
						reject('::Auth Model:: User not authenticated.');
					}
				});



			}, err=>{
				reject('::Auth Model:: Error creating connection with the database.');
			});


		}, err=>{
			reject(err);
		});

		
	});
}

// registerUser (public)
let registerUser = function(pUser, pPass){
	return new Promise((resolve, reject)=>{
		// We first validate data format
		validateRegisterDataFormat()
		
		.then(data=>{
			
			// Fine: validated, we validate database connection
			return validateDBConnection()
			.then(data=>{
				console.log(data);

				let id;

				let hash = bcrypt.hashSync(pPass, parseInt(process.env.SALT_ROUNDS));

				confirmUserIsAvailable(con, pUser)
				  .then(data=>{
				  	if(data==true){
				  		// Already taken
				  		reject('::Auth Model:: Username already taken.');
				  	} else {
				  		// User available
				  		return lastUserID(con);
				  	}
				  })
				  .then(data=>{
				  	// data es el id más grande
				  	
				  	id = data+1;
				  	let sql = 'INSERT INTO users (id, username, hash) VALUES ("'+id+'", "'+pUser+'", "'+hash+'")';
			  		con.query(sql, function(err, result){
						if (err) {console.log('::Auth Model:: Error inserting new user to users table.');reject(err);}
						resolve({message:'::Auth Model:: New user inserted to users table.',id:id});
					});

				  }, err=>{
				  	reject('::Auth Model:: Error creating connection with the database.');
				  });
	
			})

		}, err=>{reject(err);})
		
	});
}

// confirmUserIsAvailable (private)
// returns true if the user is taken
let confirmUserIsAvailable = function(con, pUser){
	return new Promise((resolve, reject)=>{
		let sql = 'SELECT username FROM users WHERE username = "'+pUser+'"';
		con.query(sql, function(err,result){
			if(err){console.log('::Auth Model:: Error checking uniqueness of username.');reject(err);}
			else {
				if(result[0] != undefined){
					console.log('::Auth Model:: User already existed. '); resolve(true);
				} else{
					console.log('::Auth Model:: New user available.');
					resolve(false);
				}
			}
		})
	});
}

// (private)
let lastUserID = function(con){
	return new Promise((resolve, reject)=>{
		let sql = 'SELECT MAX(id) FROM users;'
		con.query(sql, function(err, result){
			if (err){console.log('::Auth Model:: Error finding the max id of users.');reject(err);}
			else if (result[0]['MAX(id)'] == null){
				// Not users registered yet
				resolve(0);
			}
			else {
				resolve(result[0]['MAX(id)']);
			}
		});
	});
}


let validateLoginDataFormat = function(pUser, pPass){
	return new Promise((resolve, reject)=>{
		//resolve('done');
		reject('You should change your input');
	});
}

let validateRegisterDataFormat = function(){
	return new Promise((resolve, reject)=>{
		//resolve('done');
		reject('You should change your input');
	});
}


module.exports={
	'init_model':init_model,
	'registerUser':registerUser,
	'validateLogin':validateLogin
}