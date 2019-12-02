// import ApiAccess from './ApiAccess';
const ApiAccess = require('./ApiAccess');

class CalilApiAccess {

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
