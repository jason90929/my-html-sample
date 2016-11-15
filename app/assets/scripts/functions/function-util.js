module.exports = {
    lazyload: function () {
        // Lazy load
        [].forEach.call(document.querySelectorAll('div[data-src]'), function (el) {
            var src = el.getAttribute('data-src');
            var img = document.createElement('img');
            img.setAttribute('src', src);

            el.style.backgroundImage = 'url(' + src + ')';
            img.onload = function () {
                el.removeAttribute('data-src');
            };
        });
    },
};