var slideshow = remark.create({
  highlightStyle: 'monokai',
  highlightLanguage: 'javascript'
}) ;
var iframe = document.createElement('iframe');
iframe.addEventListener('load', function () {
  iframe.contentWindow.addEventListener('click', function (e) { this.parent.focus(); });
  iframe.contentWindow.addEventListener('message', function onMessage(e) {
    var cid;
    if (e.data === 'controller') {
      cid = slideshow.getCurrentSlideIndex();
      iframe.contentWindow.changeSlide(cid);
      slideshow.on('showSlide', function (slide) {
        var cid = slide.getSlideIndex();
        iframe.contentWindow.changeSlide(cid);  
      });
      iframe.contentWindow.removeEventListener('message', onMessage, false);
    }  
  });
}, false);
iframe.style.position = 'absolute';
iframe.style.top = 0;
iframe.style.right = 0;
iframe.style.width = '300px';
iframe.style.height = '200px';
iframe.style.zIndex = 100;
iframe.style.borderWidth = 0;
iframe.style.backgroundColor = 'white';
iframe.src = window.location.protocol + '//' + window.location.host;
document.body.appendChild(iframe);
