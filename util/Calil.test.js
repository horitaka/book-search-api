describe('Calil', () => {
  const Calil = require('./Calil');
  const calil = new Calil;

  it('calls convertStocksObjectToArray', () => {
    const stocksObject = {
      "Tokyo_Adachi": {
        "status": "Cache",
        "libkey": {
          "玉川台": "貸出可",
          "世田谷": "貸出中",
          "経堂": "館内のみ"
        },
        "reserveurl": "https://url1.com"
      },
      "Tokyo_Kita": {
        "status": "Error"
      }
    }

    const stocksArray = [
      {
        libraryId: 'Tokyo_Adachi',
        bookRentalUrl: 'https://url1.com',
        isOwned: true,
        canBeRend: true,
      }, {
        libraryId: 'Tokyo_Kita',
        bookRentalUrl: '',
        isOwned: false,
        canBeRend: false,
      }
    ]

    expect(calil.convertStocksObjectToArray(stocksObject)).toEqual(stocksArray)
  })

  it('calls convertBooksStocksFormat', () => {
    const booksStocks = {
      "9784861003300": {
        "Tokyo_Adachi": {
          "status": "Cache",
          "libkey": {
            "玉川台": "貸出可",
            "世田谷": "貸出中",
            "経堂": "館内のみ"
          },
          "reserveurl": "https://url1.com"
        },
        "Tokyo_Kita": {
          "status": "Error"
        }
      },
      "9784861003660": {
        "Tokyo_Adachi": {
          "status": "OK",
          "libkey": {
            "玉川台": "蔵書あり",
            "世田谷": "予約中",
            "経堂": "準備中",
            "二子玉": " 蔵書なし"
          },
          "reserveurl": "https://url2.com"
        },
        "Tokyo_Kita": {
          "status": "Cache",
          "libkey": {},
          "reserveurl": ""
        }
      },
      "0": {
        "Tokyo_Adachi": {
          "status": "Cache",
          "libkey": {},
          "reserveurl": ""
        },
        "Tokyo_Kita": {
          "status": "Cache",
          "libkey": {},
          "reserveurl": ""
        }
      }
    }

    const expectedData = {
      "9784861003300": [
        {
          libraryId: 'Tokyo_Adachi',
          bookRentalUrl: 'https://url1.com',
          isOwned: true,
          canBeRend: true,
        }, {
          libraryId: 'Tokyo_Kita',
          bookRentalUrl: '',
          isOwned: false,
          canBeRend: false,
        }
      ],
      "9784861003660": [
        {
          libraryId: 'Tokyo_Adachi',
          bookRentalUrl: 'https://url2.com',
          isOwned: true,
          canBeRend: false,
        }, {
          libraryId: 'Tokyo_Kita',
          bookRentalUrl: '',
          isOwned: false,
          canBeRend: false,
        }
      ]
    }
    expect(calil.convertBooksStocksFormat(booksStocks)).toEqual(expectedData)

  })
})

