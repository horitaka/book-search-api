class Books {
  constructor() {
    const GoogleBooks = require('../util/GoogleBooks')
    this.googleBooks = new GoogleBooks();
    this.books = []
  }

  async getBooks(keyword, page) {
    this.books = await this.googleBooks.searchBooks(keyword, page);
    return this.books
  }

}

module.exports = Books;
