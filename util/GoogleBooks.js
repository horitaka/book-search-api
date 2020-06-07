const _ = require('lodash');

const axios = require('./AxiosWrapper');
const config = require('../config')

class GoogleBooks {
  constructor() {
    this.axios = new axios();
  }

  searchBooks(searchKeyword, page) {
    const MAX_RESULTS_PER_SEARCH = 5;

    const params = {
      filter: 'partial',
      maxResults: MAX_RESULTS_PER_SEARCH,
      printType: 'books',
      q: searchKeyword,
      startIndex: MAX_RESULTS_PER_SEARCH * page
    }
    const googleBooksApiUrl = config.googleBooks.apiUrl + '/v1/volumes'

    // let searchQuery = '';
    // switch (searchType) {
    //   case 'SEARCH_TYPE_ISBN':
    //     searchQuery = `q=+isbn:${searchKeyword}`
    //     break;
    //   default:
    //     searchQuery = `q=${searchKeyword}`
    //     break;
    // }

    return new Promise((resolve, reject) => {
      this.axios.fetchData(googleBooksApiUrl, params)
        .then(googleBookInfoList => {
          const formattedBookInfoList = this.convertBookInfoListFormat(googleBookInfoList)
          resolve(formattedBookInfoList);
        })
        .catch(error => {
          reject(error);
        })
    })
  }

  convertBookInfoListFormat(googleBookInfoList) {
    const bookInfoList = googleBookInfoList.items.map((bookInfo) => {
      const isbn13Object = _.get(bookInfo, 'volumeInfo.industryIdentifiers', []).find(isbns => isbns.type === 'ISBN_13')
      const isbn10Object = _.get(bookInfo, 'volumeInfo.industryIdentifiers', []).find(isbns => isbns.type === 'ISBN_10')

      let isbn;
      if (isbn13Object) {
        isbn = Number(isbn13Object.identifier)
      } else if (isbn10Object) {
        isbn = Number(isbn10Object.identifier)
      } else {
        isbn = 0;
      }

      const imageUrl = (bookInfo.volumeInfo.imageLinks && bookInfo.volumeInfo.imageLinks.thumbnail)
        ? bookInfo.volumeInfo.imageLinks.thumbnail
        : ''

      return {
        imageUrl: imageUrl,
        title: bookInfo.volumeInfo.title,
        authors: bookInfo.volumeInfo.authors,
        isbn: isbn,
      }
    })

    return bookInfoList;
  }
}

module.exports = GoogleBooks;
