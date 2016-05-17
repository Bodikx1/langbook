var LoginForm = (function () {
    var loginForm = $('#login-form'),
        msgBlock = loginForm.find('.js-msg-block');

    function _setUpListners () {
        $(document).on('pagebeforeshow', '#login-page', function() {
            loginForm[0].reset();
            msgBlock.removeClass('alert-success').addClass('alert-danger').empty().fadeOut();
        });
        $(document).on('submit', '#login-form', function (e) {
            e.preventDefault();

            var inputs = this.elements,
                formData = {};

            for (var i=0;inputs && i < inputs.length; i++) {
                if (inputs[i].name) {
                    formData[inputs[i].name] = inputs[i].value;
                }
            }

            $.ajax({
                url: 'http://www.langbook.it/api/login',
                method: 'POST',
                async: true,
                data: {login: formData},
                timeout: 10000,
                success: function (data) {
                    if (data.status === "success") {
                        User.loginSuccessHandler(data.session_uuid, data.user_uuid);
                        data.msg && msgBlock.removeClass('alert-danger').addClass('alert-success').text(data.msg).fadeIn();
                        location.href = '/';
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