const _ = require('lodash');

const AxiosWrapper = require('../util/AxiosWrapper');
const config = require('../config')

class Calil {
  constructor() {
    this.axios = new AxiosWrapper();
    this.MAX_RETRY_NUMBER = 10;
  }

  async searchBookStock(isbns, libraryIds) {
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

  // checkIsOwned(calilLibkeys) {
  //   /*
  //   calilLibkeys: {
  //     東十条: "貸出可",
  //     滝西: "貸出中",
  //     分室: "予約中",
  //     滝野川: "予約中"
  //   }
  //   所有していない場合は空の値となるのでその場合はfalseを返す
  //   */
  //   const keys = Object.keys(calilLibkeys)
  //   if (keys.length === 0) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  // checkCanBeRend(calilLibkeys) {
  //   /*
  //   calilLibkeys: {
  //     東十条: "貸出可",
  //     滝西: "貸出中",
  //     分室: "予約中",
  //     滝野川: "予約中"
  //   }
  //   '貸出可'が1つでも含まれる場合はtrueを返す
  //   */
  //   const keys = Object.keys(calilLibkeys);
  //   const canBeRend = keys.some(key => {
  //     return calilLibkeys[key] === '貸出可'
  //   })
  //   return canBeRend;
  // }

  async searchLibrary(prefecture) {
    const api = new AxiosWrapper();
    const params = {
      appkey: config.calil.apiKey,
      format: 'json',
      callback: '',
      pref: prefecture,
    }
    const libraryApiUrl = config.calil.apiUrl + '/library'

    try {
      const calilLibraryList = await api.fetchData(libraryApiUrl, params)
      const libraryList = this.convertLibraryDataFormat(calilLibraryList);
      return libraryList
    } catch (error) {
      throw new Error(error)
    }
  }

  convertLibraryDataFormat(calilLibraryList) {
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

module.exports = Calil;
