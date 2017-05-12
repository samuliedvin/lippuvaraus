

const dataContainer = document.getElementById('oikea');

var _curPage = undefined;

/**
 * Clear all data nodes (DOM elements)
 */
function clearDataFields() {
    while(dataContainer.firstChild) {
        dataContainer.removeChild(dataContainer.firstChild);
    }
}

/**
 * Create a new data edit element
 * Id is the database ID
 * Values is an array of objects which have properties name and value
 */
function createEditElement(id, values) {
    // main containing element into which other nodes are appended
    let containerElement = document.createElement('div');
    containerElement.classList.add('data-container');

    // create text element for the id
    let idElem = document.createElement('span');
    idElem.appendChild(document.createTextNode(id));
    containerElement.appendChild(idElem);

    // create input elements for editing the fields
    for(let i = 0; i < values.length; i++) {
        let newDataField = document.createElement('input');
        newDataField.type = 'text';
        newDataField.placeholder = values[i].name;
        newDataField.value = values[i].value;
        containerElement.appendChild(newDataField);
    }

    // create buttons
    let updateButton = document.createElement('input');
    updateButton.value = 'UPDATE';
    updateButton.type = 'button';
    let deleteButton = document.createElement('input');
    deleteButton.value = 'DELETE';
    deleteButton.type = 'button';
    deleteButton.onclick = function() {
        removeEntry(id);
    };

    // append buttons to the end
    containerElement.appendChild(updateButton);
    containerElement.appendChild(deleteButton);

    return containerElement;
}

/**
 * Reload page after update
 */
function reload() {
    getData(_curPage);
}

function newEntry() {
    let values = {};
    switch(_curPage) {
        case 'movies':
            values.name = window.prompt('Elokuvan nimi');
            doRequest(_curPage, (res) => {
                window.alert('Movie added to database');
                reload();
            }, 'PUT', values);
            break;
        case 'screenings':
            values.idMovie = window.prompt('Elokuvan ID');
            values.time = window.prompt('Näytöksen aika YYYY-MM-DD HH-MM-SS');
            values.idAuditorium = window.prompt('Salin ID');
            doRequest(_curPage, (res) => {
                window.alert('Screening added to database');
                reload();
            }, 'PUT', values);
            break;
        case 'bookings':
            values.idUser = window.prompt('Käyttäjän ID');
            values.idScreening = window.prompt('Näytöksen ID');
            values.idSeat = window.prompt('Paikan ID');
            doRequest(_curPage, (res) => {
                window.alert('Booking added to database');
                reload();
            }, 'PUT', values);
            break;
        case 'seats':
            values.idAuditorium = window.prompt('Salin ID');
            values.row = window.prompt('Rivin numero');
            values.number = window.prompt('Paikan numero');
            doRequest(_curPage, (res) => {
                window.alert('Seat added to database');
                reload();
            }, 'PUT', values);
            break;
        case 'auditoriums':
            values.idTheater = window.prompt('Teatterin ID');
            doRequest(_curPage, (res) => {
                window.alert('Auditorium added to database');
                reload();
            }, 'PUT', values);
            break;
        case 'theaters':
            values.name = window.prompt('Teatterin nimi');
            doRequest(_curPage, (res) => {
                window.alert('Theater added to database');
                reload();
            }, 'PUT', values);
            break;
        case 'users':
            values.name = window.prompt('Käyttäjän nimi');
            values.email = window.prompt('Käyttäjän email');
            values.password = window.prompt('Käyttäjän salasana');
            doRequest(_curPage, (res) => {
                window.alert('User added to database');
                reload();
            }, 'PUT', values);
            break;
        default:
            window.alert('Valitse taulu ensin');
    }
}

/**
 * Remove entry
 */
function removeEntry(id) {
    doRequest(_curPage, function(res) {
        window.alert('Entry ' + id + ' from table ' + _curPage + ' removed');
        reload();
    }, 'DELETE', {id: id});
}

var linkkireferenssit;
function setHighlight(name) {
    function getRef(id, name) {
        linkkireferenssit[name] = document.getElementById(id);
    }
    function setOff() {
        for(let i in linkkireferenssit) {
            if(linkkireferenssit.hasOwnProperty(i)) {
                console.log(i + " " + linkkireferenssit['movies']);
                linkkireferenssit[i].classList.remove('active');
            }
        }
    }
    if(!linkkireferenssit) {
        linkkireferenssit = {};
        getRef('elokuvat', 'movies');
        getRef('paikat', 'seats');
        getRef('salit', 'auditoriums');
        getRef('varaukset', 'bookings');
        getRef('kayttajat', 'users');
        getRef('naytokset', 'screenings');
        getRef('teatterit', 'theaters');
        console.log(linkkireferenssit.length + " " + linkkireferenssit['movies'].style.classList);
    }
    // set all else off
    setOff();
    linkkireferenssit[name].classList.add('active');
}

/**
 * Get data from backend and create respective elements
 */
function getData(table) {

    // show new button
    if(!_curPage)
        document.getElementById('newBtn').style.visibility = 'visible';
    setHighlight(table);

    // remember page
    _curPage = table;

    clearDataFields();
    switch (table) {
        case 'movies':
            doRequest('movies', function (data) {
                data.forEach((movie) => {
                    dataContainer.appendChild(createEditElement(movie.idMovie,
                        [
                            {name: 'title', value: movie.title}
                        ]));
                });
            });
            break;
        case 'screenings':
            doRequest('screenings', function (data) {
                data.forEach((screening) => {
                    dataContainer.appendChild(createEditElement(screening.idScreening,
                        [
                            {name: 'idMovie', value: screening.idMovie},
                            {name: 'time', value: screening.time},
                            {name: 'idAuditorium', value: screening.idAuditorium},
                        ]));
                });
            });
            break;
        case 'users':
            doRequest('users', function (data) {
                data.forEach((user) => {
                    dataContainer.appendChild(createEditElement(user.idUser,
                        [
                            {name: 'name', value: user.name},
                            {name: 'email', value: user.email}
                        ]));
                });
            });
            break;
        case 'auditoriums':
            doRequest('auditoriums', function (data) {
                data.forEach((auditorium) => {
                    dataContainer.appendChild(createEditElement(auditorium.idAuditorium,
                        [
                            {name: 'idTheater', value: auditorium.idTheater}
                        ]));
                });
            });
            break;
        case 'bookings':
            doRequest('bookings', function (data) {
                data.forEach((booking) => {
                    dataContainer.appendChild(createEditElement(booking.idBooking,
                        [
                            {name: 'idUser', value: booking.idUser},
                            {name: 'idScreening', value: booking.idScreeening},
                            {name: 'idSeat', value: booking.idSeat}
                        ]));
                });
            });
            break;
        case 'seats':
            doRequest('seats', function (data) {
                data.forEach((seat) => {
                    dataContainer.appendChild(createEditElement(seat.idSeat,
                        [
                            {name: 'row', value: seat.row},
                            {name: 'number', value: seat.number},
                            {name: 'idAuditorium', value: seat.idAuditorium}
                        ]));
                });
            });
            break;
        case 'auditoriums':
            doRequest('auditoriums', function (data) {
                data.forEach((auditorium) => {
                    dataContainer.appendChild(createEditElement(auditorium.idAuditorium,
                        [
                            {name: 'idTheater', value: auditorium.idTheater},
                        ]));
                });
            });
            break;
        case 'theaters':
            doRequest('theaters', function (data) {
                data.forEach((theater) => {
                    dataContainer.appendChild(createEditElement(theater.idTheater,
                        [
                            {name: 'name', value: theater.name}
                        ])
                    );
                });
            });
            break;
    }
}

/**
 * Do a AJAX request to backend, requesting the table row data
 * @param url
 * @param callback
 */
function doRequest(url, callback, method, values) {
    method = method || 'GET';
    let xhttp = new XMLHttpRequest();
    let query = '';
    if(values) {
        query = '?';
        for(let i in values) {
            if(values.hasOwnProperty(i)) {
                query += i + '=' + values[i] + '&';
            }
        }
    }
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            callback(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", 'http://localhost:3000/admin/' + url + '/' + method + query, true);
    xhttp.send();
}