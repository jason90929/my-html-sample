HTMLElement.prototype.addClass = function (className) {
    let el = this;

    if (el && className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }
};

HTMLElement.prototype.removeClass = function (className) {
    let el = this;

    if (el && className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
};

HTMLElement.prototype.toggleClass = function (className) {
    let el = this;

    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes = el.className.split(' ');
        var existingIndex = classes.indexOf(className);

        if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
        else
            classes.push(className);

        el.className = classes.join(' ');
    }
};

HTMLElement.prototype.hasClass = function(className) {
    let el = this;

    if (el.classList) {
        return !!el.classList.contains(className);
    }
    else {
        new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        return false;
    }
};

Object.prototype.extend = function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i])
            continue;

        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key))
                out[key] = arguments[i][key];
        }
    }

    return out;
};

// String.prototype.trim = function (str) {
//     if (!str) {
//         return;
//     }
//     return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
// };