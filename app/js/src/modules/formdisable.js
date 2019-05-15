FormDisable = function (form) {
    $(form).find("input:radio, input:checkbox").change(
        function () {
            ($(this).is(":checked")) ? $('input[type="submit"]').removeAttr("disabled") :
                $('input[type="submit"]').attr("disabled", "disabled");
        }
    );
};

export default FormDisable;
