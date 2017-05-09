// strict mode
"use strict";

// node modules
var mysql = require('mysql');

// create MySQL connection object
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'webuser',
    password: 'rullakkebab',
    database: 'mydb'
});

// connect to db
conn.connect(function (err) {
    if(err) {
        console.erroror(err);
        return;
    } else {
        console.log("Connection to database established successfully");
    }
});

/**
 * Create new user to system
 * @param name Name of the user
 * @param email User contant email
 * @param passwd User password, hashed BEFORE sent over ajax, FRONT END BUSINESS!
 * @returns {boolean} True if successful
 */
var createUser = function(name, email, passwd, cb) {
    if(userExists(name)) {
        cb("User exists already!");
        return;
    }
    let query = "INSERT INTO User(name, email, password) VALUES(?,?,?);";
    commitQuery(query, [name, email, passwd], cb);
};

/**
 * Delete user
 * @param idUser
 * @param cb
 */
var deleteUser = function(idUser, cb) {
    commitQuery("DELETE FROM User WHERE idUser = ?;", [idUser], cb);
};

/**
 * Update user data
 * REMEMBER VALIDATION BEFORE CALLING
 * PASSWORD DOUBLE CHECK
 * @param idUser
 * @param email
 * @param passwd
 * @param cb
 */
var updateUser = function (idUser, email, passwd, cb) {
    let query = "UPDATE User SET email = ?, passwd = ? WHERE idUser = ?;";
    commitQuery(query, [email, passwd], cb);
}

/**
 * Add new screening
 * @param idMovie
 * @param time
 * @param idAuditorium
 */
var admin_newScreening = function (idMovie, time, idAuditorium, cb) {
    getMovie(idMovie, function (err, res) {
        if(err) {
            console.error("Movie " + idMovie + " was requested by newScreening but not found");
            cb("Invalid movie id");
        } else {
            commitQuery("INSERT INTO Screening(idMovie, time, idAuditorium) VALUES(?,?,?);", [idMovie, time, idAuditorium], cb);
        }
    });
};

/**
 * Delete screening
 * @param idScreening
 * @param cb
 */
var admin_deleteScreening = function (idScreening, cb) {
    commitQuery("DELETE FROM Screening WHERE idScreening = ?;", [idScreening], cb);
};

/**
 * Add movie to database
 * @param title
 * @param pic_url
 * @param cb
 */
var admin_addMovie = function (title, pic_url, cb) {
    // todo add pic
    commitQuery("INSERT INTO Movie(title) VALUES(?);"
        , [title], cb);
}

/**
 * Fetch screenings of a specific movie from a specific theater
 * @param idMovie
 * @param idTheater
 * @param cb
 */
var getScreenings = function (idMovie, idTheater, cb) {
    let query = "SELECT * FROM Screening WHERE idMovie = ? AND idAuditorium IN " +
        "(SELECT idAuditorium FROM Auditorium WHERE idTheater = ?);";
    commitQuery(query, [idMovie, idTheater], cb);
}

/**
 * Get a single movie by it's id
 * @param idMovie
 * @param cb
 */
var getMovie = function (idMovie, cb) {
    commitQuery("SELECT * FROM Movie WHERE idMovie = ?;", [idMovie], cb);
};

/**
 * Find movies by their name of part of their name
 * Case insensitive
 * @param name
 * @param cb
 */
var findMovies = function (name, cb) {
    commitQuery("SELECT * FROM Movie WHERE name COLLATE UTF8_GENERAL_CI LIKE '?%';", [name], cb);
}

/**
 * Delete a reservation from the database
 * @param idUser
 * @param idReservation
 * @param cb
 */
var deleteReservation = function(idUser, idReservation, cb) {
    // ebin callback hell
    commitQuery("SELECT * FROM Reservation WHERE idReservation = ?;", [idReservation], function (err, res) {
        if(err) {
            cb("Failed");
            return;
        } else {
            if(res.length !== 1) {
                console.error("Invalid number of Reservations were returned: " + res.length);
                cb("Failed");
                return;
            } else {
                // one reservation was found
                if(res[0].idUser !== idUser) {
                    // someone tried to delete other user's reservation
                    console.error("WARNING: User " + idUser + " tried to delete reservation " + idReservation + " by user " + res[0].idUser);
                    cb("Failed");
                    return;
                } else {
                    // everything is good, proceed with deleting the reservation
                    commitQuery("DELETE FROM Reservation WHERE idReservation = ?;", [idReservation], cb);
                }
            }
        }
    });
};

/**
 * Create a new booking for a movie screening
 * @param idUser user id
 * @param idScreening screening id
 * @param idSeat seat id
 * @returns {boolean}
 */
var createBooking = function(idUser, idScreening, idSeat, cb) {
    isSeatFree(idSeat, idScreening, function (err, value) {
        if(!value) {
            // if seat was not free
            cb("Seat reserved already");
        } else {
            doBooking();
        }
    });

    // do the insertion query
    function doBooking() {
        let query = "INSERT INTO Booking(idUser, idScreening, idSeat) VALUES(?, ?, ?)";
        conn.query(query, [idUser, idScreening, idSeat], function (err, res) {
            if(err) {
                cb("Failed to create booking to db");
                console.error(err);
            } else {
                cb(null, res);
            }
            console.log("Booking " + res.idBooking + " created");
        });
    }
};

/**
 * Check if given seat is free for the given screening
 * @param idSeat
 * @param idScreening
 * @returns {boolean} true if the seat is free
 */
var isSeatFree = function(idSeat, idScreening, cb) {
    getReservedSeats(idScreening, function(err, res) {
       if(err) {
           console.error(err);
           cb(err);
       } else {
           for(let reservation of res) {
               if(reservation.idSeat === idSeat) {
                   cb(null, false);
                   return;
               }
           }
           // if there are no reservations, return true
           cb(null, true);
       }
    });
};

/**
 * Return the result array of all the reserved seats of the given screening
 * @returns {Array} Array of reserved seats as objects, null if none
 */
var getReservedSeats = function(idScreening, cb) {
    let query = "SELECT * FROM Seat WHERE idAuditorium = (SELECT idAuditorium FROM Screening WHERE idScreening = ?) AND Seat.idSeat IN (SELECT idSeat FROM Booking WHERE idScreening = ?);";
    commitQuery(query, [idScreening, idScreening], cb);
};

/**
 * Get bookings for a given screening
 * @param idScreening
 * @param cb
 */
var getBookings = function(idScreening, cb) {
    let query = "SELECT * FROM Booking WHERE idScreening = ?;";
    commitQuery(query, [idScreening], cb);
};

/**
 * Get all threaters
 * @param cb
 */
var getThreaters = function (cb) {
    commitQuery("SELECT * FROM Theater;", [], cb);
};

/**
 * Get seats in the auditorium
 * @param idAuditorium
 * @param cb
 */
var getAuditoriumSeats = function(idAuditorium, cb) {
    let query = "SELECT * FROM Seat WHERE idAuditorium = ?;";
    commitQuery(query, [idAuditorium], cb);
};

/**
 * Utility function which commits a database query with the given query string
 * and arguments
 * NOT TO BE EXPORTED
 * @param query
 * @param params
 * @param cb
 */
var commitQuery = function(query, params, cb) {
    // ensure there's no trickery
    if((params.constructor !== Array) && (typeof query === 'string') && (typeof cb === 'function')) {
        console.error("Invalid call to commitQuery: check arguments");
        return;
    }
    // commit the query
    conn.query(query, params, function(err, res) {
        if(err) {
            cb(err);
            console.error(err);
        } else {
            cb(null, res);
        }
    })
};

/**
 * Return reserved seats as the response
 * @param idScreening Screening ID
 * @param cb Callback, ideally the response object for Express
 */
var getReservedSeats = function(idScreening, cb) {
    getReservedSeats(idScreening, function(err, res) {
        if(err) {
            cb(err);
        } else {
            cb(null, res);
        }
    })
};

/**
 * Get ALL screenings
 * @param cb
 */
var getScreenings = function (cb) {
    commitQuery("SELECT * FROM Screening;", [], cb);
};

/**
 * Get screenings from a given date range
 * @param cb
 */
var getScreenings = function (datestart, dateend, cb) {
    commitQuery("SELECT * FROM Screening WHERE DATE(time) BETWEEN ? AND ?;", [datestart, dateend], cb);
};

var getuserBookings = function (idUser, cb) {
    commitQuery("SELECT * FROM Booking WHERE idUser = ?", [idUser], cb);
};

var getScreeningReservations = function (idScreening, cb) {
    commitQuery("SELECT * FROM Booking WHERE idScreening = ?;", [idScreening], cb);
};

/**
 * Check if user exists in database
 * @param name
 * @param cb
 */
var userExists = function(name, cb) {
    let query = "SELECT name FROM User;";
    conn.query(query, function (err, res) {
        if(err) {
            cb("Error while querying user");
            console.error(err);
        } else {
            for(let user of res) {
                if(name.toLowerCase() === user.name.toLowerCase()) {
                    cb(null, true);
                    return;
                }
            }
        }
        cb(null, false);
    });
};

/**
 * Close connection to databse
 */
var closeConnection = function() {
    conn.end(function(err) {
        if(err) {
            console.error(err);
        } else {
            console.log("Connection closed successfully");
        }
    });
};

/**
 * Convert JavaScript Date object to MySQL accepted DateTime format
 * which is YYYY-MM-DD HH-MM-SS
 * @param str
 * @returns {string} MySQL format string
 */
var stringToMySQLDateTime = function (date) {
    if(!(date instanceof Date)) {
        console.error("Invalid object given to strign ToMySQLDate");
        return 'error';
    }
    return str.toISOString().slice(0, 19).replace('T', ' ');
}

// todo
createUser("sibal", 'asd', "asffas");
// todo
closeConnection();

// define the exported API
module.exports = {

};
