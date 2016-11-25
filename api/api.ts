import * as bodyParser from "body-parser";
import * as express from "express";
import {Request, Response} from "express";
import * as path from "path";

import fs = require('fs');

if (process.argv.length != 3) {
  console.log("needs one argument");
  process.exit(1);
}

let directory = process.argv[2];

let searchMapsJSON = fs.readFileSync(directory + "/search_api_maps.json", "utf8");
let searchMaps = JSON.parse(searchMapsJSON);

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let port = normalizePort(process.env.POMBASE_API_PORT || '4001');

// pass maps to route handlers
app.use(function(req: Request, res: Response, next: Function) {
  res.locals.searchMaps = searchMaps;
  next();
});

let routes = require('./routes/index');
app.use('/', routes);

app.listen(port);
console.log("listening on port: " + port);


function normalizePort(val: string): string | number | boolean {
  let port = parseInt(val, 10);

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

