const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'public_transport_tracker',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.log('Database connection failed: ' + err.message);
        return;
    }
    console.log('Connected to database successfully');
});

module.exports = db;

