import {Request, Response} from "express";

let express = require('express');
let router = express.Router();


router.get('/gene/by_termid/:termid', function(req: Request, res: Response, next: Function) {
  let searchMaps = res.locals.searchMaps;
  res.json({ matches: searchMaps.termid_genes[req.params['termid']] });
});

router.get('/gene/by_term_name_exact/:termName', function(req: Request, res: Response, next: Function) {
  let searchMaps = res.locals.searchMaps;
  res.json({ matches: searchMaps.term_name_genes[req.params['termName']] });
});

router.get('/gene/by_term_name_fuzzy/:termName', function(req: Request, res: Response, next: Function) {
  let searchMaps = res.locals.searchMaps;
  let matches: any = { };
  for (let thisTermName of Object.keys(searchMaps.term_name_genes)) {
    if (thisTermName.includes(req.params['termName'])) {
      matches[thisTermName] = searchMaps.term_name_genes[thisTermName];
    }
  }
  res.json({ matches: matches });
});

module.exports = router;
