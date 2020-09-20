# Sessions and Authentication

The authentication example in PeanutsJS follows [Randall Degges Talk](https://youtu.be/j8Yxff6L_po) on authentication systems in Node.js. I recommend you watch it first, so you have a general idea. [bcryptjs](https://www.npmjs.com/package/bcryptjs) library is used to hash passwords in the database. This way, you won't be able to recover a plain password from a database; instead, you will hash the inserted password, and check if the hashes coincide.

There are four kinds of content when speaking about authentication in PeanutsJS:

- **Registration pages:** its view contains a form that emits a post request to modify the database and introduce new login credentials in the table of credentials. Depending on the problem, you may not want to leave it accessible.
- **Login page:** its view contains a form that emits a post request to create a new active session.
- **Restricted pages:** if the session username and password hash are recognized, these are rendered; otherwise, the user receives a non-authorized error.
- **Non-restricted pages:** it is rendered directly from a get request without checking authentication details.

## Getting Started

To implement a session system in PeanutsJS follow the steps described in [Adding a New Page](./add-new-page.md) to implement 2, 3 and 4:

1. You have to configure the general packages in the [01-main.js file](#general-configuration) first.
1. A [registration page](#registration-page).
1. A [login page](#login-page).
1. A [restricted content](#restricted-content) page.

Some additional details for each of them are described next.



**sessionModel** file in the 01-models directory contains an example of an entire model used for authentication and session purposes through all the related pages.

## General Configuration

The 01-main.js file requires the correspondent libraries for sessions and session storage in database: 

```js
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore(dbOptions);
const csurf = require('csurf'); // For CSRF protection in request forms
```

It also configures the middleware for session storage:

```js
/* Using middlewares: Sessions store (mySQL) */
app.use(
	session({
	store: sessionStore,
	secret: process.env.SESSIONSECRET,
	resave: false,
	saveUninitialized: false,
	httpOnly: true,
	ephemeral: true
	})
);
```

## Registration Page

Since this page has a form, it follows both procedures in the [forms section](#forms) when the **controller** is rendering the **views**.

There are two functions defined in the **sessionModel** for this page: 

* **insertNewUser:** It executes the query in database to create a new user entry with its hashed password. For this, the function hashes the password, saves this in the database and returns the hash so the req.body.password element can be overwritten from the controller with the new hash.

```js
let hash = bcrypt.hashSync(pPass, 14);
let sql = 'INSERT INTO users (username, hash) VALUES ("'+pUser+'", "'+hash+'")';

// Then the query for saving the new user's information in users table is executed.

resolve({message:'::Sessions Model:: New user inserted to users table.',hash:hash});

```

In the controller, you overwritte the req.body.password element once the model has done its job:

```js
req.body.password = data.hash;
```

* **userAlreadyTaken:** It takes a username and checks whether it was already taken.

The users table is created when initializing the model. Since the database was created in the exampleModel, it's not created again.

## Login Page

The **sessionModel** takes (for the post request) the plain password and applies hashing to it, then compares the two hashes. **bcryptjs** handles all this:

```js
if(result[0] != undefined && bcrypt.compareSync(pPass, result[0].hash)){
	// There is a correspondent user and the hash matches with input.
	console.log('::Sessions Model:: User authenticated. '); resolve(true);
} else {
	console.log('::Sessions Model:: User not authenticated. '); resolve(false);
}
```

Once your model checks that your user is authenticated, you simply create a session from the **controller** and finish with the response:

```js
req.session.username = req.body.username;
```

## Restricted Content

If you want to create a logout form within the restricted content page, you should render the restricted content page with the correspondent procedures in the [forms](#forms) section.

To handle the **logout request**, use the next function in the controller:
```js
req.session.destroy(function(err){
	// Handle the response.
});
```

To check if the user **has an active session**, simply do the next in the **controller**:

```js
/* Authentication: restricted page */
let getRestricted = function(req,res){
	if(req.session.username==undefined){
		res.render('./ejs/login', {csrfToken: req.csrfToken(), error:'You are not authorized to see this content, please login.'});
	} else {
		// Consult some model and then render with data. Let's just send an static page:
		res.render('./ejs/restricted', {csrfToken: req.csrfToken()});
	}
}
```

## Forms

### CSRF

Every form has a hidden input with a random number named *"\_csrf"* to protect against cross site request forgery. [CSURF library](https://www.npmjs.com/package/csurf) is used as a middleware to handle the random tokens. To add a token to a form, first render the form with the **csrfToken** additional information from the controller:

```js
res.render('./ejs/signup', {csrfToken: req.csrfToken(), error:''});	
```

Then, include in the form a hidden input like this:

```html
<input type="hidden" name="_csrf" value="<%=csrfToken %>">
```

### Errors after submitting

The **error** piece of information is used to render the form again with a feedback message in case the operation didn't work.

To display the information in the ejs file, just include an empty element like the next:

```html
<p><%=error %></p>
```
The response to a **get** request should include an empty value for this field:

```js
res.render('./ejs/signup', {csrfToken: req.csrfToken(), error:''}); 
```
The response to a **post** request should display the error if the operation could not be completed in the model:
```js
res.render('./ejs/signup', {csrfToken: req.csrfToken(), error:err});
```