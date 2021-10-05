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

Spin up the database:

`docker-compose up`

Then in a new terminal:

`npm run dev`

## Deploying 

This project deployes to heroku on merge to master [here](http://eb-quiz-manager.herokuapp.com/). 
Pre commit hooks are set up to run es-lint and all unit tests, therefore the db will need to be spun up as detailed above in order to make a commit. 