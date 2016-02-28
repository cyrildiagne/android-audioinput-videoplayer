var video_el;
var videoFadeOutLock = false;
var videoIsPlaying = false;

function setupVideo() {
  video_el = document.getElementById('player');
  video_el.addEventListener('ended', onVideoEnded, false);
}

function playVideo() {

  if (videoIsPlaying || videoFadeOutLock) return;

  video_el.play();
  video_el.style.opacity = 1;
  videoIsPlaying = true;

  brightness.setBrightness(1);
}

function stopVideo() {
  video_el.currentTime = 0;
  video_el.pause();
  videoIsPlaying = false;

  brightness.setBrightness(0);
}

function onVideoEnded(ev) {

  video_el.style.opacity = 0;
  videoFadeOutLock = true;

  setTimeout(function() {
    videoFadeOutLock = false;
    stopVideo();
  }, 500);
}
