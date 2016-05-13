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

        if (restoreSentences && restoreSentences.sentences) {
            $.each(restoreSentences.sentences, function (key, val) {
                var item = $('<li/>', {class: "sentence-elem", uuid: val.uuid}).append(
                    $('<div/>', {class: "col"}).append(
                        $('<div/>').append(
                            $('<a/>', {class: "js-edit-sentence", href: "#add-page", text: val.lang1})
                        ),
                        $('<div/>').append(
                            $('<span/>', {text: val.lang2})
                        ),
                        $('<div/>').append(
                            $('<span/>', {text: _tagsWrapper(val.tags)})
                        )
                    ),
                    $('<div/>', {class: "col action"}).append(
                        $('<a/>', {class: "js-edit", text: "Edit", href: "#"})
                    ),
                    $('<div/>', {class: "col action"}).append(
                        $('<a/>', {class: "js-delete", text: "Delete", href: "#delete-confirm-page"})
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
        tagsPanel = $('.tags-panel'),
        controlPanel = $('.sentence-control'),
        deleteConfirmModal = $('#delete-confirm-modal');

    function _setUpListners() {
        $(document).on('click', '.js-add-sentence', _addNewSentence);
        $(document).on('click', '.js-toggle-actions', function() {
            $('#sentences-list .sentence-elem').toggleClass('show-actions');
        });
        $(document).on('click', '.js-edit-sentence', _setCurrSentence);
        $(document).on('submit', '.sentence-control form', function (e) {
            e.preventDefault();

            if (currSentence) {
                _saveSentence(e);
            } else {
                _addSentence(e);
            }
        });
        $(document).on('click', '.js-edit', function (e) {
            e.preventDefault();

            $(this).closest('li').find('a.js-edit-sentence').trigger('click');
        });
        $(document).on('click', '.js-delete', _showDeleteModal);
        $(document).on('click', '.js-confirm-delete', _confirmDeleteModal);
        $(document).on('click', '.js-cancel-delete', function (e) {
            deleteConfirmModal.modal('hide');
        });
        $(document).on('click', '.js-add-tag', _addTag);
        $(document).on('click', '.tags-panel button:not(.js-add-tag)', _editTag);
        $(document).on('click', '.js-delete-sentence', _deleteCurrSentence);
        $(document).on('click', '.js-back-btn', _clearControlPanel);
    }

    function _clearControlPanel() {
        controlPanel.find('form')[0].reset();
        tagsPanel.find(':not(.js-add-tag)').remove();
    }

    function _addNewSentence(e) {
        currSentence = null;
        controlPanel.find('textarea[name="language1"]').val(e.target.value);
    }

    function _setCurrUuid() {
        currSentence = {};
        currSentence["uuid"] = $(this).closest('li').attr('uuid');
    }

    function _setCurrSentence(e) {
        _setCurrUuid.call(this);
        currSentence["lang1"] = $(this).text();
        currSentence["lang2"] = $(this).parent().next().text();
        currSentence["tags"] = $(this).parent().nextAll(':last-child').text() && $.trim($(this).parent().nextAll(':last-child').text().replace(/[\[\]]/g, '')).split(' ');

        controlPanel.find('textarea[name="language1"]').val(currSentence.lang1);
        controlPanel.find('textarea[name="language2"]').val(currSentence.lang2);
        for (var i=0;currSentence.tags && i < currSentence.tags.length; i++) {
            $('<button/>', {
                "data-role": "none",
                class: "tag-btn",
                text: currSentence.tags[i]
            }).insertBefore(tagsPanel.find('.js-add-tag'));
        }
    }

    function _saveSentence(e) {
        var currSentenceUuid = currSentence && currSentence.uuid;
        delete currSentence.uuid;

        currSentence["lang1"] = controlPanel.find('textarea[name="language1"]').val();
        currSentence["lang2"] = controlPanel.find('textarea[name="language2"]').val();
        currSentence["tags"] = [].join.call(tagsPanel.find(':not(.js-add-tag)').map(function() {
            return $(this).text();
        }), ',');

        if(currSentenceUuid) {
            $.ajax({
                url: 'http://www.langbook.it/api/sentence/'+currSentenceUuid,
                method: 'PUT',
                async: true,
                contentType: 'application/json',
                data: JSON.stringify({"sentence": currSentence}),
                timeout: 1000,
                success: function (data) {
                    if (data.status === "success") {
                        _clearControlPanel();
                        localStorage.setItem('sentences', JSON.stringify({}));
                        SentenceGenerator.show();
                        location.hash="#";
                    }
                },
                error: function (msg, error, HTTPErr) {
                }
            });
        } else {
            location.hash="#";
        }
    }

    function _addSentence(e) {
        currSentence = {};
        currSentence["lang1"] = controlPanel.find('textarea[name="language1"]').val();
        currSentence["lang2"] = controlPanel.find('textarea[name="language2"]').val();
        currSentence["tags"] = [].join.call(tagsPanel.find(':not(.js-add-tag)').map(function() {
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
                    _clearControlPanel();
                    localStorage.setItem('sentences', JSON.stringify({}));
                    SentenceGenerator.show();
                    location.hash="#";
                }
            },
            error: function (msg, error, HTTPErr) {
            }
        });
    }

    function _addTag(e) {
        e.preventDefault();

        var self = this,
            tagBtn = $('<input/>', {type: "text", value: "", style: "width: 90%;", class: "tag-btn"}),
            confirmBtn = $('<span/>', {style: "color: lightgreen;position: absolute;right: 10px;top: 10px;", class: "glyphicon glyphicon-ok"}),
            wrapper = $('<div/>', {style: "position: relative;"}).append(
                confirmBtn,
                tagBtn
            ),
            replaceWithBtn = function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (e.target.tagName === "INPUT" && e.keyCode === 13 || e.target.tagName === "SPAN") {
                    if ($.trim(tagBtn.val())) {
                        wrapper.replaceWith($('<button/>', {
                            "data-role": "none",
                            class: "tag-btn",
                            text: $.trim(tagBtn.val())
                        }));
                    } else {
                        wrapper.remove();
                    }
                }
            };

        wrapper.insertBefore(self);
        tagBtn.focus();

        confirmBtn.one('click', replaceWithBtn);
        tagBtn.one('keydown', replaceWithBtn);
    }

    function _editTag(e) {
        e.preventDefault();

        var self = $(this),
            tagBtn = $('<input/>', {
                type: "text",
                style: "width: 90%",
                class: "tag-btn",
                value: self.text()
            }),
            confirmBtn = $('<span/>', {style: "color: lightgreen;position: absolute;right: 10px;top: 10px;", class: "glyphicon glyphicon-ok"}),
            wrapper = $('<div/>', {style: "position: relative;"}).append(
                confirmBtn,
                tagBtn
            ),
            replaceWithBtn = function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (e.target.tagName === "INPUT" && e.keyCode === 13 || e.target.tagName === "SPAN") {
                    if ($.trim(tagBtn.val())) {
                        wrapper.replaceWith($('<button/>', {
                            "data-role": "none",
                            class: "tag-btn",
                            text: $.trim(tagBtn.val())
                        }));
                    } else {
                        wrapper.remove();
                    }
                }
            };

        self.replaceWith(wrapper);
        tagBtn.focus();

        confirmBtn.one('click', replaceWithBtn);
        tagBtn.one('keydown', replaceWithBtn);
    }

    function _deleteCurrSentence(e) {
        e.preventDefault();

        if (currSentence) {
            var currUuid = currSentence.uuid;

            $.ajax({
                url: 'http://www.langbook.it/api/sentence/'+currUuid,
                method: 'DELETE',
                async: true,
                contentType: 'application/json',
                data: null,
                timeout: 1000,
                success: function (data) {
                    if (data.status === "success") {
                        _clearControlPanel()
                        localStorage.setItem('sentences', JSON.stringify({}));
                        SentenceGenerator.show();
                        location.hash="#";
                    }
                },
                error: function (msg, error, HTTPErr) {
                }
            });
        } else {
            _clearControlPanel();
            location.hash="#";
        }
    }

    function _showDeleteModal(e) {
        _setCurrUuid.call(this);
        deleteConfirmModal.modal('show');
    }

    function _confirmDeleteModal(e) {
        e.preventDefault();

        var currUuid = currSentence && currSentence.uuid;

        if (currUuid) {
            $.ajax({
                url: 'http://www.langbook.it/api/sentence/'+currUuid,
                method: 'DELETE',
                async: true,
                contentType: 'application/json',
                data: null,
                timeout: 1000,
                success: function (data) {
                    if (data.status === "success") {
                        deleteConfirmModal.modal('hide');
                        _clearControlPanel()
                        localStorage.setItem('sentences', JSON.stringify({}));
                        SentenceGenerator.show();
                    }
                },
                error: function (msg, error, HTTPErr) {
                }
            });
        } else {
            location.hash="#";
        }
    }

    return {
        init: function () {
            _setUpListners();
        }
    }
}());