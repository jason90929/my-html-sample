module.exports = {
  popupInit() {
    const popup = document.getElementById('popup');
    const showPopup = document.querySelectorAll('.show-popup');

    // 開啟 Popup 事件
    if (showPopup && popup) {
      const showPopupArray = Array.from(showPopup);
      showPopupArray.map((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          popup.addClass('active');
        });

        return null;
      });
    }

    // 關閉 Popup 事件
    const closePopup = document.querySelectorAll('.close-popup');

    if (closePopup && popup) {
      const closePopupArray = Array.from(closePopup);
      closePopupArray.map((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          popup.removeClass('active');
        });

        return null;
      });
    }
  },

  // 回最上面事件，若無捲軸則移除
  goTopInit() {
    const goTop = document.getElementById('go_top');

    if (goTop) {
      const scrollToTop = (scrollDuration) => {
        const cosParameter = window.scrollY / 2;
        let scrollCount = 0;
        let oldTimestamp = performance.now();

        function step(newTimestamp) {
          scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
          if (scrollCount >= Math.PI) window.scrollTo(0, 0);
          if (window.scrollY === 0) return;
          window.scrollTo(0, Math.round(cosParameter + (cosParameter * Math.cos(scrollCount))));
          oldTimestamp = newTimestamp;
          window.requestAnimationFrame(step);
        }

        window.requestAnimationFrame(step);
      };

      if (window.innerHeight < document.body.clientHeight) {
        goTop.addEventListener('click', (e) => {
          e.preventDefault();
          scrollToTop(600);
        });
      } else {
        goTop.remove();
      }
    }
  },
};
