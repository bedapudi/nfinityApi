const pool = require('../../db')
module.exports = {
    login: (email, password) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                var sql = "SELECT * FROM users WHERE email= ? AND password = ?";
                connection.query(sql, [email, password], function (err, result) {
                    connection.release(); // always put connection back in pool after last query
                    if (err) {
                        console.log(err);
                        return reject("db error");
                    } else {
                        if(result.length){
                            return resolve(true)
                        } else {
                            return reject(true)
                        }
                    }
                });
            });
        })
    },

    getUserList: () => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                var sql = "SELECT * FROM users ORDER BY created_at DESC";
                connection.query(sql, [], function (err, results) {
                    connection.release(); // always put connection back in pool after last query
                    if (err) {
                        console.log(err);
                        return reject("db error");
                    } else {
                        return resolve(results)
                    }
                });
            });
        })
    }
}