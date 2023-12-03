const Team = require('./team');
const Player = require('./player');

class Scorer {
    constructor(data) {
      this.section = data.player ? new Player(data.player) : new Player({ section: '-' });
      this.player = data.player ? new Player(data.player) : new Player({ name: '-' });
      this.team = data.team ? new Team(data.team) : new Team({ crest: '-', name: '-' });
      this.goals =  data.goals !== null ? data.goals : 0;
      this.penalties = data.penalties !== null ? data.penalties : '-';
      this.assists = data.assists !== null ? data.assists : '-';
      this.playedMatches =  data.playedMatches !== null ? data.playedMatches : 0;
    }
  }
  
  class TopScorers {
    constructor(data) {
      this.league = data.league || '-';
      this.scorers = data.scorers.map(scorerData => new Scorer(scorerData));
    }
  }
  
  
  
  module.exports = {
    Scorer,
    TopScorers,
 };
  