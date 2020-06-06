const AxiosWrapper = require('../util/AxiosWrapper');
const config = require('../config')
const calilLibraries = require('../constants/calil-libraries')

class Calil {
  constructor() {
    this.axios = new AxiosWrapper();
    this.MAX_RETRY_NUMBER = 10;
  }

  async searchBookStock(isbns, libraryIds) {
    const calilBooksStocks = await this.searchBookStockWithRetry(isbns, libraryIds)
    const booksStocks = this.convertBooksStocksFormat(calilBooksStocks)
    return booksStocks
  }

  async searchBookStockWithRetry(isbns, libraryIds) {
    const params = {
      callback: 'no',
      appkey: config.calil.apiKey,
      format: 'json',
      isbn: isbns.join(','),
      systemid: libraryIds.join(','),
    }
    const bookStockApiUrl = config.calil.apiUrl + '/check'

    const calilBoolResponse = await this.axios.fetchData(bookStockApiUrl, params);
    if (calilBoolResponse.continue === 0) {
      const calilBooks = calilBoolResponse.books
      return calilBooks;
    } else {
      const calilBooks = await this.retrySearchBookStock(calilBoolResponse.session, this.MAX_RETRY_NUMBER)
      return calilBooks;
    }

  }

  async retrySearchBookStock(session, numOfRetries) {
    const params = {
      callback: 'no',
      appkey: config.calil.apiKey,
      format: 'json',
      session: session,
    }
    const retryApiUrl = config.calil.apiUrl + '/check'

    for (let i = 0; i < numOfRetries; i++) {
      const calilBoolResponse = await this.axios.fetchData(retryApiUrl, params);
      if (calilBoolResponse.continue === 0) {
        return calilBoolResponse.books;
      }
      await this.sleep(2000);
    }

    console.warn('Calil-retrySearchBookStock: Exceeded max retry attempts')
    return [];
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
      if (calilBookStockList === undefined || calilBookStockList.length === 0) {
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


  async searchLibrary(prefecture) {
    const api = new AxiosWrapper();
    const params = {
      appkey: config.calil.apiKey,
      format: 'json',
      callback: '',
      pref: prefecture,
    }
    const libraryApiUrl = config.calil.apiUrl + '/library'

    const calilLibraryList = await api.fetchData(libraryApiUrl, params)
    const libraryList = this.convertLibraryDataFormat(calilLibraryList);
    return libraryList
  }

  convertLibraryDataFormat(calilLibraryList) {
    const self = this;

    if (!calilLibraryList) {
      return [];
    }

    // 公共の図書館のみを抽出
    const publicLibraryList = calilLibraryList.filter(function (library) {
      return library.category === 'SMALL' || library.category === 'MEDIUM' || library.category === 'LARGE';
    })

    // フォーマットの変換
    const formattedLibraryList = publicLibraryList.map(function (library) {
      return {
        libraryId: library.systemid,
        libraryName: library.systemname,
        prefecture: library.pref,
        city: library.city,
        librarySiteUrl: library.url_pc,
        branchName: library.short
      }
    })

    // 同じlibraryNameの図書館を一つのオブジェクトにまとめる
    let uniqueLibraryList = [];
    formattedLibraryList.forEach(function (library) {

      // libraryIdが同じ場合はindexを取得
      var indexOfDuplicateLibrary = -1;
      for (var i = 0; i < uniqueLibraryList.length; i++) {
        if (uniqueLibraryList[i].libraryId === library.libraryId) {
          indexOfDuplicateLibrary = i;
          break;
        }
      }

      // 同じlibraryIdがすでにuniqueLibraryListに存在する場合はbranchesにbranchNameを追加
      // 存在しない場合はuniqueLibraryListに新規にオブジェクトを追加
      if (indexOfDuplicateLibrary > -1) {
        uniqueLibraryList[i].branches.push(library.branchName)
      } else {
        var tmpLibrary = {
          libraryId: library.libraryId,
          libraryName: self.getLibraryName(library.prefecture, library.libraryId, library.libraryName) || library.libraryName,
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

  getLibraryName(prefecture, libraryId, libraryName) {
    if (calilLibraries[prefecture] && calilLibraries[prefecture][libraryId].name) {
      return calilLibraries[prefecture][libraryId].name
    }
    if (libraryName.endsWith('図書館')) {
      return libraryName
    }

    return libraryName.replace(prefecture, '') + '図書館'
  }

}

module.exports = Calil;
