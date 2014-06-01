'use strict';

var sp = sp || {};
(function(window, $){

    function loadConfig() {
        $.get('config.json').done(function(data){
            sp.config = data;
        });
    }

    function init() {
        loadConfig();
    }

    init();
})(window, window.jQuery);
