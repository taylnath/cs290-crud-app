const mysql = require('mysql');

// init mysql
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'me',
  password: '<mypassword>',
  database: 'exercise'
});

// wrapper that makes pool queries return a promise
function promisePool(query, vars){
  return new Promise((res, rej) => {
    pool.query(query, vars, (err, rows, fields) => {
      if (err){
        rej(err);
      } else {
        res(rows);
      }
    })
  });
}

module.exports = promisePool
