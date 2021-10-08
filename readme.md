# Quiz Manager
A CRUD website buit with express and handlebars to facilitate the managment of quizzes.

## Prerequisites
You will need to have [docker](https://docs.docker.com/get-docker/) set up to run the database.

## Running 

first spin up the database: 

`docker-compose up`

then in a new terminal:

`npm build && npm start` 

OR 

`npm run dev`

## Testing

Spin up the databases:

`docker-compose up`

Then in a new terminal:

`npm run test`

The docker containers need to be stopped and removed imbetween each test run. This includes prior to commit.
To stop the containers `CTRL + C` in the terminal where docker is running. Then: `docker rm $(docker ps -a -q)` to remove all stopped containers. 


## User permissions 

User information has been pre configured to the database using SQL inserts. 
A user with each level permission has been added. 

To test the functionality of the site the following credentials can be used:

### Restricted 

username: 
`restricted_user`

password:
`restricted_password`

### View 

username: 
`view_user`

password:
`view_password`

### Edit

username: 
`edit_user`

password: 
`edit_password`


## Deploying 

This project deployes to heroku on merge to master [here](http://eb-quiz-manager.herokuapp.com/). 
Pre commit hooks are set up to run es-lint and all unit tests, therefore the db will need to be spun up as detailed above in order to make a commit. 