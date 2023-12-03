const express = require('express');
const { makeApiRequest, groupMatchesByTour, getCompetitionCode } = require('../public/tableScript.js');
const { TopScorers } = require('../modules/topscorers.js');
const { MatchInfo } = require('../modules/calendar.js');
const { Standings } = require('../modules/standing.js');
const router = express.Router(); 
require('dotenv').config();

router.get('/', (req, res) => {
    res.render('tables');
});

router.get('/:league/', async (req, res) => {
    try {
        const league = req.params.league;
        const leagueId = getCompetitionCode(league);

        const url = `https://api.football-data.org/v4/competitions/${leagueId}/standings`;
        const response = await makeApiRequest(url);
        const standingsData = response.data.standings;
        const standingsInfo = new Standings({ league, standings: standingsData.map(group => ({ group, table: group.table })) });
        console.log(standingsInfo);

        res.render('tables', { league, standings: standingsInfo.standings });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:league/topscorers', async (req, res) => {
    try {
        const league = req.params.league;
        const leagueId = getCompetitionCode(league);
        const url = `https://api.football-data.org/v4/competitions/${leagueId}/scorers?limit=15`;
        const response = await makeApiRequest(url);
        console.log(response);
        const topScorersData = response.data
        const topScorers = new TopScorers(topScorersData);
        console.log(topScorers);
        res.render('tables', { league, topScorers });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:league/results', async (req, res) => {
    try {
        const league = req.params.league;
        const leagueId = getCompetitionCode(league);

        const url = `https://api.football-data.org/v4/competitions/${leagueId}/matches?status=FINISHED`;
        const response = await makeApiRequest(url);
        const matchResultsData = response.data.matches;

        const groupedMatches = groupMatchesByTour(matchResultsData);
        console.log(groupedMatches);
        const result = new MatchInfo({ league, matchData: groupedMatches });

        res.render('tables', { league, result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:league/calendar', async (req, res) => {
    try {
        const league = req.params.league;
        const leagueId = getCompetitionCode(league);

        const url = `https://api.football-data.org/v4/competitions/${leagueId}/matches?status=SCHEDULED,PAUSED,IN_PLAY,TIMED,POSTPONED`;

        const response = await makeApiRequest(url);

        const matchData = response.data.matches;

        const filteredMatches = matchData.filter(match => {
            return (
                ((league !== 'UCL') || (league === 'UCL' && match.group))
            );
        });

        const groupedMatches = groupMatchesByTour(filteredMatches);

        const calendar = new MatchInfo({ league, matchData: groupedMatches });

        res.render('tables', { league, calendar });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
