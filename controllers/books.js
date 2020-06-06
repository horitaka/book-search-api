const Boom = require('@hapi/boom');

const Books = require('../models/Books');
const books = new Books();


exports.getBooks = async (req, res, next) => {
  const keyword = req.query.keyword;
  const page = req.query.page || 0;

  if (!keyword) {
    next(Boom.badRequest('keyword is undefined or not set'))
    return
  }

  try {
    const bookResult = await books.getBooks(keyword, page)
    res.json(bookResult);
  } catch (error) {
    next(error)
  }

}