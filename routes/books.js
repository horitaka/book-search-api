var express = require('express');
var router = express.Router();

const BookFunction = require('../util/BookFunction');
const bookFunction = new BookFunction();

/* GET users listing. */
router.get('/', function(req, res) {
  const keyword = req.query.keyword;
  const libraryIDList = req.query.libraryIDList.split(',');
  console.log(keyword);
  console.log(libraryIDList)

  bookFunction.getBookInfoList(keyword, libraryIDList)
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      console.warn(error);
      res.json([])
    })

});

module.exports = router;
