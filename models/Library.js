
class Library {
  constructor() {
    const Calil = require('../util/Calil');
    this.calil = new Calil();
    this.libraries = [];
  }

  async getLibraries(prefecture) {
    this.libraries = await this.calil.searchLibrary(prefecture);
    return this.libraries
  }

}

module.exports = Library;