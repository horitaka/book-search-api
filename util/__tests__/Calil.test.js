const Calil = require('../Calil');
const calil = new Calil();
jest.mock('../ApiAccess');

describe('Calil formattedLibraryList', function() {
  it('formattedLibraryList', () => {
    expect(calil.convertLibraryDataFormat(calilLibraryList)).toEqual(expectedLibraryList);
  });

  it('formattedLibraryList with blank data', () => {
    expect(calil.convertLibraryDataFormat([])).toEqual([]);
    expect(calil.convertLibraryDataFormat(undefined)).toEqual([]);
    expect(calil.convertLibraryDataFormat(null)).toEqual([]);
  })
})

describe('Calil makeBookStockInfoList', function() {
  it('makeBookStockInfoList', () => {
    expect(calil.makeBookStockInfoList(convertedBookInfoList, calilBookList)).toEqual(expectedBookList);
  });

  it('makeBookStockInfoList convertedBookInfoList or calilBookList blank', () => {
    const expectedBookListWithBlank = [{
      ...expectedBookList[0],
      stockByLibrary: [],
    }, {
      ...expectedBookList[1],
      stockByLibrary: [],
    }]
    expect(calil.makeBookStockInfoList(convertedBookInfoList, [])).toEqual(expectedBookListWithBlank);
    expect(calil.makeBookStockInfoList([], calilBookList)).toEqual([]);
  });
})

describe('Calil searchBookStock', () => {
  it('searchBookStock success in one attempt', async () => {
    const isbnList = [9784798052588, 4408555452];
    const libraryList = ['Tokyo_Adachi', 'Tokyo_Minato'];

    expect.assertions(1);
    const response = await calil.searchBookStock(isbnList, libraryList);
    expect(response).toEqual(calilResponseSuccess.books);
  })

  it('searchBookStock success with session attempt', async () => {
    const isbnList = [9784798052588, 4408555452];
    const libraryList = ['Tokyo_Adachi', 'Tokyo_Kita'];

    expect.assertions(1);
    const response = await calil.searchBookStock(isbnList, libraryList);
    expect(response).toEqual(calilResponseWithSessionSuccess.books);

  })

  it('searchBookStock error excceeded max retry attempt', async () => {
    const isbnList = [9784798052588];
    const libraryList = ['Tokyo_Adachi'];
    jest.setTimeout(10000);
    // expect.assertions(1);
    const response = await calil.searchBookStock(isbnList, libraryList);
    expect(response).toEqual([]);
  })
})

const urlSuccessOnce = 'http://api.calil.jp/check?callback=no&appkey=1e337d58ad44c968c93dc772f684dc0a&format=json&isbn=9784798052588,4408555452&systemid=Tokyo_Adachi,Tokyo_Minato';

module.exports.urlSuccessOnce = urlSuccessOnce;

const urlWithSessionFirst = 'http://api.calil.jp/check?callback=no&appkey=1e337d58ad44c968c93dc772f684dc0a&format=json&isbn=9784798052588,4408555452&systemid=Tokyo_Adachi,Tokyo_Kita';

exports.urlWithSessionFirst = urlWithSessionFirst;

const urlWithSessionSecond = 'http://api.calil.jp/check?callback=no&appkey=1e337d58ad44c968c93dc772f684dc0a&format=json&session=c12da6248bdb0ad0e5c564b912ea6cec'

exports.urlWithSessionSecond = urlWithSessionSecond;

const calilResponseSuccess = {
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

exports.calilResponseSuccess = calilResponseSuccess;

const calilResponseWithSession = {
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

exports.calilResponseWithSession = calilResponseWithSession;

const calilResponseWithSessionSuccess = {
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

exports.calilResponseWithSessionSuccess = calilResponseWithSessionSuccess;

const convertedBookInfoList = [{
    imageUrl: 'http://books.google.com/books/content?id=RDqQXFA42-kC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    title: 'Java Script',
    authors: ['デイビッドフラナガン'],
    isbn: 9784798052588
  }, {
    imageUrl: 'http://books.google.com/books/content?id=ZpyK8u2kndAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    title: 'よくわかるJavaScriptの教科書',
    authors: ['たにぐちまこと'],
    isbn: 4408555452
  }
];

const calilBookList = {
  9784798052588: {
    Tokyo_Adachi: {
      status: "Cache",
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
    Tokyo_Kita: {
      status: "OK",
      reserveurl: "https://www.library.city.kita.tokyo.jp/opac/OPP1500?SELDATA=TOSHO&SSNO=3-0003041563",
      libkey: {
        東十条: "貸出可",
        滝西: "貸出中",
        分室: "予約中",
        滝野川: "予約中"
      }
    }
  }
}

const expectedBookList = [{
    imageUrl: 'http://books.google.com/books/content?id=RDqQXFA42-kC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    title: 'Java Script',
    authors: ['デイビッドフラナガン'],
    isbn: 9784798052588,
    stockByLibrary:[{
      libraryID: 'Tokyo_Adachi',
      bookRentalUrl: '',
      isOwned: false,
      canBeRend: false,
    },{
      libraryID: 'Tokyo_Kita',
      bookRentalUrl: 'https://www.library.city.kita.tokyo.jp/opac/OPP1500?SELDATA=TOSHO&SSNO=3-0002838076',
      isOwned: true,
      canBeRend: false,
    }],
  }, {
    imageUrl: 'http://books.google.com/books/content?id=ZpyK8u2kndAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    title: 'よくわかるJavaScriptの教科書',
    authors: ['たにぐちまこと'],
    isbn: 4408555452,
    stockByLibrary:[{
      libraryID: 'Tokyo_Adachi',
      bookRentalUrl: 'https://www.lib.adachi.tokyo.jp/licsxp-opac/WOpacTifTilListToTifTilDetailAction.do?tilcod=1001111258447',
      isOwned: true,
      canBeRend: false,
    },{
      libraryID: 'Tokyo_Kita',
      bookRentalUrl: 'https://www.library.city.kita.tokyo.jp/opac/OPP1500?SELDATA=TOSHO&SSNO=3-0003041563',
      isOwned: true,
      canBeRend: true,
    }],
  }]


const expectedLibraryList = [{
  libraryID: 'Tokyo_Arakawa',
  libraryName: '東京都荒川区',
  prefecture: '東京都',
  city: '荒川区',
  librarySiteUrl: 'https://www.library.city.arakawa.tokyo.jp/',
  branches: ['汐入図書SS', '町屋図書館']
},{
  libraryID: 'Tokyo_Bunkyo',
  libraryName: '東京都文京区',
  prefecture: '東京都',
  city: '文京区',
  librarySiteUrl: 'http://www.lib.city.bunkyo.tokyo.jp/',
  branches: ['千石図書館', '小石川図書館']
},{
  libraryID: 'Tokyo_NDL',
  libraryName: '国立国会図書館',
  prefecture: '東京都',
  city: '台東区',
  librarySiteUrl: 'http://www.kodomo.go.jp/',
  branches: ['子ども図書館']
}]

const calilLibraryList = [{
  category: "SPECIAL",
  city: "三鷹市",
  short: "アジア・アフリカ図書館",
  libkey: "図書館",
  pref: "東京都",
  faid: "FA024818",
  geocode: "139.568627,35.675297",
  systemid: "Special_Aacf",
  address: "東京都三鷹市新川5-14-16",
  libid: "111839",
  tel: "0422-44-4640",
  systemname: "アジア・アフリカ図書館",
  isil: "JP-1005448",
  post: "181-0004",
  url_pc: "https://sv1.opac.jp/aop/cgi-bin/index.cgi?LibId=010ei7e",
  formal: "アジア・アフリカ図書館"
}, {
  category: "SMALL",
  city: "荒川区",
  short: "汐入図書SS",
  libkey: "汐入",
  pref: "東京都",
  faid: null,
  geocode: "139.807995,35.737658",
  systemid: "Tokyo_Arakawa",
  address: "東京都荒川区南千住8-12-5-114 べるぽーと汐入東館1F",
  libid: "103857",
  tel: "03-3807-8130",
  systemname: "東京都荒川区",
  isil: "JP-1006145",
  post: "116-0003",
  url_pc: "https://www.library.city.arakawa.tokyo.jp/",
  formal: "荒川区立汐入図書サービスステーション"
}, {
  category: "MEDIUM",
  city: "荒川区",
  short: "町屋図書館",
  libkey: "町屋",
  pref: "東京都",
  faid: null,
  geocode: "139.778965,35.751299",
  systemid: "Tokyo_Arakawa",
  address: "東京都荒川区町屋5-11-18",
  libid: "103858",
  tel: "03-3892-9821",
  systemname: "東京都荒川区",
  isil: "JP-1001066",
  post: "116-0001",
  url_pc: "https://www.library.city.arakawa.tokyo.jp/",
  formal: "荒川区立町屋図書館"
}, {
  category: "MEDIUM",
  city: "文京区",
  short: "千石図書館",
  libkey: "千石",
  pref: "東京都",
  faid: null,
  geocode: "139.7437114,35.7275736",
  systemid: "Tokyo_Bunkyo",
  address: "東京都文京区千石1-25-3",
  libid: "103860",
  tel: "03-3946-7748",
  systemname: "東京都文京区",
  isil: "JP-1000938",
  post: "112-0011",
  url_pc: "http://www.lib.city.bunkyo.tokyo.jp/",
  formal: "文京区立千石図書館"
}, {
  category: "MEDIUM",
  city: "文京区",
  short: "小石川図書館",
  libkey: "小石川",
  pref: "東京都",
  faid: null,
  geocode: "139.7400925,35.7169859",
  systemid: "Tokyo_Bunkyo",
  address: "東京都文京区小石川5-9-20",
  libid: "103863",
  tel: "03-3814-6745",
  systemname: "東京都文京区",
  isil: "JP-1000934",
  post: "112-0002",
  url_pc: "http://www.lib.city.bunkyo.tokyo.jp/",
  formal: "文京区立小石川図書館"
}, {
  category: "LARGE",
  city: "台東区",
  short: "子ども図書館",
  libkey: "国際子ども図書館",
  pref: "東京都",
  faid: null,
  geocode: "139.7737401,35.7196089",
  systemid: "Tokyo_NDL",
  address: "東京都台東区上野公園12-49",
  libid: "104105",
  tel: "03-3827-2053",
  systemname: "国立国会図書館",
  isil: "JP-1000003",
  post: "110-0007",
  url_pc: "http://www.kodomo.go.jp/",
  formal: "国立国会図書館国際子ども図書館"
}, {
  category: "UNIV",
  city: "渋谷区",
  short: "渋谷図書館",
  libkey: "渋谷",
  pref: "東京都",
  faid: "FA005256",
  geocode: "139.7114668,35.65547",
  systemid: "Univ_Kokugakuin",
  address: "東京都渋谷区東4-10-28",
  libid: "106609",
  tel: "03-5466-0159",
  systemname: "國學院大學",
  isil: "JP-1003875",
  post: "150-8440",
  url_pc: "https://www.kokugakuin.ac.jp/student/lifesupport/library",
  formal: "國學院大學渋谷図書館"
}, {
  category: "BM",
  city: "昭島市",
  short: "もくせい号",
  libkey: "BM",
  pref: "東京都",
  faid: null,
  geocode: "139.3851232,35.7053229",
  systemid: "Tokyo_Akishima",
  address: "東京都昭島市東町2-6-33",
  libid: "103852",
  tel: "042-543-1523",
  systemname: "東京都昭島市",
  isil: null,
  post: "196-0033",
  url_pc: "http://www.library.akishima.tokyo.jp/",
  formal: "昭島市動く図書館「もくせい号」"
}]
