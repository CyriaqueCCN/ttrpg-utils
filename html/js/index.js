// dropdown for attacks and turns
$(document).on("click", '.dpd-button', function() {
    $sib = $(this).closest('.dpd-parent').find(".dpd");
    if ($sib.is(':visible')) {
        $sib.slideUp();
        $(this).find("[data-fa-i2svg]").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
        $sib.slideDown();
        $(this).find("[data-fa-i2svg]").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
});

function unique_id() {
    // good enough for our use
    // need to get rid of the dot because it messes with jQuery selectors
    return (Math.random() + Date.now()).toString().replace('.', '');
}

// click handler delegation for all page buttons
$(document).on("click", "#create-attack", function() {
    let $atk = $($('#atk-tmpl').html());
    $atk.attr("id", unique_id());
    // bind to turn referencing attacks
    $atk.on('input', function() {
        let $a = $(this);
        $('.weapon-item').each(function(){
            if ($(this).attr('data-wep-id') === $a.attr('id')) {
                $(this).find('.weapon-name').text($a.find('.atk-name').val());
            }
        });
    });
    $('#atk-div').append($atk);
});

$(document).on("click", "#create-turn", function() {
    $turn = $($('#turn-tmpl').html());
    $turn.attr("id", unique_id());
    $('#turn-div').append($turn);
});

// propagate delete event to affiliated attacks in turns
$(document).on("click", ".del-atk", function() {
    $atk = $(this).closest('.atk');
    $('.weapon-item').each(function(){
        if ($(this).attr('data-wep-id') === $atk.attr('id')) {
            $(this).remove();
        }
    });
    $atk.remove();
});

// delete events handlers
$(document).on("click", ".del-turn", function() {
    $(this).closest('.turn').remove();
});

$(document).on("click", "#clear-attacks", function() {
    $('.del-atk').trigger('click');
});

$(document).on("click", "#clear-turns", function() {
    $('.del-turn').trigger('click');
});

$(document).on("click", ".weapon-remove", function() {
    $(this).closest('.weapon-item').remove();
});

$(document).on("click", "#clear-results", function() {
    $('.res-col').remove();
});

// add a weapon to a turn
$(document).on("click", ".weapon-add", function() {
    nm = $(this).parent('div').prev('div').children('input').val().toLowerCase().trim();
    wep_name = "__UNKNOWN__";
    wep_id = -1;
    $('.atk').each(function() {
        wep = $(this).find('.atk-name');
        wep_n = wep.val().toLowerCase().trim();
        if(wep_n === nm) {
            wep_name = wep_n;
            wep_id = $(this).attr('id');
            return false; // equivalent to break in a jQuery each
        }
    });
    if (wep_id === -1 || wep_name === "__UNKNOWN__") {
        console.log("No weapon found for name" + nm + " with last id " + wep_id + ", last name " + wep_name);
        return false;
    }
    $wep = $($('#weapon-tmpl').html());
    $(this).closest('.turn').find('.weapon-list').append($wep);
    $wep.attr('data-wep-id', wep_id);
    $target = $('#' + wep_id.toString()).find('.atk-name');
    $wep.find('.weapon-name').text($target.val());
    $wep.attr("id", unique_id());
    $(this).parent('div').prev('div').children('input').val("");
});

function get_attacks() {
    let attacks = {};
    $('.atk').each(function(){
        // need the atk minimal specifications
        // can't use static method because of Apple :(
        let a = new Attack({});
        a.buildFromHTML($(this));
        if (!a.is_valid) {
            return true; // equivalent to continue in a jQuery each
        }
        attacks[a.id] = a;
    });
    return attacks;
}

function get_turns(atts) {
    let turns = [];
    $('.turn').each(function(){
        let t = new Turn({});
        t.buildFromHTML($(this), atts);
        if (!t.is_valid) {
            return true;
        }
        turns.push(t);
    });
    return turns;
}

// on calculation : clear the results, create the classes, calculate dpr and display it
$(document).on("click", "#simulate", function() {
    $("#clear-results").trigger("click");
    attacks = get_attacks();
    turns = get_turns(attacks);
    monster_spec = {
        'name': 'dummy',
        'ac': parseInt($('input[name=monster_ac]').val()),
        'flatfooted': false,
        'resistances': $('input[name=monster_resists]').val(),
        'immunities': $('input[name=monster_immuns]').val()
    };
    monster = new Monster(monster_spec);
    result_spec = {
        'id': 0,
        'monster': monster,
        'pc_level': -1,
        'turns': turns
    };
    result = new Result(result_spec);
    if (result.is_valid) {
        result.compute();
    } else {
        console.log("Invalid result object : ", result);
    }
});

function buildFromParams() {
    // TODO : export/import attack scenarios (JSON encoded ?)
}

// Init
$(document).ready(function(){
    // TODO : see README
});