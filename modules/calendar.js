const Team = require('./team');

class Match {
    constructor(data) {
      this.homeTeam = new Team(data.homeTeam);
      this.awayTeam = new Team(data.awayTeam);
      this.status = data.status || '-';
      this.score = (data.score || data.status !=="POSTPONED" )  ||  { fullTime: { home: '-', away: '-' } };
    }
  }

  class Tour {
    constructor(data) {
      this.tour = data.tour || '-';
      this.matches = data.matches.map(matchData => new Match(matchData));
    }
  }


  class MatchInfo {
    constructor(data) {
      this.league = data.league || '-';
      this.matchData = data.matchData.map(tourData => new Tour(tourData));
    }
  }
  
  module.exports = {
    MatchInfo,
    Team,
  };
  