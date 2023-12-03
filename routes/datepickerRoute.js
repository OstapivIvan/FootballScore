const express = require('express');
const { makeApiRequest} = require('../public/tableScript.js'); 
const { DateTime } = require('luxon');
const router = express.Router();

router.get('/datepicker', (req, res) => {
    res.render('datepicker');
});

router.get('/matches', async (req, res) => {
    try {
        const selectedDate = req.query.selected_date;
        let leagues = req.query.leagues;
    
        if (!selectedDate) {
            return res.status(400).json({ error: 'Missing selected_date parameter' });
        }

        const startDay = DateTime.fromISO(selectedDate).toFormat('yyyy-MM-dd');
        const nextDay = DateTime.fromISO(selectedDate).plus({ days: 1 }).toFormat('yyyy-MM-dd');

        let url = `https://api.football-data.org/v4/matches?dateFrom=${startDay}&dateTo=${nextDay}`;

        if (leagues) {
            const selectedLeagues = Array.isArray(leagues) ? leagues : [leagues];
            url += `&competitions=${selectedLeagues.join(',')}`;
        }

        const response = await makeApiRequest(url);

        res.status(200).json({
            matches: response.data.matches, 
            selectedDate,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;