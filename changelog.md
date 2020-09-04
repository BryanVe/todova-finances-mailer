# Changelog

## 4.0.2

### Updated

- Upgraded bl from `2.2.0` to `2.2.1` in `/server` (Dependabot alert).

## 4.0.1

### Fixed

- The loading status of synchronize button has been fixed.

## 4.0.0

### Added

- Seven new endpoints:

  - To get one file (GET): `/finances/pdf-files/:file`.
  - To send files (POST): `/finances/pdf-files/send`.
  - To get and set not sent files (GET and POST): `/finances/not-sent-files`.
  - To get a report of the drivers payments (GET): `/finances/excel-driver-payment`.
  - To register in the app (POST): `/auth/register`.
  - To login in the app (POST): `/auth/login`.
  - To authenticate the user in the app (GET): `/auth/whoami`.

- The module to login and register is ready to be used, you can login if you have an account created, otherwise you can register in the app. Also the app authenticate the user if they are logged in.

- The module to visualize the not sent files is ready to be used, if you set a reminder, in this module will be all them.

### Updated

- The endpoint `/finances/generate/pdf-files` renamed to `/finances/pdf-files/generate` and `/finances/generate/pdf-files` to `/finances/pdf-files`.

- The module to generate reports of the drivers (PDFs) is ready to be used. You can download the reports, send them to their respective driver and set a reminder in order to send later.

- The internal routes are private, if you want to access them, first you have to register or login.

## 3.2.0

### Added

- Two new endpoints, one allows us to generate pdf files of drivers, this endpoint has a post method and we need to pass `beginDate`, `endDate` and `payDate` in order to generate the pdf files. The second one allows us to get all the pdf files generated previously, this endpoint just has a get method.

- The generate button in the app ready works. We just have to set the `beginDate`, `endDate` and `payDate`.

## 3.1.0a

### Hotfix

- Dependencies have been upgraded (Dependabot alerts).

## 3.1.0

### Added

- A bash script that allow us to synchronize our database local with the database remote.
- Now we can emit events with [`socket.io`](https://socket.io/) in order to broadcast the bash file execution to our app.
- The module for synchronize the database is ready to be used.

## 3.0.0

### Updated

- All the endpoints have been updated to a get method and receive the date ranges using query params.

### Added

- A `jsconfig.json` file that allows us to access to the paths from other files more easily.
- A topbar and sidebar in order to navigate through the different modules.
- A basic login form in order to access to the dashboard.
- The module for downloading CSV files is ready to be used.

## 2.0.0

### Added

- One endpoint in order to indicate the server is running.
- Five endpoints in order to download csv files from customers, drivers, enterprises, shipments and driverSchedules.

## 1.0.0

- Initialize project.
