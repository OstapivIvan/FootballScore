const mysql = require('mysql');
require('dotenv').config();
function connectToDatabase() {
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbDatabase = process.env.DB_DATABASE;
    

    const db = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase,
    });

    db.connect(err => {
        if (err) {
            console.error('Could not connect to database:', err);
            process.exit(1);
        } else {
            console.log('Connected to database');
        }
    });

    return db;
}

module.exports = {
    connectToDatabase,
};
