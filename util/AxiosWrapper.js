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
          const data = {
            ...error.response.data,
            url: url,
            options: options,
          }
          let response;
          if (status === 400) {
            response = Boom.badRequest(error.message, data)
          } else if (status === 403) {
            response = Boom.forbidden(error.message, data)
          } else if (status === 404) {
            response = Boom.notFound(error.message, data)
          } else {
            response = Boom.internal(error.message, data)
          }

          reject(response)
        })
    })
  }

}

module.exports = AxiosWrapper;
