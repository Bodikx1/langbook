var SentenceGenerator = (function () {

    function _setUpListners() {
        $(document).on("pagecontainershow", _showList);
    }

    function _tagsWrapper(tags) {
        var wrappedTags = '';

        for(var tagKey in tags) {
            wrappedTags += '['+tags[tagKey]+'] ';
        }

        return wrappedTags;
    }

    function _showList() {
        var sentenceList = $('#sentences-list'),
            restoreSentences = JSON.parse(localStorage.getItem('sentences'));

        $(sentenceList).listview();
        $(sentenceList).empty();

        if (restoreSentences != null) {
            $.each(restoreSentences.sentences, function (key, val) {
                var item = $('<li/>', {class: "sentence-elem"}).append(
                    $('<div/>').append(
                        $('<a/>', {href: "#", text: val.language_1})
                    ),
                    $('<div/>').append(
                        $('<span/>', {text: val.language_2})
                    ),
                    $('<div/>').append(
                        $('<span/>', {text: _tagsWrapper(val.tags)})
                    )
                );
                $(sentenceList).append(item);
            });

            $(sentenceList).listview('refresh');
        } else {
            $(sentenceList).listview('refresh');
        }
    }

    return {
        init: function () {
            _setUpListners();
        },
        show: function () {
            _showList();
        }
    }
}());


var SentenceManager = (function () {
    var currSentence = null;

    function _setUpListners() {
    };

    function _setCurrSentence() {
    }

    function _saveSentence() {
    }

    function _addSentence() {
    }

    return {
        init: function () {
            _setUpListners();
        }
    }
}());