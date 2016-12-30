import './functions/prototype-util';
import './lib/google-analytics';
import { popupInit } from './functions/event-util';

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

    popupInit();
  };
}

ready(fn());
