var ProfileForm = (function () {
    var profileForm = $('#profile-form');

    function _setUpListners () {
        $(document).on('pagebeforeshow', '#profile-page', function() {
            profileForm.find('.js-show-session').text(getCookie('session_uuid'));
        });
    }

    return {
        init: function () {
            _setUpListners();
        }
    }
}());