const Books = require('../models/Books');
const books = new Books();

exports.getBooksStocks = async (req, res) => {
  const isbns = req.query.isbns;
  const libraryIds = req.query.libraryIds;

  try {
    const booksStocks = await books.getBooksStocks(isbns, libraryIds)
    const convertedBooksStocks = books.convertBooksStocksFormat(booksStocks)
    res.json(convertedBooksStocks);
  } catch (error) {
    console.warn(error);
    res.json([]);
  }

}