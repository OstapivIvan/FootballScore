require('dotenv').config();

const apiKey = process.env.API_KEY;
const axios = require('axios');

function groupMatchesByTour(matches) {
    const groupedMatches = [];
    let currentTour = null;

    matches.forEach(match => {
        const matchTour = match.matchday;
        if (matchTour !== currentTour) {
            groupedMatches.push({
                tour: matchTour,
                matches: [match],
            });
            currentTour = matchTour;
        } else {
            groupedMatches[groupedMatches.length - 1].matches.push(match);
        }
    });

    return groupedMatches;
}


async function makeApiRequest(url, headers = {}) {
    const defaultHeaders = {
        'X-Auth-Token': apiKey
    };

    try {
        const response = await axios.get(url, { headers: { ...defaultHeaders, ...headers } });
        return response; 
    } catch (error) {
        throw new Error('API Error');
    }
}

const leagueIdToCompetitionCode = {
    'EPL': 'PL',
    'LaLiga': 'PD',
    'Bundesliga': 'BL1',
    'SeriaA': 'SA',
    'Ligue1': 'FL1',
    'Eredivisie': 'DED',
    'PrimeiraLiga': 'PPL',
    'UCL': 'CL',
    'ELC': 'ELC',
};

function getCompetitionCode(leagueId) {
    return leagueIdToCompetitionCode[leagueId] || '';
}

module.exports = { groupMatchesByTour, getCompetitionCode, makeApiRequest };  