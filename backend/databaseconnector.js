// strict mode
"use strict";

// node modules
var mysql = require('mysql'),
    crypto = require('crypto');

// create MySQL connection object
const conn = mysql.createConnection({
    host: 'us-cdbr-iron-east-03.cleardb.net',
    user: 'b34062e6605ed9',
    password: 'ca07c783',
    database: 'heroku_4dc3cbbfb8fc79c'
});

// connect to db
conn.connect(function (err) {
    if(err) {
        console.erroror(err);
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
    userExists(name, function (err, res) {
        if(err) {
            cb(err);
        } else {
            if(res === true) {
                cb("User exists already");
            } else {
                // user does not exists, create new
                let query = "INSERT INTO User(name, email, password) VALUES(?,?,?);";
                let hashedPwd = encryptPwd(passwd);
                commitQuery(query, [name, email, hashedPwd], cb);
            }
        }
    });
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
var admin_addScreening = function (idMovie, time, idAuditorium, cb) {
    getMovie(idMovie, function (err, res) {
        if(err) {
            console.error("Movie " + idMovie + " was requested by newScreening but not found");
            cb("Invalid movie id");
        } else {
            let mysqlTime = stringToMySQLDateTime(time);
            commitQuery("INSERT INTO Screening(idMovie, time, idAuditorium) VALUES(?,?,?);",
                [idMovie, mysqlTime, idAuditorium], cb);
        }
    });
};

/**
 * Delete screening from the database
 * @param idScreening
 * @param cb
 */
var admin_deleteScreening = function (idScreening, cb) {
    commitQuery("DELETE FROM Screening WHERE idScreening = ?;",
        [idScreening], cb);
};

/**
 * Add new theater to database
 * @param name
 * @param cb
 */
var admin_addTheater = function (name, cb) {
    commitQuery("INSERT INTO Theater(name) VALUES(?);", [name], cb);
};

/**
 * Delete theater
 * @param idTheater
 * @param cb
 */
var admin_deleteTheater = function (idTheater, cb) {
    commitQuery("DELETE FROM Theater WHERE idTheater = ?;", [idTheater], cb);
};

/**
 * Add movie to database
 * @param title
 * @param pic_url
 * @param cb
 */
var admin_addMovie = function (title, pic_url, cb) {
    // todo add pic
    commitQuery("INSERT INTO Movie(title) VALUES(?);",
    [title], cb);
};

/**
 * Delete movie
 * @param idMovie
 * @param cb
 */
var admin_deleteMovie = function (idMovie, cb) {
    commitQuery("DELETE FROM Movie WHERE idMovie = ?;",
        [idMovie], cb);
};

/**
 * Clean up the database
 * Remove old reservations (those which have passed) and related screenings
 */
var admin_cleanup = function () {
    // clean up old bookings
    commitQuery("DELETE FROM Booking WHERE idScreening IN " +
        "(SELECT idScreening FROM Screening WHERE DATE(time) < DATE(NOW()));", [], function(err, res) {
        if(err) {
            console.error(err);
            console.error("Failed bookings cleanup");
        } else {
            // clean up old screenings
            commitQuery("DELETE FROM Screening WHERE DATE(time) < DATE(NOW());", [], function (err, res) {
                if(err) {
                    console.error(err);
                    console.error("Failed screening cleanup");
                } else {
                    console.log("Cleanup successful");
                }
            });
        }
    });
};

/**
 * Fetch screenings of a specific movie from a specific theater
 * @param idMovie
 * @param idTheater
 * @param cb
 */
var getScreeningsByTheaterMovie = function (idMovie, idTheater, cb) {
    let query = "SELECT * FROM Screening WHERE DATE(time) >= DATE(NOW()) AND idMovie = ? AND idAuditorium IN " +
        "(SELECT idAuditorium FROM Auditorium WHERE idTheater = ?);";
    commitQuery(query, [idMovie, idTheater], cb);
};

/**
 * Get all screenings for a specific movie
 * @param idMovie
 * @param cb
 */
var getMovieScreenings = function (idMovie, cb) {
    commitQuery("SELECT * FROM Screenings WHERE idMovie = ?;", [idMovie], cb);
}

/**
 * Get all screenings
 * @param cb
 */
var getAllScreenings = function (cb) {
    commitQuery("SELECT * FROM Screening;", [], cb);
};

/**
 * Get a single movie by it's id
 * @param idMovie
 * @param cb
 */
var getMovie = function (idMovie, cb) {
    commitQuery("SELECT * FROM Movie WHERE idMovie = ?;", [idMovie], cb);
};

/**
 * Get all movies
 * @param cb
 */
var getMovies = function (cb) {
    commitQuery("SELECT * FROM Movie;", [], cb);
};

/**
 * Find movies by their name of part of their name
 * Case insensitive
 * @param name
 * @param cb
 */
var findMovies = function (name, cb) {
    commitQuery("SELECT * FROM Movie WHERE name COLLATE UTF8_GENERAL_CI LIKE '?%';", [name], cb);
};

/**
 * Delete a reservation from the database
 * @param idUser
 * @param idReservation
 * @param cb
 */
var deleteBooking = function(idUser, idReservation, cb) {
    // ebin callback hell
    commitQuery("SELECT * FROM Reservation WHERE idReservation = ?;", [idReservation], function (err, res) {
        if(err) {
            cb("Failed");
        } else {
            if(res.length !== 1) {
                console.error("Invalid number of Reservations were returned: " + res.length);
                cb("Failed");
            } else {
                // one reservation was found
                if(res[0].idUser !== idUser) {
                    // someone tried to delete other user's reservation
                    console.error("WARNING: User " + idUser + " tried to delete reservation " + idReservation + " by user " + res[0].idUser);
                    cb("Failed");
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
var getScreeningsByDate = function (datestart, dateend, cb) {
    commitQuery("SELECT * FROM Screening WHERE DATE(time) BETWEEN ? AND ?;", [datestart, dateend], cb);
};

var getUserBookings = function (idUser, cb) {
    commitQuery("SELECT * FROM Booking WHERE idUser = ?", [idUser], cb);
};

var getScreeningBookings = function (idScreening, cb) {
    commitQuery("SELECT * FROM Booking WHERE idScreening = ?;", [idScreening], cb);
};

/**
 * Check if user exists in database
 * @param name
 * @param cb
 */
var userExists = function(name, cb) {
    let query = "SELECT name FROM User WHERE name = ?;";
    commitQuery(query, [name], function (err, res) {
        if(err){
            cb(err);
        } else {
            if(res.length > 0) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        }
    })
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

/**
 * Utility function, to encrypt pwd with SHA256
 * @param pwd
 * @returns {string} encrypted pwd in base64
 */
function encryptPwd(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('base64');
}

/**
 * Read system line
 * @param cb
 */
function readLine(cb) {
    var stdin = process.openStdin();
    stdin.addListener("data", function(data) {
        cb(data.toString().trim());
    })
}

/**
 * User authentication system
 * @param name
 * @param passwd
 * @param cb Callback, result is true if authentication was successful, false if given password was wrong
 */
var authenticateUser = function(name, passwd, cb) {
    let query = "SELECT password FROM User WHERE name = ?;";
    commitQuery(query, [name], function (err, res) {
        if(err) {
            console.error("Login failed: " + err);
            cb(err);
        } else {
            // encrypt password
            var encpwd = encryptPwd();
            if(encpwd === res[0].password) {
                // authentication successfull
                cb(null, true);
            } else {
                // wrong password
                cb(null, false);
            }
        }
    });
};

// console.log("Everything up, add new movie");
// readLine(function (data) {
//     admin_addMovie(data, null, (err, res) => {
//         if(err) console.error(err);
//         console.log(res);
//     })
// });

getMovie(1, (err, res) => {
    console.log(res);
});

// define the exported API
module.exports = {

    // admin API
    admin: {
        deleteMovie: admin_deleteMovie,
        addTheater: admin_addTheater,
        addMovie: admin_addMovie,
        deleteTheather: admin_deleteTheater,
        addScreening: admin_addScreening,
        deleteScreening: admin_deleteScreening,
        cleanup: admin_cleanup,
    },

    // connection control
    closeConnection,

    // regular API
    authenticateUser,
    createUser,
    deleteUser,
    updateUser,
    userExists,

    // screenings
    getScreenings,
    getScreeningsByDate,
    getAllScreenings,
    getMovieScreenings,
    getScreeningsByTheaterMovie,

    // bookings
    getBookings,
    deleteBooking,
    createBooking,
    getScreeningBookings,
    getUserBookings,

    // movies
    getMovie,
    getMovies,
    findMovies,

    // theaters
    getThreaters,

    // seats
    getReservedSeats,
    getAuditoriumSeats,

};
