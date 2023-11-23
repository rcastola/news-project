# Northcoders News API

# Project Summary

This project is a backend service for the purpose of hosting news articles with the following functionalities:

- Accessing all articles and filtering by topic
- Accessing an individual article
- Accessing a comment on an individual article
- Posting a comment on an individual article
- Amending the votes on an individual article
- Deleting an individual comment

# Setup

## Installation

1. Use git clone https://github.com/rcastola/news-project to clone the project
2. Create .env files:
   A- create .env.development and copy in the following: PGDATABASE=nc_news;
   B- create .env.test and copy in the following: PGDATABASE=nc_news_test;
   C- create .env.production and copy in the following:
   DATABASE_URL=postgres://yggvunsz:IlVunIKH43DzfTENEsb4oBpm9LkbjULh@surus.db.elephantsql.com/yggvunsz

3. use npm i to install all dependencies in the express server

4. use npm run "setup-dbs" to create the database

5. use npm run seed-prod to seed your database

6. npm start to launch the project on localhost:9090 or port provided in .env

7. you can run npm test to run tests locally.

## Project requirements

Minimum versions:
Node v18.17.1
Postgres v2.6.7

<!-- A link to the hosted version.
A summary of what the project is.
Clear instructions of how to clone, install dependencies, seed local database, and run tests.
Information about how to create the two .env files.
The minimum versions of Node.js, and Postgres needed to run the project. -->
