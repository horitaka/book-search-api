const Library = require('../models/Library');
const library = new Library();

exports.getLibraries = async (req, res) => {
  const prefecture = req.query.prefecture;

  try {
    const response = await library.getLibraries(prefecture);
    res.json(response);
  } catch (error) {
    console.warn(error);
    res.json([])
    // res.send('図書館の情報が取得できませんでした')
  }
}
