require('dotenv').config()

const config = {
  calil: {
    apiUrl: 'http://api.calil.jp',
    apiKey: process.env.CALIL_API_KEY,
  },
  googleBooks: {
    apiUrl: 'https://www.googleapis.com/books',
  }
}

module.exports = config;