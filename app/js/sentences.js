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

    function _loadData() {
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
                    _showList();
                }
            },
            error: function (msg, error, HTTPErr) {
            }
        });
    }

    function _showList() {
        var sentenceList = $('#sentences-list'),
            restoreSentences = JSON.parse(localStorage.getItem('sentences'));

        $(sentenceList).listview();
        $(sentenceList).empty();

        if (restoreSentences.sentences) {
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
            _loadData();
        }
    }

    return {
        init: function () {
            _setUpListners();
            _loadData();
        },
        show: function () {
            _showList();
        }
    }
}());


var SentenceManager = (function () {
    var currSentence = null,
        sentenceAddInput = $('.sentenceAdd'),
        tagsPanel = $('.tags-panel'),
        controlPanel = $('.sentence-control');

    function _setUpListners() {
        $(document).on('keyup', '.sentenceAdd', _setCurrSentence);
        $(document).on('click', '#sentences-list .sentence-elem a', _setCurrSentence);
        $(document).on('submit', '.sentence-control form', function (e) {
            e.preventDefault();

            if (currSentence) {
                _saveSentence(e);
            } else {
                _addSentence(e);
            }
        });
        $(document).on('click', '.tags-panel .addTag', _addTag);
    }

    function _showControlPanel() {
        !controlPanel.is(':animated') && controlPanel.fadeIn(500, function() {
            sentenceAddInput.parent().hide();
            controlPanel.find('textarea[name="language1"]').focus();
        });
    }

    function _hideControlPanel() {
        !controlPanel.is(':animated') && controlPanel.fadeOut(500, function() {
            sentenceAddInput.parent().show();
            controlPanel.find('form')[0].reset();
            sentenceAddInput.val('');
            sentenceAddInput.focus();
        });
    }

    function _setCurrSentence(e) {
        if (e.target.type === "text") {
            currSentence = null;
            _showControlPanel();
            controlPanel.find('textarea[name="language1"]').val(e.target.value);
        }

        if (e.target.tagName === "A") {
            currSentence = {};
            currSentence["lang1"] = e.target.text;
            currSentence["lang2"] = $(this).parent().next().text();
            currSentence["tags"] = $(this).parent().nextAll(':last-child').text();

            _showControlPanel();

            controlPanel.find('textarea[name="language1"]').val(currSentence.lang1);
            controlPanel.find('textarea[name="language2"]').val(currSentence.lang2);
        }
    }

    function _saveSentence(e) {
        _hideControlPanel();
    }

    function _addSentence(e) {
        currSentence = {};
        currSentence["lang1"] = controlPanel.find('textarea[name="language1"]').val();
        currSentence["lang2"] = controlPanel.find('textarea[name="language2"]').val();
        currSentence["tags"] = [].join.call(tagsPanel.find(':not(.addTag)').map(function() {
            return $(this).text();
        }), ',');

        $.ajax({
            url: 'http://www.langbook.it/api/sentence',
            method: 'POST',
            async: true,
            contentType: 'application/json',
            data: JSON.stringify({"sentence": currSentence}),
            timeout: 1000,
            success: function (data) {
                if (data.status === "success") {
                    _hideControlPanel();
                    localStorage.setItem('sentences', JSON.stringify({}));
                    SentenceGenerator.show();
                }
            },
            error: function (msg, error, HTTPErr) {
            }
        });
    }

    function _addTag(e) {
        e.preventDefault();

        var self = this,
            tagBtn = $('<input/>', {style: "width: 100%", class: "btn tag-btn"});

        tagBtn.insertBefore(self);
        tagBtn.focus();

        tagBtn.on('blur', function(e) {
            tagBtn.replaceWith($('<button/>', {
                "data-role": "none",
                class: "btn tag-btn",
                text: tagBtn.val()
            }));
            tagBtn.off('blur');
        });
    }

    return {
        init: function () {
            _setUpListners();
        }
    }
}());