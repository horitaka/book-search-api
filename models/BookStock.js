class BookStock {
  constructor() {
    const Calil = require('../util/Calil');
    this.calil = new Calil()
    this.booksStocks = []
  }

  async getBooksStocks(isbns, libraryIds) {
    this.booksStocks = await this.calil.searchBookStock(isbns, libraryIds);
    return this.booksStocks
  }

}

module.exports = BookStock