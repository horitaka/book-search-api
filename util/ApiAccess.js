// import fetch from 'cross-fetch'
// import axios from 'axios';

var axios = require('axios');

class ApiAccess {

  fetchData(Url) {
    const headers = {'Access-Control-Allow-Origin': '*'}
    // const testUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:9784043636037'
    // const testUrl2 = 'http://localhost:3001/libraries?prefecture=tokyo';

    return new Promise((resolve, reject) => {
      axios.get(Url, {headers: headers})
        .then(response => {
          // console.log(response)
          resolve(response.data)
        })
        .catch(error => {
          console.warn(error)
          reject(error)
        })
    })
  }

}

module.exports = ApiAccess;
