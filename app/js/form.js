$(document).ready(function () {
    // validate form
    // $("#regForm").validate({
    //     rules: {
    //         password: {
    //             required: true,
    //             minlength: 4
    //         },
    //         email: {
    //             required: true,
    //             email: true
    //         }
    //     },
    //     messages: {
    //         password: {
    //             required: "Заполните поле",
    //             minlength: jQuery.validator.format("Неверный пароль")
    //         },
    //         email: {
    //             required: "Заполните поле",
    //             email: jQuery.validator.format("Введите email")
    //
    //         }
    //     }
    // });


//submit disable

    $("input:radio, input:checkbox").change(
        function () {
            if ($(this).is(":checked")) {
                $('input[type="submit"]').removeAttr("disabled");
            }
            else {
                $('input[type="submit"]').attr("disabled", "disabled");

            }


        }
    );
//input hide error message
    $("#regForm input").on('keyup', function () {
        if ($(this).hasClass('error')) {
            $(this).removeClass('error').siblings('label.error').hide();
        }
        return false;
    });

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
//simple validate, returns true or false

    var validateForm = function (form) {
        var name = form.find('#name').val(),
            email = form.find('#email').val(),
            password = form.find('#password').val(),
            show,
            error = '',
            valid = true;
        if ((email.split('@').length - 1 == 0) || ( email.split('.').length - 1 == 0)) {
            error = "Введите корректный адрес";
            show = 'email';
            valid = false;
        }
        else if (name.length < 3) {
            error = "Имя должно быть больше трех символов";
            show = 'name';
            valid = false;
        }
        else if (password.length < 8) {
            error = "Пароль должен быть больше восьми символов";
            show = 'password';
            valid = false;
        }

        if (error !== '') {
            $('input#' + show + '').addClass('error').after('<label class="error">' + error + '</label>').siblings('label.error').show();
        }
        return valid;
    };

//universal function with parameters and ajax server respond
    var submitForm = function (e) {
        e.preventDefault();
        var form = $(this),
            url = 'form.php',
            ajaxRespond = ajaxForm(form, url);
        if (ajaxRespond) {
            var note = form.find('.status-note');
            ajaxRespond.done(function (answer) {
                if (answer.status === 'OK') {
                    note.addClass('success').text(answer.text).show();


                } else {
                    note.addClass('error').text(answer.text).show();
                }


            });
        }
    };


//if validate return true and start ajax
    $("#regForm").on('submit', submitForm);
    var ajaxForm = function (form, url) {
        if (!validateForm(form)) return false;
        data = form.serialize();
        var note = form.find('.status-note');

        var timeout;


        var result = $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: data,
            beforeSend: function () {
                timeout = window.setTimeout(function () {
                    timeout = null;
                    $('.preloader').show();
                }, 1000);
            },
            complete: function () {
                if (timeout) {
                    window.clearTimeout(timeout);
                    timeout = null;
                }
                $('.preloader').hide();
                form.trigger('reset');
                form.find('.placeholder__animate--animated').removeClass('placeholder__animate--animated');
            }
        }).fail(function (answer) {
            var fail = 'Ошибка на сервере';
            note.addClass('error').text(fail).show();

        });
        return result;
    };
});

//autocomplete fix

if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    window.setInterval(function () {
        $('input:-webkit-autofill').each(function () {
            var clone = $(this).clone(true, true);
            $(this).after(clone).remove();
        });
    }, 20);
}

