import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";


if (process.argv.length != 3) {
  console.log("needs one argument");
  process.exit(1);
}

let directory = process.argv[2];


var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = normalizePort(process.env.POMBASE_API_PORT || '4001');

var routes = require('./routes/index');
app.use('/', routes);

app.listen(port);
console.log("listening on port: " + port);


function normalizePort(val: string): string | number | boolean {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

