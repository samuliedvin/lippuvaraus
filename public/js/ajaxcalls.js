$(document).ready(function($) {
    $("button").click(function(e) {
        var target = $(e.target);
        // $("#reservation-modal .modal-body").html('Halusit tehdä varauksen elokuvaan ' + e.target.id);
    })
})

$(function() {
    $("#submit").click(function(e) {
        e.preventDefault();
        var data = $("#searchForm").serialize();
        console.log("dick");
        $.post('/search', data, function(resp) {
            var foo = JSON.stringify(resp);
            $("#searchresult").html("<h2>" + resp.message + "</h2>");
        });
    });
});
