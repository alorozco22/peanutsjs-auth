// THIS IS A FICTIONAL MODEL, PLEASE REMOVE

let init_model = function(){
	return new Promise((resolve, reject)=>{
		// Initializing this model
		resolve('::Specific Model:: Model initialized.');
	});
}

let returnMeTheData = function(){
	// Do some processing in here ...
	return new Promise((resolve,reject)=>{
		resolve('data data data');
	});
}


module.exports={
	'returnMeTheData':returnMeTheData,
	'init_model':init_model
}