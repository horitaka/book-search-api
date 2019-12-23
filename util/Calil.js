const _ = require('lodash');
const ApiAccess = require('./ApiAccess');

class CalilApiAccess {
  constructor() {
    this.api = new ApiAccess();
    this.MAX_RETRY_NUMBER = 10;
  }

  async searchBookStock(isbnList, libraryList) {
    // console.log('Calil-searchBookStock: ' + isbnList)
    // console.log('Calil-searchBookStock: ' + libraryList)

    const baseUrl = 'http://api.calil.jp/check?callback=no&appkey=1e337d58ad44c968c93dc772f684dc0a&format=json';
    const isbnQuery = 'isbn=' + isbnList.join(',');
    const libraryQuery = 'systemid=' + libraryList.join(',')
    const calilBookUrl = baseUrl + '&' + isbnQuery + '&' + libraryQuery;

    const calilBoolResponse = await this.api.fetchData(calilBookUrl);
    if (calilBoolResponse.continue === 0) {
      const calilBooks = calilBoolResponse.books
      return calilBooks;
    } else {
      const calilBooks = await this.retrySearchBookStock(calilBoolResponse.session, this.MAX_RETRY_NUMBER)
      return calilBooks;
    }

  }

  async retrySearchBookStock(session, numOfRetries) {
    const baseUrl = 'http://api.calil.jp/check?callback=no&appkey=1e337d58ad44c968c93dc772f684dc0a&format=json';
    const sessionQuery = 'session=' + session;
    const calilRetryUrl = baseUrl + '&' + sessionQuery;

    for(let i=0; i<numOfRetries; i++) {
      const calilBoolResponse = await this.api.fetchData(calilRetryUrl);
      if (calilBoolResponse.continue === 0) {
        return calilBoolResponse.books;
      }
      await this.sleep(2000);
    }

    console.warn('Calil-retrySearchBookStock: Exceeded max retry attempts')
    return [];
  }

  sleep(msec) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, msec)
    })
  }

  makeBookStockInfoList(bookInfoList, calilBookStockList) {
    const bookStockList = bookInfoList.map(bookInfo => {
      const stockInfo = calilBookStockList[bookInfo.isbn];
      // const stockInfo = _.get(calilBookStockList[bookInfo], 'isbn', [])

      let stockByLibrary;
      if(calilBookStockList === undefined || calilBookStockList.length === 0) {
        stockByLibrary = [];
      } else {
        // console.log(stockInfo)
        const libraryIDList = Object.keys(stockInfo);
        stockByLibrary = libraryIDList.map(libraryID => {
          return {
            libraryID: libraryID,
            bookRentalUrl: stockInfo[libraryID].reserveurl,
            isOwned: this.checkIsOwned(stockInfo[libraryID].libkey),
            canBeRend: this.checkCanBeRend(stockInfo[libraryID].libkey)
          }
        })
      }

      return {
        ...bookInfo,
        stockByLibrary: stockByLibrary
      }
    })

    return bookStockList;

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
    const keys = Object.keys(calilLibkeys)
    if(keys.length === 0) {
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
    const keys = Object.keys(calilLibkeys);
    const canBeRend = keys.some(key => {
      return calilLibkeys[key] === '貸出可'
    })
    return canBeRend;
  }

  searchLibrary(prefecture) {
    const api = new ApiAccess();
    const calilLibraryURL = 'http://api.calil.jp/library?appkey=1e337d58ad44c968c93dc772f684dc0a&format=json&callback=&pref=' + encodeURIComponent(prefecture);
    // const calilLibraryURL = 'http://api.calil.jp/library?appkey=1e337d58ad44c968c93dc772f684dc0a&format=json&callback=&geocode=136.7163027,35.390516&limit=10';

    return new Promise((resolve, reject) => {
      api.fetchData(calilLibraryURL)
        .then((calilLibraryList) => {
          const libraryList = this.convertLibraryDataFormat(calilLibraryList);
          resolve(libraryList)
        })
        .catch(error => {
          reject(error);
        })
    })
  }

  convertLibraryDataFormat(calilLibraryList) {
    if (!calilLibraryList) {
      return [];
    }

    // 公共の図書館のみを抽出
    const publicLibraryList = calilLibraryList.filter(function(library) {
      return library.category === 'SMALL' || library.category === 'MEDIUM' || library.category === 'LARGE';
    })

    // フォーマットの変換
    const formattedLibraryList = publicLibraryList.map(function(library) {
      return {
        libraryID: library.systemid,
        libraryName: library.systemname,
        prefecture: library.pref,
        city: library.city,
        librarySiteUrl: library.url_pc,
        branchName: library.short
      }
    })

    // 同じlibraryNameの図書館を一つのオブジェクトにまとめる
    let uniqueLibraryList = [];
    formattedLibraryList.forEach(function(library) {

      // libraryIDが同じ場合はindexを取得
      var indexOfDuplicateLibrary = -1;
      for (var i=0; i<uniqueLibraryList.length; i++) {
        if (uniqueLibraryList[i].libraryID === library.libraryID) {
          indexOfDuplicateLibrary = i;
          break;
        }
      }

      // 同じlibraryIDがすでにuniqueLibraryListに存在する場合はbranchesにbranchNameを追加
      // 存在しない場合はuniqueLibraryListに新規にオブジェクトを追加
      if (indexOfDuplicateLibrary > -1) {
        uniqueLibraryList[i].branches.push(library.branchName)
      } else {
        var tmpLibrary = {
          libraryID: library.libraryID,
          libraryName: library.libraryName,
          prefecture: library.prefecture,
          city: library.city,
          librarySiteUrl: library.librarySiteUrl,
          branches: [library.branchName]
        }
        uniqueLibraryList.push(tmpLibrary);
      }

    })

    return uniqueLibraryList;
  }

}

module.exports = CalilApiAccess;
