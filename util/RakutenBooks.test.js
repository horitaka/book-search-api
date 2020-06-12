const RakutenBooks = require('./RakutenBooks');
const rakutenBooks = new RakutenBooks();

describe('RakutenBooks', () => {

  it('convertBookItemsFormat', () => {
    const bookItems = [
      {
        "title": "タイトル1",
        "author": "川口/喜多",
        "isbn": "111",
        "itemUrl": "https://books.rakuten.co.jp/001",
        "largeImageUrl": "https://thumbnail.image.rakuten.co.jp/001",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/hgc/001",
      },
      {
        "title": "タイトル2",
        "author": "佐藤",
        "isbn": "222",
        "itemUrl": "https://books.rakuten.co.jp/002",
        "largeImageUrl": "https://thumbnail.image.rakuten.co.jp/002",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/hgc/002",
      },
      {
        "title": "タイトル3",
        "isbn": "333",
        "itemUrl": "https://books.rakuten.co.jp/003",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/hgc/003",
      },
    ]

    const expectedResult = [
      {
        title: "タイトル1",
        authors: ["川口", "喜多"],
        isbn: 111,
        imageUrl: "https://thumbnail.image.rakuten.co.jp/001",
        rakutenAffiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/001',
      },
      {
        title: "タイトル2",
        authors: ["佐藤"],
        isbn: 222,
        imageUrl: "https://thumbnail.image.rakuten.co.jp/002",
        rakutenAffiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/002',
      },
      {
        title: "タイトル3",
        authors: [],
        isbn: 333,
        imageUrl: "",
        rakutenAffiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/003',
      },
    ]

    expect(rakutenBooks.convertBookItemsFormat(bookItems)).toEqual(expectedResult);
  })
})