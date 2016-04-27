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
                var item = $('<li/>', {class: "sentence-elem", uuid: val.uuid}).append(
                    $('<div/>').append(
                        $('<a/>', {href: "#", text: val.lang1})
                    ),
                    $('<div/>').append(
                        $('<span/>', {text: val.lang2})
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
    var currSentence = null,
        sentenceAddInput = $('.sentenceAdd'),
        controlPanel = $('.sentence-control');

    function _setUpListners() {
        $(document).on('keyup', sentenceAddInput, _setCurrSentence);
        $(document).on('click', '#sentences-list .sentence-elem a', _setCurrSentence);
    };

    function _setCurrSentence(e) {
        if (e.target.type === "text") {
            !controlPanel.is(':animated') && controlPanel.fadeIn(500, function() {
                sentenceAddInput.parent().hide();
                controlPanel.find('textarea[name="language1"]').focus();
            });
            controlPanel.find('textarea[name="language1"]').val(e.target.value);
        }

        if (e.target.tagName === "A") {
            !controlPanel.is(':animated') && controlPanel.fadeIn(500, function() {
                sentenceAddInput.parent().hide();
                controlPanel.find('textarea[name="language1"]').focus();
            });
            controlPanel.find('textarea[name="language1"]').val(e.target.text);
            controlPanel.find('textarea[name="language2"]').val(e.target.text);
        }
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