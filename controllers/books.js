const Books = require('../models/Books');
const books = new Books();


exports.getBooks = async (req, res) => {
  const keyword = req.query.keyword;
  const page = req.query.page;

  try {
    const bookResult = await books.getBooks(keyword, page)
    // Todo:ステータスコードを見て200以外の場合はbooms objectを作ってnextを実行する
    res.json(bookResult);
  } catch (error) {
    // Todo:ステータスコードを500にしてbooms objectを作ってnextを実行する
    console.warn(error);
    res.json([]);
  }

}