const dbConnection = require('./databaseConnection');
const db = dbConnection.connectToDatabase();
class DatabaseOperations {
    static async deleteConfirmationKey(uniqueKey) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM unique_keys WHERE key_value = ?';
            db.query(sql, [uniqueKey], (err) => {
                if (err) {
                    console.error('Error deleting confirmation key:', err);
                    reject('Error deleting confirmation key');
                } else {
                    console.log('Confirmation key deleted successfully');
                    resolve();
                }
            });
        });
    }

    static async saveUniqueKeyToDatabase(uniqueKey, email) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO unique_keys (key_value) VALUES (?)';
            db.query(sql, [uniqueKey, email], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async checkIfValidKey(uniqueKey) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM unique_keys WHERE key_value = ?';
            db.query(sql, [uniqueKey], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length > 0);
                }
            });
        });
    }

    
    static async checkIfEmailExists(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ?';

            db.query(sql, [email], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const userExists = results.length > 0;
                    const userData = userExists ? results[0] : null;
                    resolve({ exists: userExists, user: userData });
                }
            });
        });
    }

    static async saveUserToDatabase(username, email, hashedPassword, premium_status) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (username, email, password, premium_status) VALUES (?, ?, ?, ?)';
            db.query(sql, [username, email, hashedPassword, premium_status], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async deleteExpiredKeys() {
        return new Promise((resolve, reject) => {
            try {
                const currentDate = new Date();
                const expirationDate = new Date(currentDate);
                expirationDate.setMinutes(expirationDate.getMinutes() - 20);
                const sql = 'DELETE FROM unique_keys WHERE created_at < ?';
                db.query(sql, [expirationDate], (err, result) => {
                    if (err) {
                        console.error('Error querying database:', err);
                        reject('Error deleting expired keys');
                    }

                    console.log(`${result.affectedRows} expired keys deleted`);
                    resolve('Expired keys deleted successfully');
                });
            } catch (error) {
                console.error('Error deleting expired keys:', error);
                reject('Internal Server Error');
            }
        });
    }
}

module.exports = DatabaseOperations;
