const axios = require('axios');

class AxiosWrapper {

  fetchData(url, params) {
    const headers = { 'Access-Control-Allow-Origin': '*' }
    const options = {
      headers: headers,
      params: params
    }

    return new Promise((resolve, reject) => {
      axios.get(url, options)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          console.warn(error)
          reject(error)
        })
    })
  }

}

module.exports = AxiosWrapper;
