import { Request, Response } from "express";
import { text, ParsedAsText } from 'body-parser';
import { GeneQuery } from "../common/pombase-query";

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

router.post('/qb/execute', function(req: Request & ParsedAsText, res: Response, next: Function) {
  let qh = res.locals.queryHandler;
  let query = new GeneQuery(JSON.parse(req.body));
  res.json(qh.geneQuery(query));
});

module.exports = router;
