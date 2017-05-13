// app/routes.js
var fs  = require('fs');



module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('/', function(req, res) {
        var movies = JSON.parse(fs.readFileSync('./app/movies.json', 'utf8'));
        var theaters = JSON.parse(fs.readFileSync('./app/theaters.json', 'utf8'));

        if (req.user) {
            // logged in
            res.render('index.ejs', {
                movies : movies,
                theaters : theaters,
                user : req.user
            });
        } else {
            // not logged in
            res.render('index.ejs', {
                movies : movies,
                theaters : theaters,
                user : null
            });
        }
    })

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {



        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/userReservations', function(req, res) {
        var reservations = [
            {
                movie : 'La la land',
                screeningTime : '14.6.2017 19:00:00',
                theater : 'Finnkino',
                auditorium : 'Sali 3'
            },
            {
                movie : 'Captain America',
                screeningTime : '16.6.2017 19:00:00',
                theater : 'Julia',
                auditorium : 'Sali 4'
            }
        ]; // some test data

        return res.send({
            reservations : reservations
        })
    })

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
       req.logout();
       res.redirect('/');
    });


    // MOVIE search

    app.post('/search', function(req, res) {
        var movies = JSON.parse(fs.readFileSync('./app/movies.json', 'utf8'));
        return res.send({
            movies : movies,
        });
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
