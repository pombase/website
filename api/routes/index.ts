import {Request, Response} from "express";
var express = require('express');
var router = express.Router();

router.get('/v1/gene/:uniquename', function(req: Request, res: Response, next: Function) {
  res.json({ message: 'hooray! welcome to our api!' + req.params['uniquename'] });
});

module.exports = router;
