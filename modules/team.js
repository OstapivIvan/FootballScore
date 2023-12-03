class Team {
    constructor(data) {
      this.crest = data.crest || '-';
      this.name = data.name || '-';
    }
  }
  
  module.exports = Team;