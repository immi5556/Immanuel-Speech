window.bg = function () {
    return {
        startProgress: function () {
            document.body.classList.add("loadbody");
        },
        stopProgress: function () {
            document.body.classList.remove("loadbody");
        }
    }
}();