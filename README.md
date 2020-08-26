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
ACCESS_TOKEN_SECRET=<secret>
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

Create an `.env` file inside client folder. It looks like:

```bash
REACT_APP_APIURL=http://192.168.1.X:<SERVER_PORT>
REACT_APP_DEFAULT_EMAIL=<email>
```

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

This project have fifteen endpoints implemented:

1. Home: `/`, this endpoint has a get method, just to know that our server is running.

2. Five endpoints have the same structure, like this: `/<field>/download`. Where `<field>` can be `customers`, `drivers`, `enterprises`, `shipments` or `driverSchedules`.

   These endpoints have a get method and it serves to download the csv files using query params to modify the date range. The structure of the query is as follows:

   ```
   /<field>/download?period=<periodOfTime>&params=<dateParams>
   ```

   Where:

   - `<periodOfTime>` can be `all`, `one` or `interval`.

   - `<dateParams>` can be

     ```json
     {
       "date": "2019-03-07T04:00:00.000Z"
     }
     ```

     or

     ```json
     {
       "startDate": "2019-03-07T04:00:00.000Z",
       "endDate": "2019-04-25T04:00:00.000Z"
     }
     ```

     or just be `null`. The `<dateParams>` field have to be stringified using the `JSON.stringify()` function and then be passed to the `encodeURIComponent()` function in order to send this field as an string encoded.

   Here are some examples:

   - To get all data:
     ```
     /<field>/download?period=all&params=null
     ```
   - To get data from just one day:

     If our `<dateParams>` is:

     ```json
     {
       "date": "2020-05-15T04:00:00.000Z"
     }
     ```

     Thus, we have:

     ```
     /<field>/download?period=one&params=%7B%22date%22%3A%222020-05-15T04%3A00%3A00.000Z%22%7D
     ```

   - To get data from an interval of dates:

     If our `<dateParams>` is:

     ```json
     {
       "startDate": "2020-05-15T04:00:00.000Z",
       "endDate": "2020-06-02T04:00:00.000Z"
     }
     ```

     Thus, we have:

     ```
     /<field>/download?period=interval&params=%7B%22startDate%22%3A%222020-05-15T04%3A00%3A00.000Z%22%2C%22endDate%22%3A%222020-06-02T04%3A00%3A00.000Z%22%7D
     ```

3. The other nine endpoints:
   - To generate the pdf files, this endpoint has a post method.
     ```
     /finances/pdf-files/generate
     ```
     The POST method accepts as a parameters:
     ```json
     {
       "beginDate": "2020-04-12T12:32:00.000Z",
       "endDate": "2020-05-13T12:32:00.000Z",
       "payDate": "2020-05-17T12:32:00.000Z"
     }
     ```
   - To get all the pdf files generated previously, this endpoint has a get method.
     ```
     /finances/pdf-files
     ```
   - To get one file as a report, this endpoint has a get method:
     ```
     /finances/pdf-files/:file
     ```
     Example:
     ```
     /finances/pdf-files/random_email@test.com
     ```
   - To send one file or a list of files, this endpoint has a post method:
     ```
     /finances/pdf-files/send
     ```
     The POST method accepts as a parameters:
     ```json
     {
       "files": [
         "email1@test.com.pdf",
         "email2@test.com.pdf",
         "email3@test.com.pdf",
         "email4@test.com.pdf",
         "email5@test.com.pdf"
       ]
     }
     ```
   - To set and get not sent files in order to send them later, this endpoint has a get (get files) and post (set files) method:
     ```
     /finances/not-sent-files
     ```
     The POST method accepts as a parameters:
     ```json
     {
       "files": [
         "email1@test.com.pdf",
         "email2@test.com.pdf",
         "email3@test.com.pdf"
       ]
     }
     ```
   - To get a excel report of the drivers payments, this endpoint has a get method:
     ```
     /finances/excel-driver-payment
     ```
   - To register in the app, this endpoint has a post method:
     ```
     /auth/register
     ```
     The POST method accepts as a parameters:
     ```json
     {
       "email": "email@test.com",
       "password": "pass",
       "firstName": "Foo",
       "lastName": "Bar"
     }
     ```
   - To login in the app, this endpoint has a post method:
     ```
     /auth/login
     ```
     The POST method accepts as a parameters:
     ```json
     {
       "email": "email@test.com",
       "password": "pass"
     }
     ```
   - To authenticate a user in the app, this endpoint has a get method:
     ```
     /auth/whoami
     ```
     This endpoint accepts a `accessToken` as a `authorization` header which has been generated when you registered or logged in.

## Notes

- The dates have to be sended in ISOString format.
