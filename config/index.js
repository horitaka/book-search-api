require('dotenv').config()

const config = {
  calil: {
    apiUrl: 'http://api.calil.jp',
    apiKey: process.env.CALIL_API_KEY,
  },
  googleBooks: {
    apiUrl: 'https://www.googleapis.com/books',
  },
  rakutenBooks: {
    apiUrl: 'https://app.rakuten.co.jp',
    appId: process.env.RAKUTEN_BOOKS_APP_ID,
    appSecret: process.env.RAKUTEN_BOOKS_APP_SECRET,
    affiliateId: process.env.RAKUTEN_BOOKS_AFFILIATE_ID,
  }
}

module.exports = config;