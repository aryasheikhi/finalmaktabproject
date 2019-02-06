$(document).ready(function() {
    $('#error').html('');
    $('.submitbutton').click(function() {
        let empty = [];        
        $('input[type=text]').each(function() {
            if (this.value === '') {
                empty.push(this.name);
            }
        });
        console.log(empty);
        if (empty.length > 0) {
            $('#error').html('لطفا فیلدها را پر کنید');
        } else {
            if (($('#password').val() === '') || ($('#password2').val() === '')) {
                $('#error').html('لطفا فیلدها را پر کنید');
            } else if ( ($('#password').val() !== $('#password2').val()) ) {
                $('#error').html('دو رمز عبور برابر نیستند');
            } else if ( $('#password').val().length < 6 ) {
                $('#error').html('رمز عبور باید بیش‌تر از ۵ کاراکتر باشد');
            } else if ( $('#phone').val() === '') {
                $('#error').html('لطفا فیلدها را پر کنید');
            } else if ($('input[type=file]').val() === '') {
                $('#error').html('لطفا تصویر خود را انتخاب کنید');
            } else {
                let allowSubmit = false
                $('input[type=radio]').each(function() {
                    if (this.checked === true) {
                        allowSubmit = true
                    }
                });
                if (allowSubmit === false) {
                    $('#error').html('لطفا جنسیت را تعیین کنید');
                } else {
                    $('#signupform').submit();
                }
            }
        }
    });
});


// $(document).ready(function() {
//     $('.namebutton').click(function() {
//         let empty = 0;
//         $('#namecontainer').children('input').each(function(){
//             if (this.value === "") {
//                 empty++;
//             } 
//         });
//         if (empty !== 0) {
//             $('#error').removeClass('hidden');
//         } else {
//             $('#error').addClass('hidden');
//             $('#usernamecontainer').toggleClass('hidden');
//             $('#namecontainer').addClass('hidden');
//         }
//     });
//     $('.usernamebutton').click(function() {
//         let empty = 0;
//         $('#usernamecontainer').children('input').each(function() {
//             if (this.value === '') {
//                 empty++;
//             }
//         });
//         if (empty !== 0) {
//             $('#error').removeClass('hidden');
//         } else {
//             $('#error').addClass('hidden');
//             $('#usernamecontainer').addClass('hidden');
//             $('#passwordcontainer').removeClass('hidden');
//         }
//     });
//     $('.passwordbutton').click(function() {
//         let empty = 0;
//         $('#passwordcontainer').children('input').each(function() {
//             if (this.value === '') {
//                 empty++;
//             }
//         });
//         if (empty !== 0) {
//             $('#error').removeClass('hidden');
//         } else {
//             if ($('#passwordone').val() !== $('#passwordtwo').val()) {
//                 $('#error').html('دو رمز عبور برابر نیستند');
//                 $('#error').removeClass('hidden');
//             } else {
//                 if ($('#passwordone').val().length <= 5) {
//                     $('#error').html('رمز عبور باید بیش‌تر از ۵ کاراکتر باشد');
//                     $('#error').removeClass('hidden');
//                 } else {
//                     $('#error').addClass('hidden');
//                     $('#passwordcontainer').addClass('hidden');
//                     $('#avatarandsexcontainer').removeClass('hidden');
//                 }
//             }
//         }
//     });
//     $('.submitbutton').click(function() {
//         console.log('111');
        
//         if ($('input[type=file]').val() === '') {
//             $('#error').html('لطفا تصویر خود را انتخاب کنید');
//             $('#error').removeClass('hidden');
//         } else {
//             let allowSubmit = false
//             $('input[type=radio]').each(function() {
//                 if (this.checked === true) {
//                     allowSubmit = true
//                 }
//             });
//             if (allowSubmit === false) {
//                 $('#error').html('لطفا جنسیت را تعیین کنید');
//                 $('#error').removeClass('hidden');
//             } else {
                
//                 $('#signupform').submit();
//             }
//         }
//     });
// });
