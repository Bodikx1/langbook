var User = (function () {
    var default_cookie_options = {path: "/", expires:1000000000};

    return {
        isAuthorized: function () {
            return (typeof getCookie("session_uuid") !== "undefined"  && getCookie("session_uuid").length > 0);
        },
        loginSuccessHandler: function (session_uuid, user_uuid) {
            setCookie("auth", true, default_cookie_options);
            setCookie("session_uuid", session_uuid, default_cookie_options);
            setCookie("user_uuid", user_uuid, default_cookie_options);
            $(document).trigger("user_login", {session_uuid: session_uuid});
        }
    }
}());