$(document).ready(function () {
    //validate form
    $("#regForm").validate({
        rules: {
            password: {
                required: true,
                minlength: 4
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            password: {
                required: "Заполните поле",
                minlength: jQuery.validator.format("Неверный пароль")
            },
            email: {
                required: "Заполните поле",
                email: jQuery.validator.format("Введите email")

            }
        }
    });


//submit disable

    $("input:radio, input:checkbox").change(
        function () {
            if ($(this).is(":checked")) {
                $('input[type="submit"]').removeAttr("disabled");
            }
            else {
                $('input[type="submit"]').attr("disabled", "disabled");
                console.log(1)

            }


        }
    );


//input animate
    $('.input__animate').on('keyup', function () {
        if ($(this).val().trim()) {
            $(this).addClass('input__animate_animated');
            $(this).siblings('.placeholder__animate').addClass('placeholder__animate_animated');
        }

        else {
            $(this).removeClass('input__animate_animated');
            $(this).siblings('.placeholder__animate').removeClass('placeholder__animate_animated');

        }
        return false;
    });


});

//autocomplete fix

if(navigator.userAgent.toLowerCase().indexOf("chrome") >= 0 || navigator.userAgent.toLowerCase().indexOf("safari") >= 0){
    window.setInterval(function(){
        $('input:-webkit-autofill').each(function(){
            var clone = $(this).clone(true, true);
            $(this).after(clone).remove();
        });
    }, 20);
}