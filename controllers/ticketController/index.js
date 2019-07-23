const pool = require('../../db')
module.exports = {
    getTicketList: (user) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                let params = []
                let sql
                if(user.is_admin){
                    sql = "SELECT tickets.id, tickets.description, tickets.created_at,tickets.status, tickets.category, tickets.created_by, " +
                    "ticket_statuses.title AS status_title, ticket_categories.title AS category_title, users.first_name, users.last_name FROM tickets "+
                    "JOIN ticket_statuses on tickets.status = ticket_statuses.id " +
                    "JOIN ticket_categories on tickets.category = ticket_categories.id "+
                    "JOIN users ON tickets.created_by = users.id ORDER BY created_at DESC";
                } else {
                    sql = sql = "SELECT tickets.id, tickets.description, tickets.created_at,tickets.status, tickets.category, tickets.created_by, " +
                    "ticket_statuses.title AS status_title, ticket_categories.title AS category_title, users.first_name, users.last_name FROM tickets "+
                    "JOIN ticket_statuses on tickets.status = ticket_statuses.id " +
                    "JOIN ticket_categories on tickets.category = ticket_categories.id "+
                    "JOIN users ON tickets.created_by = users.id WHERE created_by = ? ORDER BY created_at DESC";
                    params = [user.id]
                }
                
                connection.query(sql, params, function (err, results) {
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

    addTicket: (ticketDetails, userId) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                var sql = "INSERT INTO TICKETS(description, status, category, created_by) values(?, ?, ?, ?)";
                connection.query(sql, [ticketDetails.description, ticketDetails.status, ticketDetails.category, userId], function (err, result) {
                    connection.release();
                    if (err) {
                        console.log(err);
                        return reject("db error");
                    } else {
                        return resolve({ticketId: result.insertId})
                    }
                });
            });
        })
    },

    updateTicket: (ticketDetails) => {
        console.log("updateTicket>>", ticketDetails)
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                var sql = "UPDATE TICKETS SET description = ?, status = ?, category= ? WHERE id = ?";
                connection.query(sql, [ticketDetails.description, ticketDetails.status, ticketDetails.category, ticketDetails.id], function (err, result) {
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

    getCommentsForTicket: (ticketId) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                let params = [ticketId]
                let sql = "SELECT comment, comments.created_at, created_by, users.first_name, users.last_name FROM COMMENTS " +
                        "JOIN USERS ON COMMENTS.created_by = USERS.id " +
                        "WHERE ticket_id= ? ORDER BY comments.created_at"
                connection.query(sql, params, function (err, results) {
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

    addComment: (comment, userId, ticketId) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                var sql = "INSERT INTO COMMENTS(comment, ticket_id, created_by) values(?, ?, ?)";
                connection.query(sql, [comment, ticketId, userId], function (err, result) {
                    //connection.release(); 
                    if (err) {
                        console.log(err);
                        return reject("db error");
                    } else {
                        sql = "SELECT comment, comments.created_at, created_by, users.first_name, users.last_name FROM COMMENTS " +
                                "JOIN USERS ON COMMENTS.created_by = USERS.id " +
                                "WHERE COMMENTS.id= ?"
                        connection.query(sql, [result.insertId], function (err, results) {
                            connection.release();
                            if (err) {
                                console.log(err);
                                return reject("db error");
                            } else {
                                return resolve(results[0])
                            }
                        });
                    }
                });
            });
        })
    },
}