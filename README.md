# Damians News API

If you wish to clone this repo and run it locally - please follow the information below:

In order to connect to both databases locally (i.e. test and development) you must create 2 different env files - env.test and env.development

Inside these files you must set up the link to each database -

Inside your .env.test add "PGDATABASE=nc_news_test" (without quotations)

Inside your .env.development add "PGDATABASE=nc_news" (without quotations)

These must be added to your .gitignore file.
