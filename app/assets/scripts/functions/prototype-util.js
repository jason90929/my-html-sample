HTMLElement.prototype.addClass = function addClass(className) {
  const el = this;

  if (el && className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ` ${className}`;
    }
  }
};

HTMLElement.prototype.removeClass = function removeClass(className) {
  const el = this;

  if (el && className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');
    }
  }
};

HTMLElement.prototype.toggleClass = function toggleClass(className) {
  const el = this;

  if (el.classList) {
    el.classList.toggle(className);
  } else {
    const classes = el.className.split(' ');
    const existingIndex = classes.indexOf(className);

    if (existingIndex >= 0) {
      classes.splice(existingIndex, 1);
    } else {
      classes.push(className);
    }

    el.className = classes.join(' ');
  }
};

HTMLElement.prototype.hasClass = function hasClass(className) {
  const el = this;

  if (el.classList) {
    return el.classList.contains(className);
  }

  new RegExp(`(^| )${className}( |$)`, 'gi').test(el.className);
  return false;
};
