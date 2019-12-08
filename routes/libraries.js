var express = require('express');
var router = express.Router();

const Calil = require('../util/Calil');
const calil = new Calil();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const prefecture = req.query.prefecture;
  console.log(prefecture)
  calil.searchLibrary(prefecture)
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      console.warn(error);
      res.json([])
      // res.send('図書館の情報が取得できませんでした')
    })

  // res.json({
  //   message:"Hello,world"
  // });
  // res.send(prefecture);

});

module.exports = router;
