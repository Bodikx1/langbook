function corrector(el) {

    var el1 = el.querySelector('.zcr-old'),
        el2 = el.querySelector('.zcr-corr'),
        s1 = el1.textContent,
        s2 = el2.textContent,
        diff;

    var diff = JsDiff.diffWords(s1, s2);

    el1.textContent = "";
    el2.textContent = "";

    diff.forEach(function(part){
        // green for additions, red for deletions
        // grey for common parts
        var status;
        var chunk1 = document.createElement('i');
        var chunk2 = document.createElement('i');

        if (part.added) {
            status = 'c-cor';
            chunk2.appendChild(document
                .createTextNode(part.value));
            chunk2.className = status;
            el2.appendChild(chunk2);
        } else if (part.removed) {
            status = 'c-err';
            chunk1.appendChild(document
                .createTextNode(part.value));
            chunk1.className = status;
            el1.appendChild(chunk1);
        } else {
            chunk1.appendChild(document
                .createTextNode(part.value));
            chunk2.appendChild(document
                .createTextNode(part.value));
            el1.appendChild(chunk1);
            el2.appendChild(chunk2);
        }

    });

}

zencopyreader.currCorrector = null;
function zencopyreader(curr) {
    zencopyreader.currCorrector = curr;

    var text = zencopyreader.currCorrector && zencopyreader.currCorrector.val(),
        sentences = [],
        $zencr = $('.zencopyreader').html('').append('<ul>'),
        $zencrUL = $('.zencopyreader').find('ul');

    if (!text) {
        return;
    }

    sentences = text.split('\n');

    for (var i = 0; i < sentences.length; i++) {
        $('<li>', {
            html: '<div class="zcr-old">' + sentences[i] + '</div><button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'
        }).appendTo($zencrUL);
    };

    $zencr.append('<button type="button" class="btn btn-success btn-block">Done</button>').fadeIn();
}

$('body').on('click', '.zencopyreader .btn-danger', function() {
    var $li = $(this).parent('li'),
        $error = $li.children('div').filter(":last");

    if (!$li.find('input').length) {
        if ($li.find('div').length > 1) {
            $error.remove();
        }
        $li.append('<input value="'+ $error.text() + '">');
        $li.find('input').focus().on('blur keyup', function(e) {
            var $input = $(this);
            if (e.type === 'keyup' && e.keyCode !== 13) {
                return;
            }
            e.preventDefault();

            $li.append('<div class="zcr-corr">' + $input.val() + '</div>');
            $input.remove();
            corrector($li[0]);
        });
    }
});

$('body').on('click', '.zencopyreader .btn-success', function() {
    var $zencr = $('.zencopyreader'),
        newText = [];

    $zencr.find('li').each(function() {
        var $this = $(this);
        $old = $(this).find('.zcr-old');
        $corr = $(this).find('.zcr-corr');
        if ($corr.length) {
            newText.push($corr.text());
        } else {
            newText.push($old.text());
        }
    });

    zencopyreader.currCorrector.next().val(newText.join('\n'));
    $zencr.fadeOut();
});

$('.text-corrector').on('focus keyup', function() {
    zencopyreader($(this));
});