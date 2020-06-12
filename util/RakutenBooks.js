const axios = require('./AxiosWrapper');
const config = require('../config')

class RakutenBooks {
  constructor() {
    this.axios = new axios();
  }

  async searchBooks(params) {
    const requestParams = {
      ...params,
      applicationId: config.rakutenBooks.appId,
      affiliateId: config.rakutenBooks.affiliateId,
      elements: 'title,author,isbn,itemUrl,largeImageUrl,affiliateUrl',
      formatVersion: 2,
      hits: 5,
    }
    const rakutenBooksApiUrl = config.rakutenBooks.apiUrl + '/services/api/BooksBook/Search/20170404'
    const response = await this.axios.fetchData(rakutenBooksApiUrl, requestParams);
    const bookItems = this.convertBookItemsFormat(response.Items)

    return bookItems;
  }

  async getAffiliateLinks(isbns) {
    let books = {}
    for (let i = 0; i < isbns.length; i++) {
      if (isbns[i] && isbns[i] !== 0) {
        const result = await this.searchBooks({ isbn: isbns[i] })
        const affiliateUrl = (result && result.Items && result.Items[0].affiliateUrl) || ''
        books[isbns[i]] = { isbn: isbns[i], affiliateUrl: affiliateUrl }
      }
    }

    return books;
  }

  convertBookItemsFormat(bookItems) {
    const cenvertedItems = bookItems.map(item => {
      return {
        title: item.title || '',
        authors: item.author ? item.author.split('/') : [],
        isbn: parseInt(item.isbn) || 0,
        imageUrl: item.largeImageUrl || '',
        rakutenAffiliateUrl: item.affiliateUrl || '',
      }
    })

    return cenvertedItems
  }

}

module.exports = RakutenBooks;
