export const htmlFontSize = `
  (() => {
    function deviceJudge() {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return 'ios';
      } else if (/(Android)/i.test(navigator.userAgent)) {
        return 'android';
      } else {
        return 'pc';
      }
    }
    var device = deviceJudge();
    function initHtmlFontSize(){
      const w = device === 'pc' ? 153.6 : 41.4;
      document.documentElement.style.fontSize = document.documentElement.clientWidth / w + 'px';
    }
    initHtmlFontSize();
    window.addEventListener('load', initHtmlFontSize);
    window.addEventListener('resize', initHtmlFontSize);
  })()
`;

export const buriedPoint = `
  (() => {
    const handlePageLoad = () => {
      setTimeout(() => {
        let resolution = window.screen.width + '*' + window.screen.height;
        resolution = 'resolution=' + resolution;
        let loadTime = Math.round(
          performance.timing.loadEventEnd - performance.timing.navigationStart,
        );
        loadTime = 'loadTime=' + loadTime;
        const url = '/api/buriedPoint/add?' + resolution + '&' + loadTime;
        fetch(url);
      }, 300);
    };
    window.addEventListener('load', handlePageLoad);
  })();
`;
