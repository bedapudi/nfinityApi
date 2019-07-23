const pool = require('../../db')
module.exports = {
    login: (email, password) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                var sql = "SELECT id, is_admin FROM users WHERE email= ? AND password = ?";
                connection.query(sql, [email, password], function (err, result) {
                    connection.release(); 
                    if (err) {
                        console.log(err);
                        return reject("db error");
                    } else {
                        if(result.length){
                            return resolve(result[0])
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
                    connection.release();
                    if (err) {
                        console.log(err);
                        return reject("db error");
                    } else {
                        return resolve(results)
                    }
                });
            });
        })
    },

    addUser: (userDetails) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                var sql = "INSERT INTO USERS(first_name, last_name, email, password, is_admin) values(?, ?, ?, ?, ?)";
                connection.query(sql, [userDetails.firstName, userDetails.lastName, userDetails.email, userDetails.password, userDetails.isAdmin], function (err, result) {
                    connection.release();
                    if (err) {
                        console.log(err);
                        return reject("db error");
                    } else {
                        return resolve({userId: result.insertId})
                    }
                });
            });
        })
    },

    updateUser: (userDetails) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                var sql = "UPDATE USERS SET first_name = ?, last_name = ?, password= ?, is_admin = ? WHERE id = ?";
                connection.query(sql, [userDetails.firstName, userDetails.lastName, userDetails.password, userDetails.isAdmin, userDetails.id], function (err, result) {
                    connection.release();
                    if (err) {
                        console.log(err);
                        return reject("db error");
                    } else {
                        return resolve({affectedRows: result.affectedRows})
                    }
                });
            });
        })
    },

    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                var sql = "DELETE from USERS WHERE id =?";
                connection.query(sql, [userId], function (err, result) {
                    connection.release();
                    if (err) {
                        console.log(err);
                        return reject("db error");
                    } else {
                        return resolve({affectedRows: result.affectedRows})
                    }
                });
            });
        })
    }
    
}