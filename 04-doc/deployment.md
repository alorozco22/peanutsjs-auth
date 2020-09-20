# Deployment to Heroku

Follow the next steps to deploy the server from scratch to Heroku. If you don't have an account in Heroku, plese [sign up](https://www.heroku.com/) first and install the [Command Line Interface CLI](https://devcenter.heroku.com/articles/heroku-cli).


### Clone and initialize the repository

First, excecute:

```
git clone https://github.com/alorozco22/peanutsjs.git
cd peanutsjs
```

Next, remove the .git folder inside your project. This folder may be hidden at first.

Finally initialize a new git repository:

```
git init
git add .
git commit -m "First Deployment"
```

### Login from the CLI

Please execute from your terminal:

```
heroku login
```

Introduce your credentials.

### Create an app in Heroku

```
heroku create [name-of-your-app]
```
You should consider that your app is going to be available in https://name-of-your-app.herokuapp.com/

### Provision the database addon

Your app will be executed from inside a virtual computer (Linux container), they call it a **dyno**. Heroku calls **addon** an extra service associated to your dyno. PeanutsJS uses the [mySQL ClearDB](https://elements.heroku.com/addons/cleardb) addon for database storage. There are many other database addons, like postgreSQL, mongoDB, etc. For more details on how Heroku works, please visit the [documentation](https://devcenter.heroku.com/categories/heroku-architecture).

```
heroku addons:create cleardb:ignite
```

### Configure your database

Now you have your free mySQL addon associated. It will give you **one database** with 5 Mb of space. Since this is a free addon, you will not be able to create other databases in Heroku. Next, you have to configure your environment variables in heroku. 

Check your environment variables with: 

```
heroku config
```

You should see an environment variable called **CLEARDB_DATABASE_URL**. This variable follows the next format:

```
mysql://[DBUSER]:[DBPASSWORD]@[DBURL]/[DBNAME]?reconnect=true
```

Define the next environment variables from your config file with this information from your command prompt/terminal:

```
heroku config:set DBUSER=[DBUSER]
heroku config:set DBPASSWORD=[DBPASSWORD]
heroku config:set DBURL=[DBURL]
heroku config:set DBPORT=3306
heroku config:set DBNAME=[DBNAME]
```

Finally set any session secret you want:

```
heroku config:set SESSIONSECRET=[Any long random string]
```

### Push your app

```
git push heroku master
```

Now you can see your app if you run:

```
heroku open
```
