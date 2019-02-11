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
            $(this).addClass('input__animate--animated');
            $(this).siblings('.placeholder__animate').addClass('placeholder__animate--animated');
            $(this).siblings('.input__show').show();
            $(this).siblings('.input__clear').show();

        }

        else {
            $(this).removeClass('input__animate--animated');
            $(this).siblings('.placeholder__animate').removeClass('placeholder__animate--animated');
            $(this).siblings('.input__show').hide().addClass('icon-svg--eye-closed').removeClass('icon-svg--eye-opened');
            $(this).siblings('.input__clear').hide();

        }
        return false;
    });

    $('.input__show').on('click', function () {
        if ($(this).hasClass('icon-svg--eye-closed')) {
            $(this).siblings('input').attr('type', 'text');
            $(this).addClass('icon-svg--eye-opened').removeClass('icon-svg--eye-closed');
        } else {
            $(this).siblings('input').attr('type', 'password');
            $(this).addClass('icon-svg--eye-closed').removeClass('icon-svg--eye-opened');
        }
        return false;
    });
    $('.input__clear').on('click', function () {
        $(this).siblings('input').val(" ");

        if ($(this).siblings('input').val().trim()) {
            // $(this).removeClass('hidden');
        }

        else {
            // $(this).addClass('hidden');
        }
        return false;
    });

});

//autocomplete fix

if( navigator.userAgent.match(/(iPod|iPhone|iPad)/)){
    window.setInterval(function(){
        $('input:-webkit-autofill').each(function(){
            var clone = $(this).clone(true, true);
            $(this).after(clone).remove();
        });
    }, 20);
}