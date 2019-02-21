// $('.addarticle').click(function() {
//     $('#articlemaker').toggleClass('hidden');
// });

$(document).ready(function() {
    $.post("/articles",{from: 0}, function(data, status){
        console.log(data)
    });
});