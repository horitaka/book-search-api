const Calil = require('../models/Calil');
const calil = new Calil();

exports.getLibraries = async (req, res) => {
  const prefecture = req.query.prefecture;

  try {
    const response = await calil.searchLibrary(prefecture);
    res.json(response);
  } catch (error) {
    console.warn(error);
    res.json([])
    // res.send('図書館の情報が取得できませんでした')
  }
}
