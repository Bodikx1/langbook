$(document).ready(function(){
    var
        init = function () {
            loadData();

            SentenceGenerator.init();
            SentenceManager.init();
        },

        loadData = function () {
            $.ajax({
                url: 'http://www.langbook.it/api/sentences',
                method: 'GET',
                async: true,
                data: null,
                timeout: 1000,
                success: function (data) {
                    if (data.status === "success") {
                        localStorage.setItem('sentences', JSON.stringify({
                            "sentences": data.sentences
                        }));
                        SentenceGenerator.show();
                    }
                },
                error: function (msg, error, HTTPErr) {
                }
            });

        };

    init();
});