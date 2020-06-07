const axios = require('axios');
const Boom = require('@hapi/boom')

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
          const status = error.response.status
          let response;
          if (status === 400) {
            response = Boom.badRequest(error.message, error.response.data)
          } else if (status === 403) {
            response = Boom.forbidden(error.message, error.response.data)
          } else if (status === 404) {
            response = Boom.notFound(error.message, error.response.data)
          } else {
            response = Boom.internal(error.message, error.response.data)
          }

          reject(response)
        })
    })
  }

}

module.exports = AxiosWrapper;
