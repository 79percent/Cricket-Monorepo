(() => {
  const handlePageLoad = () => {
    setTimeout(() => {
      let resolution = window.screen.width + '*' + window.screen.height;
      resolution = 'resolution=' + resolution;
      let loadTime: string | number = Math.round(
        // @ts-ignore
        performance.timing.loadEventEnd - performance.timing.navigationStart,
      );
      loadTime = 'loadTime=' + loadTime;
      const url = '/api/buriedPoint/add?' + resolution + '&' + loadTime;
      const img = new Image();
      img.src = url;
    }, 300);
  };
  window.addEventListener('load', handlePageLoad);
})();
