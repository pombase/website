import {Request, Response} from "express";

let express = require('express');
let router = express.Router();


router.get('/gene/by_termid/:termid', function(req: Request, res: Response, next: Function) {
  let qh = res.locals.queryHandler;
  res.json({ matches: qh.genesByTermid(req.params['termid']) });
});

router.get('/term/by_name/fuzzy/:cvName/:queryText',
           function(req: Request, res: Response, next: Function) {
             let qh = res.locals.queryHandler;
             let retVal = qh.genesByTermNameFuzzy(req.params['cvName'],
                                                  req.params['queryText']);
             res.json(retVal);
           });

router.post('/qb/execute', function(req: Request, res: Response, next: Function) {
  let qh = res.locals.queryHandler;
  let query = req.body.query;
  res.json(qh.geneQuery(query));
});

module.exports = router;
