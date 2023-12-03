class Player {
    constructor(data) {
      this.name = data.name || '-';
      this.section = data.section || '-'
    }
  }

  module.exports = Player;