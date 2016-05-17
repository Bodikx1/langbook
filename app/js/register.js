var RegisterForm = (function () {
    var registerForm = $('#register-form'),
        msgBlock = registerForm.find('.js-msg-block');

    function _setUpListners () {
        $(document).on('pagebeforeshow', '#register-page', function() {
            registerForm[0].reset();
            msgBlock.removeClass('alert-success').addClass('alert-danger').empty().fadeOut();
        });
        $(document).on('submit', '#register-form', function (e) {
            e.preventDefault();

            var inputs = this.elements,
                formData = {};

            for (var i=0;inputs && i < inputs.length; i++) {
                if (inputs[i].name) {
                    formData[inputs[i].name] = inputs[i].value;
                }
            }

            $.ajax({
                url: 'http://www.langbook.it/api/user',
                method: 'POST',
                async: true,
                data: {user: formData},
                timeout: 10000,
                success: function (data) {
                    if (data.status === "success") {
                        data.user_uuid && User.loginSuccessHandler('', data.user_uuid);
                        data.msg && msgBlock.removeClass('alert-danger').addClass('alert-success').text(data.msg).fadeIn();
                        location.hash = '#login-page';
                    }
                },
                error: function (msg, error, HTTPErr) {
                    msgBlock.text(msg.responseJSON.msg).fadeIn();
                }
            });
        });
    }

    return {
        init: function () {
            _setUpListners();
        }
    }
}());