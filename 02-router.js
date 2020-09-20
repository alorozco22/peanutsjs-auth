let app;
let controller;

let timestamp = function(){
	let date = new Date();
	return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+':'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+':'+date.getMilliseconds();
}

let init_router = function(pApp, pController){
	return new Promise((resolve, reject)=>{
		app = pApp;
		controller = pController;

		// Here define the routes	
		app.get('/', (req, res)=>{
			console.log('::Router:: '+timestamp()+' GET "/" recieved from: '+req.connection.remoteAddress);
			controller.getIndex(req,res);
		});

		app.get('/dashboard', controller.redirectLogin, (req, res)=>{
			console.log('::Router:: '+timestamp()+' GET "/dashboard" recieved from: '+req.connection.remoteAddress);
			controller.getDashboard(req,res);
		});

		app.get('/login', controller.redirectDashboard, (req, res)=>{
			console.log('::Router:: '+timestamp()+' GET "/login" recieved from: '+req.connection.remoteAddress);
			controller.getLogin(req,res);
		});

		app.get('/register', controller.redirectDashboard, (req, res)=>{
			console.log('::Router:: '+timestamp()+' GET "/register" recieved from: '+req.connection.remoteAddress);
			controller.getRegister(req,res);
		});

		app.post('/login', controller.redirectDashboard, (req, res)=>{
			console.log('::Router:: '+timestamp()+' POST "/login" recieved from: '+req.connection.remoteAddress);
			controller.postLogin(req,res);
		});

		app.post('/register', controller.redirectDashboard, (req, res)=>{
			console.log('::Router:: '+timestamp()+' POST "/register" recieved from: '+req.connection.remoteAddress);
			controller.postRegister(req,res);
		});

		app.post('/logout', controller.redirectLogin, (req, res)=>{
			console.log('::Router:: '+timestamp()+' POST "/logout" recieved from: '+req.connection.remoteAddress);
			controller.postLogout(req,res);
		});

		resolve('::Router:: Routes are defined.');
	});
}

module.exports={
	'init_router':init_router
}