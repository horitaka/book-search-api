const Books = require('../models/Books');
const books = new Books();


exports.getBooks = async (req, res) => {
  const keyword = req.query.keyword;

  try {
    const bookResult = await books.getBooks(keyword)
    res.json(bookResult);
  } catch (error) {
    console.warn(error);
    res.json([]);
  }

}