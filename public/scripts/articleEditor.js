$(document).ready(function () {
    $('.submit-button').click(function () {
        let articleName = document.getElementById('articleName').value;
        let articleText = document.getElementById('articleText').innerHTML;
        // let articlePic = document.getElementById('pic').value;
        // let formData = new FormData();
        // console.log(formData);
        // formData.append('articlename', articleName);
        // formData.append('articletext', articleText);
        // formData.append('articleimage', articlePic);
        // console.log(formData.articlename);
        // $("#articleForm").submit(function(e) {
            var formData = new FormData();
            var articleimage = $('#pic')[0].files[0];
            formData.append('articleimage', articleimage);
            console.log(formData);
            
            $.ajax({
                url: "/newarticle",
                type: "POST",
                processData: false,
                ContentType: false,
                data: {
                    'articlename': articleName,
                    'articletext': articleText,
                    formData
                },
                success: function () {
                    alert('done');
                }
            });
        // });

        // $.post("/newarticle", {
        //     'articlename': articleName,
        //     'articletext': articleText,
        //     'articleimage': articlePic
        // }, function (data, status) {
        //     alert('done');
        // });

    });
});