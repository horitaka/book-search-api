const _ = require('lodash');
const ApiAccess = require('./ApiAccess');

class GoogleBooks {
  constructor() {
    this.api = new ApiAccess();
  }

  searchBooks(searchKeyword, searchType) {
    console.log('GoogleBooksApiAccess: ' + searchKeyword)
    console.log('GoogleBooksApiAccess: ' + searchType)

    const baseUrl = 'https://www.googleapis.com/books/v1/volumes?filter=partial&maxResults=10&printType=books'
    let searchQuery = '';
    switch (searchType) {
      case 'SEARCH_TYPE_ISBN':
        searchQuery = `q=+isbn:${searchKeyword}`
        break;
      default:
        searchQuery = `q=${searchKeyword}`
        break;
    }

    const googleUrl = baseUrl + '&' + searchQuery;

    return new Promise((resolve, reject) => {
      this.api.fetchData(googleUrl)
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

      return {
        imageUrl: bookInfo.volumeInfo.imageLinks.thumbnail,
        title: bookInfo.volumeInfo.title,
        authors: bookInfo.volumeInfo.authors,
        isbn: isbn,
      }
    })

    return bookInfoList;
  }


}

module.exports = GoogleBooks;
