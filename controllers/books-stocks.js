const Books = require('../models/Books');
const books = new Books();

exports.getBooksStocks = async (req, res) => {
  const isbns = req.query.isbns;
  const libraryIds = req.query.libraryIds;

  try {
    const booksStocks = await books.getBooksStocks(isbns, libraryIds)
    res.json(booksStocks);
  } catch (error) {
    console.warn(error);
    res.json([]);
  }

}