$(document).ready(function() {
    let username = document.getElementById('username').value;
    let newPassword = document.getElementById('newPassword').value;
    let firstName = document.getElementById('fname').value;
    let lastName = document.getElementById('lname').value;
    let mobile = document.getElementById('mobile').value;
    $('#profileEditButton').click(function() {
        // if ($('#profileEditButton').val() === 'تغییر') {
        //     $('div.editor').attr('contenteditable','true');
        //     $('#profileEditButton').attr('value','ثبت');
        // } else {
        //     $('div.editor').attr('contenteditable','false');
        //     $('#profileEditButton').attr('value','تغییر');
        // }
        $.post('/editInfo',{
                'username': username,
                'password': newPassword,
                'firstName': firstName,
                'lastName': lastName,
                'mobile': mobile
            }, function(response) {
                console.log(response);
                
            }
        );
    });
    $('#profileDone').click(async function() {
        let userNewData = [ username, password, firstName, lastName, mobile ];
        userNewData.forEach(data => {
            console.log(data);
        });
        // $.post('/editInfo',{
        //         'username': username,
        //         'password': password,
        //         'firstName': firstName,
        //         'lastName': lastName,
        //         'mobile': mobile
        //     }, function(response, status) {
                
        //     }
        // );
    });
});