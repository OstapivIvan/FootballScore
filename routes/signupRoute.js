const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const DatabaseOperations = require('../public/databaseFunctions.js');
const { sendConfirmationEmail } = require('../modules/emailSender.js');

router.get('/signup', (req, res) => {
    res.render('signup', { error: '' });
});

router.post('/signup', async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.Email;
        const password = req.body.Password;
        const confirmPassword = req.body.confirm_password;
        const premiumStatus = req.body.premiumStatus == undefined ? 0 : 1;

        const { exists: emailExists } = await DatabaseOperations.checkIfEmailExists(email);

        if (emailExists) {
            let error = 'Email already registered';
            return res.render('signup.ejs', { error });
        }

        if (password !== confirmPassword) {
            let error = 'Passwords must match';
            return res.render('signup.ejs', { error });
        }
        
        const uniqueKey = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        await DatabaseOperations.saveUniqueKeyToDatabase(uniqueKey, email);
        await sendConfirmationEmail(username, email, uniqueKey, hashedPassword, premiumStatus);

        return res.status(303).redirect('/signup?confirmation=required');
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/confirmation', async (req, res) => {
    try {
        const uniqueKey = req.body.uniqueKey;

        const isValidKey = await DatabaseOperations.checkIfValidKey(uniqueKey);

        if (isValidKey) {
            const { username, email, password, premiumStatus } = req.body;
            const { exists: emailExists } = await DatabaseOperations.checkIfEmailExists(email);

            if (emailExists) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            
            await DatabaseOperations.saveUserToDatabase(username, email, password, premiumStatus);
            await DatabaseOperations.deleteConfirmationKey(uniqueKey);

            res.cookie("email", email, { httpOnly: true, path: "/" });
            res.cookie("username", username, { httpOnly: true, path: "/" });
            
            return res.status(201).redirect('/signup?confirmation=successfully');
        } else {
            return res.status(403).json({ error: 'Invalid confirmation key' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
