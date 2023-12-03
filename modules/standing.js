const Team = require('./team');

class TeamStanding {
    constructor(data) {
        this.position = data.position;
        this.team = new Team(data.team) ;
        this.playedGames = data.playedGames ;
        this.won = data.won ;
        this.draw = data.draw  ;
        this.lost = data.lost ;
        this.points = data.points 
        this.goalsFor = data.goalsFor
        this.goalsAgainst = data.goalsAgainst;
        this.goalDifference = data.goalDifference;
    }
}

class Standings {
    constructor(data) {
        this.league = data.league || '-';
        if (data.standings && data.standings.length) {
            this.standings = data.standings.map(group => {
                return {
                    group: group.group,
                    table: (group.table || []).map(teamStanding => new TeamStanding(teamStanding))
                };
            });
        } else if (data.standings && data.standings[0].table) {
            this.standings = [{
                group: null,
                table: data.standings[0].table.map(teamStanding => new TeamStanding(teamStanding))
            }];
        } else {
            this.standings = [];
        }
    }
}



module.exports = {
    TeamStanding,
    Standings,
};
