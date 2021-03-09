function build_from_url() {
    let obj = {};
    let url_len = window.location.search.length;
    if (url_len > 1) {
        try {
            let query = window.location.search.substring(1, url_len);
            obj = JSON.parse(atob(query));
        } catch(e) {
            console.log(e);
            obj = {};
        }
    }
    return new App(obj);
}

// Init
var app;
$(document).ready(function(){
    app = build_from_url();
    $("#simulate").trigger("click");
});