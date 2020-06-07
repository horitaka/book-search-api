const Boom = require('@hapi/boom');

const BookStock = require('../models/BookStock');
const bookStock = new BookStock();

exports.getBooksStocks = async (req, res, next) => {
  const isbns = req.query.isbns;
  const libraryIds = req.query.libraryIds;

  if (!libraryIds) {
    next(Boom.badRequest('libraryIds is undefined or not set'))
    return
  }

  try {
    const booksStocks = await bookStock.getBooksStocks(isbns, libraryIds)
    res.json(booksStocks);
  } catch (error) {
    next(error)
  }

}