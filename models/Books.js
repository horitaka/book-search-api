class Books {
  constructor() {
    const GoogleBooks = require('../util/GoogleBooks')
    this.googleBooks = new GoogleBooks();
    this.books = []
  }

  async getBooks(keyword) {
    this.books = await this.googleBooks.searchBooks(keyword);
    return this.books
  }

}

module.exports = Books;
