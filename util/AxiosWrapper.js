const axios = require('axios');

class AxiosWrapper {

  fetchData(url) {
    const headers = { 'Access-Control-Allow-Origin': '*' }

    return new Promise((resolve, reject) => {
      axios.get(url, { headers: headers })
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

module.exports = AxiosWrapper;
