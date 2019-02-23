$(document).ready(async function() {
    $.post("/articles", {from: 0}, function(data, status) {
        console.log(data);
        for(let i = 0; i <= 10; i++) {
            $('#articleHolder').append(
                '<div class="card col-8 article">'
                + '<div class="img-holder">'
                + '<img src="/images/Pencil-Old-Letter-Paper-Background-Writing-1995005.jpg" class="card-img-top" alt="send a photo to be placed here" style="filter:brightness(50%);">'
                + '<div class="article-header">'
                + '<h3>' + data.articles[0].name + '</h3></div></div>'
                + '<div class="card-body">'
                + '<p class="card-text">' + data.articles[0].text + '</p></div></div>'
            );

        }
    });
});