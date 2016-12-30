import './functions/prototype-util';
import './lib/google-analytics';

const popup = document.getElementById('popup');

window.showPopup = () => {
  if (popup) {
    popup.addClass('active');
  }
};

window.closePopup = () => {
  if (popup) {
    popup.removeClass('active');
  }
};

function ready(init) {
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
}

function fn() {
  return () => {
    // Do something when DOM ready

  };
}

ready(fn());
