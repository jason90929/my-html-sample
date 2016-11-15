import './functions/prototype-util';
import {lazyload} from './functions/function-util';

var popup = document.getElementById('popup');

window.showPopup = function () {
    if (popup) {
        popup.addClass('active');
    }
};

window.closePopup = function () {
    if (popup) {
        popup.removeClass('active');
    }
};

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function fn() {
    return function () {
        // Do something when DOM ready

    };
}

ready(fn());

;(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-85911523-1', 'auto');
ga('send', 'pageview');

