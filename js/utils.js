// Quality-of-life functions and globals

// globals
DEBUG = true;
DEBUG_DPR = true;
TOPLEVEL_SEP = /[;,]+/;
SUBLEVEL_SEP = /[: ]+/;

// JS sucks...
function is_empty(obj) {
    return obj === null || Object.keys(obj).length === 0;
}

// ...balls.
function to_int(num) {
    let n = parseInt(num, 10);
    return isNaN(n) ? 0 : n;
}

// good enough for our use
// need to get rid of the dot because it messes with jQuery selectors
function unique_id() {
    return (Math.random() + Date.now()).toString().replace('.', '');
}

function die_avg(number, size) {
    if (number === 0 || size === 0) {
        return 0;
    }
    return (number * (size + 1)) / 2;
}

// from https://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
Array.prototype.nth_index = function(match, n) {
    let i = -1;
    while (n-- && i++ < this.length) {
        i = this.indexOf(match, i);
        if (i < 0) {
            break;
        }
    }
    return i;
}

// as per https://2e.aonprd.com/Traits.aspx?ID=174
function deadly_die(die) {
    if (die >= 4) {
        return 3;
    }
    if (die == 3) {
        return 2;
    }
    return 1;
}

function round(n, base) {
    return Math.round((n + Number.EPSILON) * Math.pow(10, base)) / Math.pow(10, base);
}

function round2(n) {
    return round(n, 2);
}