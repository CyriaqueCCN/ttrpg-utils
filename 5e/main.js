"use strict";

// I hate JS
function round(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}

function min_thresh(t) {
    return Math.max(0, round(t));
}

function hit_chance(bonus) {
    return Math.max(0.05, Math.min(0.95, 0.05 * bonus));
}

function get_supadv_thresh(hit, dmg, deg) {
    let basic_dmg = 0;
    let gwm_dmg = 0;
    let ac = 15 + hit; // problem with starting at 20 + hit : GWM always comes up on top when only a crit hits
    for (; ac > 0 ; ac--) {
        basic_dmg = (1 - Math.pow(hit_chance(ac - hit - 1), deg)) * dmg;
        gwm_dmg = (1 - Math.pow(hit_chance(ac - hit + 4), deg)) * (dmg + 10);
        if (gwm_dmg > basic_dmg)
            break;
    }
    return ac;
}

// maths pulled from https://forums.giantitp.com/showthread.php?472938-Great-Weapon-Mastery-How-to-5-10-Like-a-Pro
function get_thresh(hit, dmg, adv) {
    hit = parseFloat(hit);
    dmg = get_avg(dmg);
    if (isNaN(hit) || isNaN(dmg) || dmg === 0)
        return 0;
    if (adv === 3) // disadvantage
        return min_thresh(hit - 0.5 * (dmg + Math.sqrt(dmg * (dmg + 10))) + 16);
    if (adv === 2) // elven accuracy
        return get_supadv_thresh(hit, dmg, 3);
    if (adv === 1) // advantage
        return min_thresh(0.5 * (2 * hit + Math.sqrt((Math.pow(dmg, 2) + 10 * dmg + 1600)) - dmg - 8));
    // normal case, fallback
    return min_thresh(hit - dmg / 2 + 16);
}

function compute() {
    let adv = $("#adv3").is(":checked") ? 3 : $("#adv2").is(":checked") ? 2 : ($("#adv1").is(":checked") ? 1 : 0);
    let hit = $("#hit_bonus").val();
    let dmg = $("#damage").val();
    $("#res-field").text(get_thresh(hit, dmg, adv));
}

var tt;

$(".ref").on("keyup", function(){
    clearTimeout(tt);
    tt = setTimeout(compute, 1000);
});

$(".r_ref").on("change", function(){
    clearTimeout(tt);
    compute();
});

compute();