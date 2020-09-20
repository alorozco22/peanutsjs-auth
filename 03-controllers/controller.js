let model;

let init_controller = function(pModel){
	return new Promise((resolve,reject)=>{
		model = pModel;
		resolve('::Controller:: Controller initialized.');
	});
}

// Here define your functions called from the router
let getIndex = function(req, res){
	// Auth first
	let  logged  = !(req.session.userID == undefined);
	console.log('logged?: '+logged);
	// Consult the correspondent model first
	model.specificModel.returnMeTheData()
	.then(data=>{
		// Execute action with the processed data	
		res.render('./ejs/index', {'data': data, 'logged': logged});
	}, err=>{
		console.log('::Controller:: Error collecting data from specificModel. ', err);
	});
}

let getDashboard = function(req, res){
	// Consult the correspondent model first
	model.specificModel.returnMeTheData()
	.then(data=>{
		// Execute action with the processed data
		res.send('<h1>Home</h1><a href="/">Main Page</a><ul><li>Name:</li><li>Username:</li></ul> ');
		//res.render('./ejs/newPage', data);
	}, err=>{
		console.log('::Controller:: Error collecting data from specificModel. ', err);
	});
}

let getLogin = function(req, res){
	// Consult the correspondent model first
	model.specificModel.returnMeTheData()
	.then(data=>{
		// Execute action with the processed data
		// Here we assign in the session the id of the user authenticated req.session.userID = 
		res.send('<h1>Login</h1><form method="post" action="/login"><input type="email" name="email" placeholder="Email" required /><input type="password" name="password" placeholder="Password" required /><input type="submit"></form><a href="/register">Register</a>');
		// res.render('./ejs/newPage', data);
	}, err=>{
		console.log('::Controller:: Error collecting data from specificModel. ', err);
	});
}

let getRegister = function(req, res){
	// Consult the correspondent model first
	model.specificModel.returnMeTheData()
	.then(data=>{
		// Execute action with the processed data
		res.send('<h1>Register</h1><form method="post" action="/register"><input name="name" placeholder="Name" required /><input type="email" name="email" placeholder="Email" required /><input type="password" name="password" placeholder="Password" required /><input type="submit"></form><a href="/login">Login</a>');
		//res.render('./ejs/newPage', data);
	}, err=>{
		console.log('::Controller:: Error collecting data from specificModel. ', err);
	});
}

let postLogin = function(req, res){
	// Auth first
	model.authenticationModel.validateLogin(req.body.email, req.body.password)
	// Consult the correspondent model first
	.then(data=>{
		// Authenticated
		console.log('::Controller:: User authenticated with id: '+data.id);
		req.session.userID = data.id;
		//return model.specificModel.returnMeTheData();
		res.redirect('/dashboard');
	}, err=>{
		// Not authenticated
		console.log('::Controller:: Error validating', err);
		res.redirect('/login', err);
	});
}

let postRegister = function(req, res){
	model.authenticationModel.registerUser(req.body.email, req.body.password)
	.then(data=>{
		req.session.userID = data.id;
		res.redirect('/dashboard');
	}, err=>{
		res.redirect('/register', err);
		console.log('::Controller:: Error registering user. ', err);
	});
}

let postLogout = function(req, res){
	req.session.destroy((err)=>{
		if (err){
			return res.redirect('/dashboard');
		}
		res.clearCookie(process.env.SESSIONNAME);
		res.redirect('/');
	});
}


// Middleware functions
let redirectLogin = function(req, res, next){
	if(!req.session.userID){
		res.redirect('/login');
	} else {
		next();
	}
}

let redirectDashboard = function(req, res, next){
	//console.log('redirectDashboard: req.session.userID: '+req.session.userID)
	if(req.session.userID){
		res.redirect('/dashboard');
	} else {
		next();
	}
}

module.exports={
	'init_controller':init_controller,
	'getIndex':getIndex,
	'getDashboard':getDashboard,
	'getLogin':getLogin,
	'getRegister':getRegister,
	'postLogin':postLogin,
	'postRegister':postRegister,
	'postLogout':postLogout,
	'redirectLogin':redirectLogin,
	'redirectDashboard':redirectDashboard
}