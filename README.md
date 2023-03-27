# Northcoders News API

## Stack
- husky (makes sure jest tests pass before being allowed to commit)
- jest (unit testing)
- supertest (integration testing)
- express (handles the server and API requests)
- PostgreSQL (handles the database and queries)
- pg (handles postgres with javascript)
- pg-format (allows for easy data insertion)
- dotenv (sets up environment variables)

The only thing that cannot be set up here is PostgreSQL, this is something set up outside of the project, consider referring to their documentation -
https://www.postgresql.org/docs/

## Setup
To get started, open the project and navigate to the root directory of the project within a terminal, then run the command -
```
npm i
```
This will get the dependencies needed, if you only wanted the dependencies needed to just run the project and don't care about the testing, use this command -
```
npm i --only=prod
```

## Accessing the data
To be able to start accessing the data, you need to set up a .env file in the root of the directory, this .env file should be named **.env.development** inside this .env file, add the following line -
```
PGDATABASE=<databse_name>
```
This will ensure when the project is ran it will connect to the provided database

