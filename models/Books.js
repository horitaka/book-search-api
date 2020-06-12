class Books {
  constructor() {
    const GoogleBooks = require('../util/GoogleBooks')
    this.googleBooks = new GoogleBooks();
    const RakutenBooks = require('../util/RakutenBooks');
    this.rakutenBooks = new RakutenBooks();
    this.books = []
  }

  async getBooks(keyword, page) {
    /* GoogleBooksで検索する場合 */
    // const googleBooksItems = await this.googleBooks.searchBooks(keyword, page);

    // isbnを取得する
    // const isbns = googleBooksItems.map(book => book.isbn)

    // 楽天booksからアフィリエイトリンクを取得する
    // const rakutenAffiliateLinks = await this.rakutenBooks.getAffiliateLinks(isbns)

    // GoogleBooksと楽天アフィリエイトをmergeする
    // this.books = this.mergeBooks(googleBooksItems, rakutenAffiliateLinks)
    /* GoogleBooksで検索する場合 */

    const rakutenBooksItems = await this.rakutenBooks.searchBooks({ title: keyword, page: page })

    return rakutenBooksItems
  }

  mergeBooks(googleBooksItems, rakutenBooksAffiliateLinks) {
    const mergedBooks = googleBooksItems.map(item => {
      let rakutenAffiliateUrl = ''
      if (item.isbn && item.isbn !== 0 && rakutenBooksAffiliateLinks[item.isbn]) {
        rakutenAffiliateUrl = rakutenBooksAffiliateLinks[item.isbn]['affiliateUrl'];
      }
      return {
        ...item,
        rakutenAffiliateUrl: rakutenAffiliateUrl,
      }
    })

    return mergedBooks
  }

}

module.exports = Books;
