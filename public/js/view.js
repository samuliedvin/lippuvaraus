// /public/js/view.js
var screeningInfo = {
    updateView : function(movie) {

    }
}

var userReservations = {
    // We'll get the reservations back when we make ajax request this page
    showReservations : function(reservations) {
        var container = document.getElementById('userReservations');
        reservations.forEach(function (reservation) {
            var reservationCard = document.createElement('div');
            var reservationInfo = document.createElement('div');

            reservationCard.className = 'movie-card';

            console.log(reservation);

            for (var property in reservation) {
                var propertyText = document.createElement('p');
                propertyText.textContent = reservation[property];
                reservationInfo.appendChild(propertyText);
            };

            reservationCard.appendChild(reservationInfo);
            container.appendChild(reservationCard);
        }, this);
    }
}

var movieListing = {
    updateView : function(movies) {
        var container = document.getElementById('searchResult');

        movies.forEach(function (movie, position) {
            var movieCard = document.createElement('div');
            var movieImg = document.createElement('div');
            var movieInfo = document.createElement('span');

            movieCard.className = 'movie-card';
            movieImg.className = 'movie-img';
            movieInfo.className = 'movie-info';

            if (movie.imgsrc) movieImg.style.backgroundImage = "url('" + movie.imgsrc + "')";

            var title = document.createElement('h3');
            var info = document.createElement('p');

            title.innerHTML = movie.tit;
            info.innerHTML = movie.grs;

            movieInfo.appendChild(title);
            movieCard.appendChild(movieImg);
            movieCard.appendChild(movieInfo);
            movieCard.appendChild(this.createReservationButton(movie));
            container.appendChild(movieCard);

        }, this)
    },

    createReservationButton : function(movie) {
        var reservationButton = document.createElement('button');
        reservationButton.className = 'btn btn-warning btn-lg';
        reservationButton.style.verticalAlign = 'bottom';
        reservationButton.setAttribute("data-toggle", "modal");
        reservationButton.setAttribute("data-target", "#reservation-modal");
        reservationButton.textContent = "Varaa";
        return reservationButton;
    }
}
