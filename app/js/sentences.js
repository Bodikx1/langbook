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
        addSentenceModal = $('#addSentenceModal'),
        tagsPanel = $('.tags-panel'),
        controlPanel = $('.sentence-control');

    function _setUpListners() {
        $(document).on('click', '.addSentence', _setCurrSentence);
        $(document).on('click', '#sentences-list .sentence-elem a', _setCurrSentence);
        $(document).on('shown.bs.modal', '#addSentenceModal', _showControlPanel);
        $(document).on('hidden.bs.modal', '#addSentenceModal', _hideControlPanel);
        $(document).on('submit', '.sentence-control form', function (e) {
            e.preventDefault();

            if (currSentence) {
                _saveSentence(e);
            } else {
                _addSentence(e);
            }
        });
        $(document).on('click', '.tags-panel .addTag', _addTag);
        $(document).on('click', '.tags-panel button:not(.addTag)', _editTag);
        $(document).on('click', '.sentenceDelete', _deleteCurrSentence);
    }

    function _showControlPanel() {
        controlPanel.find('textarea[name="language1"]').focus();
    }

    function _hideControlPanel() {
        controlPanel.find('form')[0].reset();
        tagsPanel.find(':not(.addTag)').remove();
    }

    function _setCurrSentence(e) {
        if (e.target.className.indexOf('addSentence') !== -1) {
            currSentence = null;
            addSentenceModal.modal('show');
            controlPanel.find('textarea[name="language1"]').val(e.target.value);
        } else {
            currSentence = {};
            currSentence["uuid"] = $(this).closest('li').attr('uuid');
            currSentence["lang1"] = e.target.text;
            currSentence["lang2"] = $(this).parent().next().text();
            currSentence["tags"] = $(this).parent().nextAll(':last-child').text() && $.trim($(this).parent().nextAll(':last-child').text().replace(/[\[\]]/g, '')).split(' ');

            addSentenceModal.modal('show');

            controlPanel.find('textarea[name="language1"]').val(currSentence.lang1);
            controlPanel.find('textarea[name="language2"]').val(currSentence.lang2);
            for (var i=0;currSentence.tags && i < currSentence.tags.length; i++) {
                $('<button/>', {
                    "data-role": "none",
                    class: "btn tag-btn",
                    text: currSentence.tags[i]
                }).insertBefore(tagsPanel.find('.addTag'));
            }
        }
    }

    function _saveSentence(e) {
        var currSentenceUuid = currSentence.uuid;
        delete currSentence.uuid;
        return;
        $.ajax({
            url: 'http://www.langbook.it/api/sentence',
            method: 'PUT',
            async: true,
            contentType: 'application/json',
            data: JSON.stringify({"sentence": currSentence}),
            timeout: 1000,
            success: function (data) {
                if (data.status === "success") {
                    addSentenceModal.modal('hide');
                    localStorage.setItem('sentences', JSON.stringify({}));
                    SentenceGenerator.show();
                }
            },
            error: function (msg, error, HTTPErr) {
            }
        });
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
                    addSentenceModal.modal('hide');
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
            if ($.trim(tagBtn.val())) {
                tagBtn.replaceWith($('<button/>', {
                    "data-role": "none",
                    class: "btn tag-btn",
                    text: $.trim(tagBtn.val())
                }));
                tagBtn.off('blur');
            } else {
                tagBtn.remove();
            }
        });
    }

    function _editTag(e) {
        e.preventDefault();

        var self = $(this),
            tagBtn = $('<input/>', {
                style: "width: 100%",
                class: "btn tag-btn",
                value: self.text()
            });

        self.replaceWith(tagBtn);
        tagBtn.focus();

        tagBtn.on('blur', function(e) {
            if ($.trim(tagBtn.val())) {
                tagBtn.replaceWith($('<button/>', {
                    "data-role": "none",
                    class: "btn tag-btn",
                    text: $.trim(tagBtn.val())
                }));
                tagBtn.off('blur');
            } else {
                tagBtn.remove();
            }
        });
    }

    function _deleteCurrSentence(e) {
        e.preventDefault();

        if (currSentence) {
            var currSentenceUuid = currSentence.uuid;
            return;
            $.ajax({
                url: 'http://www.langbook.it/api/sentence',
                method: 'DELETE',
                async: true,
                contentType: 'application/json',
                data: null,
                timeout: 1000,
                success: function (data) {
                    if (data.status === "success") {
                        addSentenceModal.modal('hide');
                        localStorage.setItem('sentences', JSON.stringify({}));
                        SentenceGenerator.show();
                    }
                },
                error: function (msg, error, HTTPErr) {
                }
            });
        } else {
            addSentenceModal.modal('hide');
        }
    }

    return {
        init: function () {
            _setUpListners();
        }
    }
}());