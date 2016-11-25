import {Request, Response} from "express";

let express = require('express');
let router = express.Router();


router.get('/gene/by_termid/:termid', function(req: Request, res: Response, next: Function) {
  let searchMaps = res.locals.searchMaps;
  res.json({ matches: searchMaps.termid_genes[req.params['termid']] });
});

router.get('/term/by_name/exact/:termName', function(req: Request, res: Response, next: Function) {
  let searchMaps = res.locals.searchMaps;
  res.json({ matches: searchMaps.term_name_genes[req.params['termName']] });
});

router.get('/term/by_name/fuzzy/:cvName/:queryText',
           function(req: Request, res: Response, next: Function) {
  let indices = res.locals.indices;
  let termsByID = res.locals.termsByID;

  let index = indices[req.params['cvName']];

  let matches = index.search(req.params['queryText']).slice(0, 20);

  let retVal = matches.map(
    (match) => {
      let term = termsByID[match.ref];
      return {
        termid: term.termid,
        name: term.name,
      }
    });

  res.json(retVal);
});

module.exports = router;
