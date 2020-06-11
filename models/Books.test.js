const Books = require('./Books');
const books = new Books()

describe('Books', () => {
  const googleBooks = [{
    imageUrl: 'http://books.google.com/books/content?id=hyLlDwAAQBAJ',
    title: 'Webデザインの現場で使えるVue.jsの教科書',
    authors: ['廣末丈士', '遠山恭平'],
    isbn: 9784274225406
  },
  {
    imageUrl: 'http://books.google.com/books/content?id=Rh_1To0ryuMC',
    title: 'Vueアドバンスドガイドブック',
    authors: ['沖乃綿哉'],
    isbn: 9784861003660
  },
  {
    imageUrl: 'http://books.google.com/books/content?id=0F1UDwAAQBAJ',
    title: 'Hello!! Vue.js',
    authors: ['那須 理也'],
    isbn: 0
  }]

  const rakutenAffiliateLinks = {
    '9784274225406': {
      isbn: 9784274225406,
      affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00q0727.rf58m3b8.g00q0727.rf58o67e/'
    },
    '9784861003660': {
      isbn: 9784861003660,
      affiliateUrl: ''
    }
  }

  it('calls mergeBooks ', () => {

    const expectedResult = [{
      ...googleBooks[0],
      rakutenAffiliateUrl: rakutenAffiliateLinks['9784274225406']['affiliateUrl'],
    }, {
      ...googleBooks[1],
      rakutenAffiliateUrl: '',
    }, {
      ...googleBooks[2],
      rakutenAffiliateUrl: '',
    }]

    expect(books.mergeBooks(googleBooks, rakutenAffiliateLinks)).toEqual(expectedResult)

  })

  it('calls mergeBooks with no rakutenAffiliateLinks data ', () => {

    const expectedResult = [{
      ...googleBooks[0],
      rakutenAffiliateUrl: '',
    }, {
      ...googleBooks[1],
      rakutenAffiliateUrl: '',
    }, {
      ...googleBooks[2],
      rakutenAffiliateUrl: '',
    }]

    expect(books.mergeBooks(googleBooks, {})).toEqual(expectedResult)

  })
})