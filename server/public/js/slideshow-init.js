var slideshow = remark.create({
  highlightStyle: 'github',
  highlightLanguage: 'javascript'
}) ;
var lessonIdx = document.body.dataset.lessonIndex;
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
iframe.style.width = '100%';
iframe.style.height = '80px';
iframe.style.zIndex = 100;
iframe.style.borderWidth = 0;
iframe.src = window.location.protocol + '//' + window.location.host + '/presentation/universality-' + lessonIdx + '/connections';
document.body.appendChild(iframe);
