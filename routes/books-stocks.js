const express = require('express');
const router = express.Router();

const booksStocksController = require('../controllers/books-stocks')

router.get('/', booksStocksController.getBooksStocks)

module.exports = router;
