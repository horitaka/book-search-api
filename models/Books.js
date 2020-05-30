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

  async getBooksStocks(isbns, libraryIds) {
    return await this.calil.searchBookStock(isbns, libraryIds);
  }

  convertBooksStocksFormat(booksStocks) {
    const isbns = Object.keys(booksStocks)

    let convertedBooksStocks = {}
    isbns.forEach(isbn => {
      if (isbn !== '0') {
        convertedBooksStocks[isbn] = this.convertStocksObjectToArray(booksStocks[isbn])
      }
    })

    return convertedBooksStocks
  }

  convertStocksObjectToArray(stocks) {
    const libraryIds = Object.keys(stocks)
    const stocksArray = libraryIds.map(libraryId => {
      return {
        libraryId: libraryId,
        bookRentalUrl: stocks[libraryId].reserveurl || '',
        isOwned: this.checkIsOwned(stocks[libraryId].libkey),
        canBeRend: this.checkCanBeRend(stocks[libraryId].libkey)
      }
    })
    return stocksArray
  }

  checkIsOwned(calilLibkeys) {
    /*
    calilLibkeys: {
      東十条: "貸出可",
      滝西: "貸出中",
      分室: "予約中",
      滝野川: "予約中"
    }
    所有していない場合は空の値となるのでその場合はfalseを返す
    */

    if (!calilLibkeys) {
      return false
    }

    const keys = Object.keys(calilLibkeys)
    if (keys.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  checkCanBeRend(calilLibkeys) {
    /*
    calilLibkeys: {
      東十条: "貸出可",
      滝西: "貸出中",
      分室: "予約中",
      滝野川: "予約中"
    }
    '貸出可'が1つでも含まれる場合はtrueを返す
    */

    if (!calilLibkeys) {
      return false
    }

    const keys = Object.keys(calilLibkeys);
    const canBeRend = keys.some(key => {
      return calilLibkeys[key] === '貸出可'
    })
    return canBeRend;
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
