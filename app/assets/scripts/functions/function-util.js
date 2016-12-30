module.exports = {
  lazyload() {
    // Lazy load
    [].forEach.call(document.querySelectorAll('div[data-src]'), (el) => {
      const src = el.getAttribute('data-src');
      const img = document.createElement('img');
      img.setAttribute('src', src);

      const element = el;
      element.style.backgroundImage = `url(${src})`;
      img.onload = () => {
        element.removeAttribute('data-src');
      };
    });
  },
};
