/*global sp: true*/
'use strict';

var sp = sp || {};
(function(window, $){

    function loadConfig() {
        $.ajax({
            url: 'config.json',
            async: false,
        }).done(function(data){
            sp.config = data;
        });
    }

    function init() {
        loadConfig();
    }

    init();
})(window, window.jQuery);
