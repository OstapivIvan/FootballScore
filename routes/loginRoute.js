const express = require('express');
const router = express.Router();
const DatabaseOperations = require('../public/databaseFunctions.js');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
    res.render('login', { error: '' });
});

router.post('/login', async (req, res) => {
    try {
        const { exists, user } = await DatabaseOperations.checkIfEmailExists(req.body.Email);

        if (!exists) {
            const error = 'Incorrect email or password';
            return res.status(401).render('login', { error });
        }

        const storedHash = user.password;

        bcrypt.compare(req.body.Password, storedHash, (bcryptErr, match) => {
            if (bcryptErr) {
                console.error('Error comparing passwords:', bcryptErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (!match) {
                const error = 'Incorrect email or password';
                return res.status(401).render('login', { error });
            }

            res.cookie("email", user.email, { httpOnly: true, path: "/" });
            res.cookie("username", user.username, { httpOnly: true, path: "/" });
            res.redirect('/');
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;


