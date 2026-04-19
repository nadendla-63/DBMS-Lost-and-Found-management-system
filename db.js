const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shanmukh_0063',
  database: 'LOSTANDFOUND'
});

db.connect(err => {
  if (err) {
    console.error('DB Error:', err);
  } else {
    console.log('Connected to LOSTANDFOUND DB');
  }
});

module.exports = db;