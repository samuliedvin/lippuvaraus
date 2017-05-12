/**
 * Created by samlin on 10-May-17.
 */
'use strict';

const db = require('./databaseconnector');
const express = require('express')
const authentication = require('express-authentication');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// public files
app.use(express.static('public'));
app.use('/images', express.static('backend/images'));
app.use(session({ secret: 'turunyliopisto', cookie: { maxAge: 30 * 1000 * 60 }}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/**
 * Allow CORS requests from other hosts
 */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Check authentication if trying to access secure page
 */
app.use(function(req, res, next) {
    console.log('checkAuth ' + req.url);
    if (/.*\/admin.*/.test(req.url) && (!req.session || !req.session.authenticated)) {
        res.status(403).send('YOU SHALL NOT PASS');
        return;
    }
    next();
});

/**
 * Serve admin panel
 */
app.get('/admin', function (req, res) {
    res.sendfile('backend/public/adminpanel.html');
});

/**
 * Serve login page
 */
app.get('/login', function (req, res) {
    res.sendfile('backend/public/login.html');
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});

/**
 * Handle login request
 */
app.post('/login', function(req, res) {
    console.log(req.body);
    if (req.body.user && req.body.user === 'admin' && req.body.pwd && req.body.pwd === 'admin') {
        req.session.authenticated = true;
        res.redirect('/admin');
    } else {
        res.status(401).send('Username and/or password are incorrect');
    }
});

/**
 * Handle admin tool edit requests
 */
// todo AUTHENTICATION
app.get('/admin/:request/:method', function (req, res) {

    // ensure there's a database connection
    db.getConnection();

    let response = {};
    let table = req.params.request,
        method = req.params.method;
    switch (table) {
        case 'movies':
            if(method === 'GET') {
                db.getMovies((err, response) => {
                    if (err) {
                        console.error(err);
                    }
                    res.json(response);
                });
            } else if (method === 'DELETE') {
                db.deleteMovie(req.query.id, function() {
                    console.log('Removed movie ' + req.query.id);
                    res.json({status: 'OK'});
                });
            } else if (method === 'PUT') {
                db.admin.addMovie(req.query.name, null, (err, response) => {
                    if(err)
                        console.error(err);
                    console.log('Movie added to database');
                    res.json({status: 'OK'});
                });
            }
            break;
        case 'screenings':
            if(method === 'GET') {
                db.getScreenings((err, response) => {
                    if (err) {
                        console.error(err);
                    }
                    res.json(response);
                });
            } else if (method === 'DELETE') {
                db.deleteMovie(req.query.id, function() {
                    console.log('Removed screening ' + req.query.id);
                    res.json({status: 'OK'});
                });
            } else if (method === 'PUT') {
                db.admin.addScreening(req.query.idMovie, req.query.time, req.query.idAuditorium, (err, response) => {
                    if(err)
                        console.error(err);
                    console.log('Screening added to database');
                    res.json({status: 'OK'});
                });
            }
            break;
        case 'theaters':
            if(method === 'GET') {
                db.getTheaters((err, response) => {
                    if (err) {
                        console.error(err);
                    }
                    res.json(response);
                });
            } else if (method === 'DELETE') {
                db.admin.generalQuery("DELETE FROM Theater WHERE idTheater = ?;", [req.query.id], function() {
                    console.log('Removed theater ' + req.query.id);
                    res.json({status: 'OK'});
                });
            } else if (method === 'PUT') {
                db.admin.addTheater(req.query.name, null, (err, response) => {
                    if(err)
                        console.error(err);
                    console.log('Theater added to database');
                    res.json({status: 'OK'});
                });
            }
            break;
        case 'seats':
            if(method === 'GET') {
                db.getSeats((err, response) => {
                    if (err) {
                        console.error(err);
                    }
                    res.json(response);
                });
            } else if (method === 'DELETE') {
                db.deleteMovie(req.query.id, function() {
                    console.log('Removed seat ' + req.query.id);
                    res.json({status: 'OK'});
                });
            } else if (method === 'PUT') {
                db.admin.addSeat(req.query.row, req.query.number, req.query.idAuditorium, (err, response) => {
                    if(err)
                        console.error(err);
                    console.log('Seat added to database');
                    res.json({status: 'OK'});
                });
            }
            break;
        case 'users':
            if(method === 'GET') {
                db.getUsers((err, response) => {
                    if (err) {
                        console.error(err);
                    }
                    res.json(response);
                });
            } else if (method === 'DELETE') {
                db.deleteUser(req.query.id, function() {
                    console.log('Removed user ' + req.query.id);
                    res.json({status: 'OK'});
                });
            } else if (method === 'PUT') {
                db.createUser(req.query.name, req.query.email, req.query.password, (err, response) => {
                    if(err)
                        console.error(err);
                    console.log('User ' + req.query.name + " added to database");
                    res.json({status: 'OK'});
                });
            }
            break;
        case 'bookings':
            if(method === 'GET') {
                db.getBookings((err, response) => {
                    if (err) {
                        console.error(err);
                    }
                    res.json(response);
                });
            } else if (method === 'DELETE') {
                db.admin.generalQuery("DELETE FROM Bookings WHERE idBooking = ?;", [req.query.id], function() {
                    console.log('Removed user ' + req.query.id);
                    res.json({status: 'OK'});
                });
            } else if (method === 'PUT') {
                db.createBooking(req.query.idUser, req.query.idScreening, req.query.idSeat, (err, response) => {
                    if(err)
                        console.error(err);
                    console.log('User ' + req.query.name + " added to database");
                    res.json({status: 'OK'});
                });
            }
            break;
        case 'auditoriums':
            if(method === 'GET') {
                db.getAuditoriums((err, response) => {
                    if (err) {
                        console.error(err);
                    }
                    res.json(response);
                });
            } else if (method === 'DELETE') {
                db.admin.generalQuery("DELETE FROM Auditorium WHERE idAuditorium = ?;", [req.query.id], function() {
                    console.log('Removed auditorium ' + req.query.id);
                    res.json({status: 'OK'});
                });
            } else if (method === 'PUT') {
                db.admin.generalQuery("INSERT INTO Auditorium(idTheater) VALUES(?);", [req.query.idTheater], (err, response) => {
                    if(err)
                        console.error(err);
                    console.log('Auditorium added to database');
                    res.json({status: 'OK'});
                });
            }
            break;
        default:
            console.error('Invalid admin query ' + req.params.request);
    }
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Listening to port ' + port);
});
