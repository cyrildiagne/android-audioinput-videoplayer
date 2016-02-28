var el = null;
var fadeOutLock = false;
var isPlaying = false;

function setup() {
  el = document.getElementById('player');
  el.addEventListener('ended', onEnded, false);
}

function play() {
  if (isPlaying || fadeOutLock) return;
  el.play();
  el.style.opacity = 1;
  isPlaying = true;
  // restore screen light to 1
  brightness.setBrightness(1);
}

function stop() {
  el.pause();
  el.currentTime = 0;
  isPlaying = false;
  // dim screen light to 0
  brightness.setBrightness(0);
}

function onEnded(ev) {
  el.style.opacity = 0;
  fadeOutLock = true;
  // wait for css fade-out animation to complete before reseting video
  setTimeout(function() {
    fadeOutLock = false;
    stop();
  }, 500);
}

export default {
  setup : setup,
  play : play,
  stop : stop,
  isPlaying : () => isPlaying,
  getEl : () => el
};
