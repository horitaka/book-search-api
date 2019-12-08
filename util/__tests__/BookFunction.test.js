const BookFunction = require('../BookFunction');
const bookFunction = new BookFunction();

describe('BookFunction', () => {
  const amazonBookUrl = 'https://www.amazon.co.jp/%E7%A2%BA%E3%81%8B%E3%81%AA%E5%8A%9B%E3%81%8C%E8%BA%AB%E3%81%AB%E3%81%A4%E3%81%8FJavaScript%E3%80%8C%E8%B6%85%E3%80%8D%E5%85%A5%E9%96%80-%E7%AC%AC2%E7%89%88-%E7%8B%A9%E9%87%8E-%E7%A5%90%E6%9D%B1/dp/4815601577/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1575689870&sr=1-1';
  const amazonEbookUrl = 'https://www.amazon.co.jp/%E7%A2%BA%E3%81%8B%E3%81%AA%E5%8A%9B%E3%81%8C%E8%BA%AB%E3%81%AB%E3%81%A4%E3%81%8FJavaScript%E3%80%8C%E8%B6%85%E3%80%8D%E5%85%A5%E9%96%80-%E7%AC%AC2%E7%89%88-%E7%8B%A9%E9%87%8E-%E7%A5%90%E6%9D%B1-ebook/dp/B07Y3FJ885/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=1575689870&sr=1-1';
  const otherUrl = 'https://yahoo.co.jp';

  // it('getSearchType', () => {
  //
  //   expect(bookFunction.getSearchType(amazonBookUrl)).toBe(bookFunction.SEARCH_TYPE_AMAZON);
  //   expect(bookFunction.getSearchType(otherUrl)).toBe(bookFunction.SEARCH_TYPE_OTHER);
  //
  // });

  it('extractIsbn', () => {
    expect(bookFunction.extractIsbn(amazonBookUrl)).toBe(4815601577)
    expect(bookFunction.extractIsbn(amazonEbookUrl)).toBe(-1)
    expect(bookFunction.extractIsbn(otherUrl)).toBe(-1)
  });

  it('getIsbn(bookInfoList)', () => {
    expect(bookFunction.getIsbn(bookInfoList)).toEqual(isbnList);
  })
})


const bookInfoList = [{
    imageUrl: 'http://books.google.com/books/content?id=RDqQXFA42-kC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    title: 'Java Script',
    authors: ['デイビッドフラナガン'],
    isbn: 9784873113296
  }, {
    imageUrl: 'http://books.google.com/books/content?id=ZpyK8u2kndAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    title: 'よくわかるJavaScriptの教科書',
    authors: ['たにぐちまこと'],
    isbn: 9784839941871
  }, {
    imageUrl: 'http://books.google.com/books/content?id=ZpyK8u2kndAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    title: 'よくわかるJavaScriptの教科書',
    authors: ['たにぐちまこと'],
  }
]

const isbnList = [9784873113296, 9784839941871, undefined]
