class Tour {
    constructor(data) {
      this.tour = data.tour || '-';
      this.matches = data.matches.map(matchData => new Match(matchData));
    }
  }

  module.exports = Tour;