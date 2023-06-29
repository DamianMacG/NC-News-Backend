# Reddit Style API

# Demo:
A hosted version of the project can be found at the link below. You can try it out by visiting the website and exploring its features.

https://reddit-style-backend-nc.onrender.com/api/

# Project Overview:

This project is a comprehensive web application which provides users with a wide range of features and functionalities to engage with various topics and communities. Users can submit articles, comment on articles, and vote on both articles and comments. The application also allows users to browse articles by topic, sort them by popularity or recency, and search for specific articles. With its intuitive user interface and seamless navigation, this project aims to foster a vibrant and interactive online community where users can discover, share, and discuss content on diverse subjects.


# Setup & Installation:
Clone the repository to your local machine: git clone https://github.com/DamianMacG/NC-News-Backend.git

"cd" into the project's directory and install the project dependencies: npm install

To create the databases and seed the tables, please run the following commands:

npm run setup-dbs

npm run seed

In order to connect to both databases locally (i.e. test and development) you must create 2 different env files in your root folder - env.test and env.development
Inside these files you must set up the link to each database -

Inside your .env.test add "PGDATABASE=nc_news_test" (without quotations)
Inside your .env.development add "PGDATABASE=nc_news" (without quotations)
These must be added to your .gitignore file.

The minimum versions required for running the Project Name project are:

Node.js: v12 or higher

PostgreSQL: v10 or higher

To run the application locally: 

npm start

The application should now be accessible at http://localhost:9090.


# Testing:

To run the project's tests:

npm test


