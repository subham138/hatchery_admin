const mysql = require('mysql')

// const db = mysql.createPool({
//     connectionLimit: 10,
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hatchery",
// });

const db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "hatchery",
});


db.getConnection((err, connection) => {
    if(err) console.log(err);
    connection.release();
    return;
});

module.exports = db