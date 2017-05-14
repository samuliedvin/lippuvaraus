$(document).ready(function($) {
    $("button").click(function(e) {
        var target = $(e.target);
        $("#reservation-modal .modal-body").html('Halusit tehdä varauksen elokuvaan ' + e.target.id);
    })
})
