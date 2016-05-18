$(document).ready(function(){
    var
        init = function () {
            if (User.isAuthorized()) {
                $('.js-login-link').replaceWith(
                    $('<a/>', {
                        "href": "#profile-page",
                        "data-role": "none",
                        class: "pull-left js-login-link",
                        text: "My profile"
                    })
                );
                $('.js-register-link').replaceWith(
                    $('<a/>', {
                        "href": "#",
                        "data-role": "none",
                        class: "pull-left js-logout-link",
                        text: "Logout",
                        click: function (e) {
                            e.preventDefault();
                            User.loginSuccessHandler('', '');
                            location.href = "/"
                        }
                    })
                );
            }

            LoginForm.init();
            RegisterForm.init();
            ProfileForm.init();
            SentenceGenerator.init();
            SentenceManager.init();
        };

    init();
});

/*-- Loader setup --*/

$(document).on("mobileinit", function() {
    $.mobile.loader.prototype.options.text = "loading";
    $.mobile.loader.prototype.options.textVisible = false;
    $.mobile.loader.prototype.options.theme = "a";
    $.mobile.loader.prototype.options.html = "";
});

$(document).on({
    ajaxSend: function () { loading('show'); },
    ajaxStart: function () { loading('show'); },
    ajaxStop: function () { loading('hide'); },
    ajaxError: function () { loading('hide'); }
});

$(document).on('pagebeforecreate', '[data-role="page"]', function() {
    loading('show', 1);
});

$(document).on('pageshow', '[data-role="page"]', function() {
    loading('hide', 1000);
});

function loading(showOrHide, delay) {
    setTimeout(function() {
        $.mobile.loading(showOrHide);
    }, delay);
}