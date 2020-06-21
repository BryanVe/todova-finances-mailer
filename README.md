# Todova Finances Mailer

This application aims to generate csv files from a database.

## Getting Started

### Prerequisites

You need to have [`Node.js`](https://nodejs.org/en/download/), [`mongoDB`](https://www.mongodb.com/try/download/community) and [`yarn`](https://classic.yarnpkg.com/en/docs/install) installed.

### Installation

In order to use this project you have to follow the next steps.

#### Server

Create an `.env` file inside server folder. It looks like:

```
PORT=XXXX
```

Open a terminal and run the following commands:

```
yarn
yarn start
```

This will run the development server, so you will see a message as follows:

```
yarn run v1.22.4
$ nodemon -r dotenv/config src/index.js
[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node -r dotenv/config src/index.js`
Server running on port XXXX
Connected to database!
```

#### Client

Open a terminal and run the following commands:

```
yarn
yarn start
```

This will run the development client, so you will see a message as follows:

```
Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.X:3000

Note that the development build is not optimized.
To create a production build, use yarn build.
```
