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
      elements: 'title,isbn,itemUrl,affiliateUrl',
      formatVersion: 2,
    }
    const rakutenBooksApiUrl = config.rakutenBooks.apiUrl + '/services/api/BooksBook/Search/20170404'
    const result = await this.axios.fetchData(rakutenBooksApiUrl, requestParams);

    return result;
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

}

module.exports = RakutenBooks;
