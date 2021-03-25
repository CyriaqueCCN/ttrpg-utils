"use strict";

function to_float(n) {
    let num = parseFloat(n);
    return isNaN(num) ? 0 : num;
}

function die_avg(n, s) {
    let number = to_float(n);
    let size = to_float(s);
    if (number === 0 || size === 0)
        return 0;
    return number * (size + 1) / 2;
}

function get_avg(expr) {
    let e = expr.replace(/[^0-9d\+\-\(\)\*\/\.]/gi, "");
    let arr = e.split(/[dD]/g);
    let i = 0;
    let sep = /[\+\-\*\/\(\)]/g;
    let res = "";
    let num = 0;
    let size = 0;
    if (arr.length === 0)
        return 0;
    if (arr.length === 1)
        res = arr[0];
    while (i < arr.length - 1) {
        num = arr[i].split(sep);
        size = arr[i + 1].split(sep);
        if (i === 0) {
            res = arr[i].replace(new RegExp(num[num.length - 1] + "$"), "");
        }
        res += die_avg(num[num.length - 1], size[0]).toString();
        res += i === arr.length - 2 ? arr[i + 1].replace(size[0], "") : arr[i + 1].replace(size[0], "").replace(new RegExp(size[size.length - 1] + "$"), "");
        i++;
    }
    try {
        eval("i = " + res);
    } catch (e) {
        return 0;
    }
    return to_float(i);
}

