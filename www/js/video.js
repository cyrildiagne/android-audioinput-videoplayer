var video_el;
var videoFadeOutLock = false;

function setupVideo() {
  video_el = document.getElementById('player');
  video_el.addEventListener('ended', onVideoEnded, false);
}

function playVideo() {

  if (videoFadeOutLock) return;

  video_el.play();
  video_el.style.opacity = 1;
}

function stopVideo() {
  video_el.currentTime = 0;
  video_el.pause();
}

function onVideoEnded(ev) {

  video_el.style.opacity = 0;
  videoFadeOutLock = true;

  setTimeout(function() {
    videoFadeOutLock = false;
    stopVideo();
  }, 500);
}
