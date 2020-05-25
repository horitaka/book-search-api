const Calil = require('../models/Calil');
const calil = new Calil();

exports.getLibraries = (req, res) => {
  const prefecture = req.query.prefecture;
  console.log(prefecture)
  calil.searchLibrary(prefecture)
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      console.warn(error);
      res.json([])
      // res.send('図書館の情報が取得できませんでした')
    })
}
