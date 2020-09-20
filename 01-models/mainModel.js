// Here require specificl models
let specificModel = require('./specificModel');
let authenticationModel = require('./authenticationModel.js');

let init_models = function(pMySQL, pDBOptions, pBcript){
	return new Promise((resolve,reject)=>{
		// Here initialize each model
		authenticationModel.init_model(pMySQL, pDBOptions, pBcript)
		.then(data=>{
			console.log(data);
			return specificModel.init_model();
		})
		.then(data=>{
			console.log(data);
			resolve('::Main Model:: Models initialized.');
		}, err=>{
			console.log('::Main Model:: Error initializing models.');
			reject(err);
		})
	});
}

module.exports={
	'init_models':init_models,
	'specificModel':specificModel,
	'authenticationModel':authenticationModel
}