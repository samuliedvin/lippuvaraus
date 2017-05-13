$(function() {
    $("#submitMovieSearch").click(function(e) {
        e.preventDefault();
        var data = $("#searchForm").serialize();
        $.post('/search', data, function(resp) {
            movieListing.updateView(resp.movies);
        });
    });
});


$(function() {
    $("#getScreeningInfo").click(function(e) {
        e.preventDefault();

        var screening;

        $.get('/getScreeningInfo/' + movie, data, function(resp) {

        })
    })
})
