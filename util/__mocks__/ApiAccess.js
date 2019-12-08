// var axios = require('axios');

class ApiAccess {
  constructor() {
    this.init();
  }


  fetchData(url) {
    // const headers = {'Access-Control-Allow-Origin': '*'}
    return new Promise((resolve) => {

      switch (url) {
        case this.urlSuccessOnce:
          resolve(this.calilResponseSuccess);
          break;
        case this.urlWithSessionFirst:
          resolve(this.calilResponseWithSession)
          break;
        case this.urlWithSessionSecond:
          resolve(this.calilResponseWithSessionSuccess)
          break;
        case this.urlErrorFirst:
          resolve(this.calilResponseError);
          break;
        case this.urlErrorSecond:
          resolve(this.calilResponseError);
          break;
        default:
          resolve()
      }

    })
  }


  getCalilResponseSuccess() {
    return this.calilResponseSuccess;
  }

  // init() {
  //   const cailTest = require('../__tests__/Calil.test');
  //   console.log(cailTest)
  //   this.urlSuccessOnce = cailTest.urlSuccessOnce;
  //   this.calilResponseSuccess = cailTest.calilResponseSuccess
  // }

  init() {
    this.urlSuccessOnce = 'http://api.calil.jp/check?callback=no&appkey=1e337d58ad44c968c93dc772f684dc0a&format=json&isbn=9784798052588,4408555452&systemid=Tokyo_Adachi,Tokyo_Minato'

    this.urlWithSessionFirst = 'http://api.calil.jp/check?callback=no&appkey=1e337d58ad44c968c93dc772f684dc0a&format=json&isbn=9784798052588,4408555452&systemid=Tokyo_Adachi,Tokyo_Kita';
    this.urlWithSessionSecond = 'http://api.calil.jp/check?callback=no&appkey=1e337d58ad44c968c93dc772f684dc0a&format=json&session=c12da6248bdb0ad0e5c564b912ea6cec'

    this.urlErrorFirst = 'http://api.calil.jp/check?callback=no&appkey=1e337d58ad44c968c93dc772f684dc0a&format=json&isbn=9784798052588&systemid=Tokyo_Adachi'
    this.urlErrorSecond = 'http://api.calil.jp/check?callback=no&appkey=1e337d58ad44c968c93dc772f684dc0a&format=json&session=a12da6248bdb0ad0e5c564b912ea6abc'

    this.calilResponseSuccess = {
      session: "29aa118a123e97ec8cd349959082a5f4",
      books: {
        9784798052588: {
          Tokyo_Adachi: {
            status: "Cache",
            reserveurl: "",
            libkey: {}
          },
          Tokyo_Minato: {
            status: "Cache",
            reserveurl: "",
            libkey: {}
          }
        },
        4408555452: {
          Tokyo_Adachi: {
            status: "Cache",
            reserveurl: "https://www.lib.adachi.tokyo.jp/licsxp-opac/WOpacTifTilListToTifTilDetailAction.do?tilcod=1001111258447",
            libkey: {
              花畑: "貸出中",
              やよい: "貸出中",
              佐野: "貸出中",
              中央: "貸出中",
              興本: "貸出中"
            }
          },
          Tokyo_Minato: {
            status: "Cache",
            reserveurl: "https://www.lib.city.minato.tokyo.jp/licsxp-opac/WOpacTifTilListToTifTilDetailAction.do?tilcod=1000001867823",
            libkey: {
              みなと図書: "貸出中",
              青山生涯: "貸出中"
            }
          }
        }
      },
      continue: 0
    }

    this.calilResponseWithSession = {
      session: "c12da6248bdb0ad0e5c564b912ea6cec",
      books: {
        9784798052588: {
          Tokyo_Adachi: {
            status: "Running",
            reserveurl: ""
          },
          Tokyo_Kita: {
            status: "Running",
            reserveurl: ""
          }
        }
      },
      continue: 1
    }

    this.calilResponseWithSessionSuccess = {
      session: "c12da6248bdb0ad0e5c564b912ea6cec",
      books: {
        9784798052588: {
          Tokyo_Adachi: {
            status: "OK",
            reserveurl: "",
            libkey: {}
          },
          Tokyo_Kita: {
            status: "OK",
            reserveurl: "https://www.library.city.kita.tokyo.jp/opac/OPP1500?SELDATA=TOSHO&SSNO=3-0002838076",
            libkey: {
              中央館: "貸出中",
              浮間: "貸出中"
            }
          }
        },
        4408555452: {
          Tokyo_Adachi: {
            status: "OK",
            reserveurl: "https://www.lib.adachi.tokyo.jp/licsxp-opac/WOpacTifTilListToTifTilDetailAction.do?tilcod=1001111258447",
            libkey: {
              花畑: "貸出中",
              やよい: "貸出中",
              佐野: "貸出中",
              中央: "貸出中",
              興本: "貸出中"
            }
          },
          Tokyo_Kita: {
            status: "OK",
            reserveurl: "https://www.library.city.kita.tokyo.jp/opac/OPP1500?SELDATA=TOSHO&SSNO=3-0003041563",
            libkey: {
              東十条: "貸出中",
              滝西: "貸出中",
              分室: "予約中",
              滝野川: "予約中"
            }
          }
        }
      },
      continue: 0
    }

    this.calilResponseError = {
      session: "a12da6248bdb0ad0e5c564b912ea6abc",
      books: {
        9784798052588: {
          Tokyo_Adachi: {
            status: "Running",
            reserveurl: ""
          },
          Tokyo_Kita: {
            status: "Running",
            reserveurl: ""
          }
        }
      },
      continue: 1
    }

  }

}

module.exports = ApiAccess;
