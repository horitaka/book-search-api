const GoogleBooks = require('./GoogleBooks')
const Calil = require('./Calil');

class Books {
  constructor() {
    this.SEARCH_TYPE_ISBN = 'SEARCH_TYPE_ISBN';
    this.SEARCH_TYPE_FREEWORD = 'SEARCH_TYPE_FREEWORD';
    this.googleBooks = new GoogleBooks();
    this.calil = new Calil();
  }

  async getBooks(keyword) {
    const bookResults = await this.googleBooks.searchBooks(keyword);
    return bookResults
  }

  async getBookInfoList(keyword, libraryIDList) {
    const isAmazonUrl = this.isAmazonUrl(keyword)
    let isbn = 0;
    if (isAmazonUrl) {
      isbn = this.extractIsbn(keyword);
    }

    const searchType = isAmazonUrl ? this.SEARCH_TYPE_ISBN : this.SEARCH_TYPE_FREEWORD;
    const searchQuery = isAmazonUrl ? isbn : keyword

    // GoogleBooksから書籍情報を取得する
    const bookInfoList = await this.googleBooks.searchBooks(searchQuery, searchType);

    // Calilから図書館の在庫情報を取得する
    const isbnList = this.getIsbn(bookInfoList);
    const calilBookStockList = await this.calil.searchBookStock(isbnList, libraryIDList);

    // 書籍情報に図書館の在庫情報をマージする
    const bookStockList = this.calil.makeBookStockInfoList(bookInfoList, calilBookStockList);
    return bookStockList;
  }

  isAmazonUrl(text) {
    const amazonUrl = 'https://www.amazon.co.jp'
    if (text.startsWith(amazonUrl)) {
      return true
    } else {
      return false;
    }
  }

  /*
  AmazonのURLのdp/の後ろがIDBNになっているようなので正規表現でこの部分の値を取り出す
  https://www.amazon.co.jp/xxxx/dp/4863542453/ref=tmm_pap_swatch_0?_encoding=UTF8&qid=&sr=
  https://www.amazon.co.jp/xxxx/dp/4863542453?ref=tmm_pap_swatch_0?_encoding=UTF8&qid=&sr=
  */
  extractIsbn(amazonUrl) {
    const startWith = 'dp/';
    const endWith = '[/?]'
    const regExp = `(?<=${startWith})[0-9]+(?=${endWith})`;
    const matches = amazonUrl.match(regExp);

    if (matches !== null) {
      return Number(matches[0]);
    } else {
      return -1
    }
  }

  getIsbn(bookInfoList) {
    const isbnList = bookInfoList.map(bookInfo => {
      return bookInfo.isbn
    });
    return isbnList;
  }

}

module.exports = Books;
