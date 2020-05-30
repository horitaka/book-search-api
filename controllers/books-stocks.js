const BookStock = require('../models/BookStock');
const bookStock = new BookStock();

exports.getBooksStocks = async (req, res) => {
  const isbns = req.query.isbns;
  const libraryIds = req.query.libraryIds;

  try {
    const booksStocks = await bookStock.getBooksStocks(isbns, libraryIds)
    res.json(booksStocks);
  } catch (error) {
    console.warn(error);
    res.json([]);
  }

}