const Library = require('../models/Library');
const library = new Library();

exports.getLibraries = async (req, res, next) => {
  const prefecture = req.query.prefecture;

  if (!prefecture) {
    next(Boom.badRequest('prefecture is undefined or not set'))
    return
  }

  try {
    const response = await library.getLibraries(prefecture);
    res.json(response);
  } catch (error) {
    next(error)
  }
}
