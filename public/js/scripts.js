"use strict";

// screening currently selected
var _selectedScreening = undefined;
var _seats = [];

/**
 * Validate login input and validate user
 */
function loginUser() {
    let name = document.forms.login.name.value;
    let pwd = document.forms.login.pwd.value;
    let result = true;
    if(!(name && pwd))
        result = false;
    if(!result) {
        bootbox.alert('Kentät eivät voi olla tyhjiä');
    } else {
        doAjaxPOST('/login',
            'name='+name+'&pwd='+pwd,
            function (res) {
                if(res.status === 'OK')
                    bootbox.alert('Kirjautuminen onnistui', () => {location.reload()});
                else
                    bootbox.alert('Kirjautuminen epäonnistui');
            }
        );
    }
    // prevent submit
    return false;
}

/**
 * Validate password confirmation
 */
function registerUser(event) {
    let name = document.forms.register.name.value;
    let email = document.forms.register.email.value;
    let pwd1 = document.forms.register.pwd1.value;
    let pwd2 = document.forms.register.pwd2.value;
    let result = (pwd1 === pwd2);
    if(!(name && email && pwd1 && pwd1))
        result = false;
    if(!result) {
        bootbox.alert('Salasanat eivät täsmää tai kenttä tyhjä');
    } else {
        doAjaxPOST('/register',
            'name='+name+'&email='+email+'&pwd='+pwd1,
            function (res) {
                if(res.status === 'OK')
                    bootbox.alert('Rekisteröinti onnistui', () => location.reload());
                else
                    bootbox.alert('Rekisteröinti epäonnistui');
            }
        );
    }
    // prevent submit
    return false;
}

/**
 * Cancel a booking
 * @param idBooking{number} id of the booking
 */
function cancelBooking(idBooking) {
    doAjax('booking/delete/'+idBooking, function(res) {
        if(res.status === 'OK') {
            bootbox.alert('Varaus peruttu', () => location.reload());
        } else {
            bootbox.alert('Varauksen peruminen epäonnistui');
        }
    });
}

function createBooking(idScreening, idSeat){
    doAjaxPOST('/booking/create/',
        'screening='+idScreening+'&seat='+idSeat,
        function(res) {
        if(res.status === 'OK') {
            bootbox.alert('Varaus tehty', () => location.reload());
        } else {
            bootbox.alert('Varauksen tekeminen epäonnistui');
        }
    });
}

// DOM elements
var _masterMovieElement = document.getElementById('masterMovieElement');
var _movieListElement = document.getElementById('movielist');
var _masterReservationElement = document.getElementById('mastervaraus');
var _reservationListElement = document.getElementById('reservationlistelement');

/**
 * Create a new movie element dynamically based on the master
 * @param {object} movie The movie object, containing data from db
 * @param screenings{Array} Array of screening objects related to this movie
 */
function createMovieElement(movie, screenings) {
    let newElement = _masterMovieElement.cloneNode(true);
    newElement.id = '';
    newElement.classList.add('dynamicMovie');
    // add image url
    let imageThumb = newElement.getElementsByClassName('movie-img')[0];
    imageThumb.style.background = "url('" + movie.imageurl + "') center";
    imageThumb.style.backgroundSize = 'cover';
    // title
    newElement.getElementsByTagName('h3')[0].textContent = movie.title;

    let screeningsListElem = newElement.getElementsByClassName('screenings')[0];

    // list screenings as links
    screenings.forEach((sc) =>
    {
        screeningsListElem.appendChild(createScreeningElement(sc))
    });

    _movieListElement.appendChild(newElement);

    newElement.style.display = 'block';

    function createScreeningElement(screening) {
        let tempElem = document.createElement('a');
        tempElem.textContent = screening.theaterName + ': ' + screening.time.toString().slice(0, 10);
        tempElem.onclick = function() {
            createBooking(screening.idScreening, 72 + ~~(Math.random() * 10)* 10);
        };
        return tempElem;
    }
}

/**
 * Open booking modal for a screening
 * @param idScreening
 */
function openBooking(idScreening) {
    doAjax('seats/' + idScreening, function(res) {
        if(!res || res.status === 'failed' || res.constructor === Array) {
            console.error('Failed to fetch seats for screening ' + idScreening);
            return;
        }

        // succeeded to fetch seats
        _selectedScreening = idScreening;

    });
}

/**
 * Clear all movies from DOM
 */
function clearList() {
    while(_movieListElement.firstChild) {
        _movieListElement.removeChild(_movieListElement.firstChild);
    }
}

/**
 * Update the movie list
 */
function updateList(movielist, screenings, screeningFilter) {

    // Empty DOM
    clearList();

    // Get every movie by default
    movielist.forEach((m) => {

        // get movie specific screenings
        let movieScreenings = screenings.filter((screening) =>
            {
                if(screening.idMovie !== m.idMovie)
                    return false; // don't get other movie's screenings

                if(screeningFilter)
                    return screeningFilter(screening) // filter by given function
                else
                    return true; // if null select all
            }
        );

        // don't show movies with no screenings
        if(movieScreenings && movieScreenings.length > 0)
            createMovieElement(m, movieScreenings);
    });
}

/**
 * Send POST request
 * @param url
 * @param params
 * @param cb
 */
function doAjaxPOST(url, params, cb) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4) {
            if(cb)
                cb(JSON.parse(this.responseText));
        }
    };
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);
}

function doAjax(url, cb) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4) {
            if(cb)
                cb(JSON.parse(this.responseText));
        }
    };

    xhttp.open('GET', 'http://localhost:8080/'+url, true);
    xhttp.send();
}

// /**
//  * Filter movies
//  * @param func Function that handles movie entry, returns true if movie should be selected
//  */
// function filterMovies(func) {
//     let newList = [];
//     if(movies) {
//         movies.forEach(
//             (movie) => {
//                 if(func(movie)) {
//                     newList.push(movie);
//                 }
//             }
//         );
//         movies = newList;
//     }
// }

// update both filters
function applyMovieFilters() {
    let tempList = filterByDate(_screeningsList);
    tempList = filterByTheater(tempList);
    updateList(_movieList, tempList);
}


/**
 * Filter screenings by date
 * @param screeningsList
 * @returns {Array} Array of filtered screening objects
 */
function filterByDate(screeningsList) {
    let newList = [];
    let element = document.getElementById('daypicker');
    let date = element.options[element.selectedIndex].value;

    // show all
    if(!date || (date === "-1")) {
        return screeningsList;
    }

    screeningsList.forEach((s) => {
        if(s.date === date)
            newList.push(s);
    });

    return newList;
}

/**
 * Filter screenings by selected theater
 * @param screeningsList
 * @returns {Array} Array of filtered screening objects
 */
function filterByTheater(screeningsList) {
    let newList = [];
    let element = document.getElementById('theaterpicker');
    let theaterId = +element.options[element.selectedIndex].value;

    // show all
    if(!theaterId || (theaterId === -1)) {
        return screeningsList;
    }

    screeningsList.forEach((s) => {
        if(s.idTheater === theaterId)
            newList.push(s);
    });

    return newList;
}

// Initially show all movies from DB
updateList(_movieList, _screeningsList);