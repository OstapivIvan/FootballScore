const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const email = req.cookies.email;
    const username = req.cookies.username;
    const premiumStatus = req.cookies.premiumStatus;
    res.render('index', { email, username, premiumStatus });
});

router.get('/logout', (req, res) => {
    res.cookie('email', '', { expires: new Date(0), httpOnly: true, path: '/' });
    res.cookie('username', '', { expires: new Date(0), httpOnly: true, path: '/' });
    res.cookie('premiumStatus', '', { expires: new Date(0), httpOnly: true, path: '/' });
    res.redirect('/login');
});

router.get('/profile', (req, res) => {
    const email = req.cookies.email;
    const username = req.cookies.username;
    const premiumStatus = req.cookies.username;
    res.render('profile', { email, username, premiumStatus });
});

module.exports = router;
