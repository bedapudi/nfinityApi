const pool = require('../../db')
module.exports = {
    login: (data) => {
        return "login success"
    },

    getUserList: () => {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.log(err);
                    return;
                }
                var sql = "SELECT * FROM users";
                connection.query(sql, [], function (err, results) {
                    connection.release(); // always put connection back in pool after last query
                    if (err) {
                        console.log(err);
                        return reject("db error");
                    } else {
                        console.log(" users", results)
                        return resolve(results)
                    }
                });
            });
        })
    }
}