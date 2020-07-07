# Todova Finances Mailer

This application aims to generate csv files from a database.

## Getting Started

### Prerequisites

You need to have [`Node.js`](https://nodejs.org/en/download/), [`mongoDB`](https://www.mongodb.com/try/download/community) and [`yarn`](https://classic.yarnpkg.com/en/docs/install) installed.

### Clone

Clone this repo to your local machine using `https://github.com/BryanVe/todova-finances-mailer.git`

## Installation

In order to use this project you have to follow the next steps.

### Server

Create an `.env` file inside server folder. It looks like:

```bash
PORT=XXXX
MONGO=<URI>
```

Open a terminal and run the following commands:

```bash
yarn
yarn start
```

This will run the development server, so you will see a message as follows:

```bash
yarn run v1.22.4
$ nodemon -r dotenv/config src/index.js --max-old-space-size=4096
[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node -r dotenv/config src/index.js --max-old-space-size=4096`
Server running on port 4000
Connected to database!
```

### Client

Open a terminal and run the following commands:

```bash
yarn
yarn start
```

This will run the development client, so you will see a message as follows:

```bash
Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.X:3000

Note that the development build is not optimized.
To create a production build, use yarn build.
```

## Usage

### Server

This project have six endpoints implemented:

1. Home: `/`, this endpoint has a get method, just to know that our server is running.

2. The other five endpoints have the same structure, like this: `/<field>/download` where `<field>` can be `customers`, `drivers`, `enterprises`, `shipments` or `driverSchedules`.

   These endpoints has a post method and it serves to download the csv files using params to modify the date range. They accept a payload, like the next examples:

   - To get all the data available:
     ```json
     {
       "period": "all"
     }
     ```
   - To get data from just one day:
     ```json
     {
       "period": "one",
       "params": {
         "date": "2019-03-07T04:00:00.000Z"
       }
     }
     ```
   - To get data from an interval of dates:
     ```json
     {
       "period": "interval",
       "params": {
         "startDate": "2019-03-07T04:00:00.000Z",
         "endDate": "2019-04-25T04:00:00.000Z"
       }
     }
     ```

## Notes

- The dates have to be sended in ISOString format.
