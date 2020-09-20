# Adding a New Page

Follow the next **five** steps to create **a new page** within the server:

1. **Router:** In the 02-router.js file define a function to handle the get request related to your new page. It should be inside the Promise returned from the **init_router( )** function:

```js
let init_router = function(pApp, pController){
	return new Promise((resolve,reject)=>{
		app = pApp;
		controller = pController;

		// ...

		// Here you should insert your get-request handler like in the following box.

		//...

		resolve('::Router:: Routes are defined.');
	});
}
```

Remember, the router should not perform any computation. It should exclusively call a function defined in the controller. The code should look something like this:

```js
app.get('/new_route', (req, res)=>{
	console.log('::Router:: '+timestamp()+' GET "/new_route" recieved from: '+req.connection.remoteAddress);
	controller.newFunctionInController(req,res);
});
```

2. **Controller:** Define the function in the controller.js file located in the 03-controllers directory. It should have a section where you ask for processed information to the correspondent model, and another where you render the page, return the file, etc.

```js
let newFunctionInController = function(req, res){
	// Consult the correspondent model first
	model.specificModel.returnMeTheData()
	.then(data=>{
		// Execute action with the processed data
		res.render('./ejs/newPage', data);
	}, err=>{
		console.log('::Controller:: Error collecting data from specificModel. ', err);
	});
}
```

You should add the new function to the module.exports object in the same file, so the router is able to call it:

```js
module.exports={
	'init_controller':init_controller,
	'getIndex':getIndex,
	'newFunctionInController':newFunctionInController
}
```

3. **Specific model:** Create a file in the 01-models directory to represent the specific logic of your new page. It should contain at least two functions. A function to initialize the model with its initial conditions, and a function to return processed information. **You can use the same model to handle the logic of many pages** just by calling functions in the same document from the controller.

```js
let initialCondition;
let initialCondition2;

let init_model = function(pInitialCondition1, pInitialCondition2){
	return new Promise((resolve, reject)=>{
		// Initializing this model
		initialCondition = pInitialCondition1;
		initialCondition2 = pInitialCondition2;
		resolve('::Specific Model:: Model initialized.');
	});
}

let returnMeTheData = function(){
	// Do some processing in here ...
	return {'cond1':initialCondition, 'cond2':initialCondition2};
}

module.exports={
	'returnMeTheData':returnMeTheData,
	'init_model':init_model
}
```

Include both functions in the module.exports object, so the main model and the controller are able to call them.

4. **Main model:** To connect your new logic to the server, require the new model's file into the mainModel.js file (in the 01-models directory):

```js
let exampleModel = require('./exampleModel');
let newModel = require('./newModel');
```

Next, initialize the values of the specific model by introducing a .then( ) action to the promises chain in the init_models( ) function in the same file:

```js
let init_models = function(mysql){
	return new Promise((resolve,reject)=>{
		exampleModel.init_model(mysql)
		/* Here you insert a chain to initialize the new model */
		.then(data=>{
			console.log(data);
			newModel.init_model();
		})
		/* Until here */
		.then(data => {
			console.log(data);
			resolve('::Main Model:: Models initialized.');
		}, err=>{
			console.log('::Main Model:: Error initializing models.');
			reject(err);
		});
	});
}
```

Finally, insert your new model to the module.exports object in the same file, so the controller is able to call functions inside it:

```js
module.exports={
	'init_models':init_models,
	'exampleModel':exampleModel,
	'newModel':newModel
}
```

5. **Views:** Create the files for your views in the 02-views folder. There you will find a folder for each type of file: ejs, css, js (client-side). The controller provides the processed data from the models; so, you can use standard ejs syntax to include this information.

```html
<body>
	<p>The first variable is <%=cond1 %>, and the second is <%=cond2 %>.</p>
</body>
```

That's it! You have just inserted a new page into an MVC architecture.

## Forms

Additionally, if your new page has a form, you should also follow the next analogous steps to handle the request when the form is submitted.

1. **Router:** Call the function in the controller to handle the **post** request with the same route once the form is submitted.
1. **Controller:** Define a function that calls the function in the model to process the form request. Add it to the *module.exports* object as well.
1. **Model:** Define the function you called in the controller to process the request data.
1. **Views:** Your controller should send some response once the model has a result of the operation. You could render a new page from the views, or you could send some object in response:

```js
res.send('<h1>Done!</h1>');
```
