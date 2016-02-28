/**
 * Video player with screen brightness management when video is idle
 *
 * @author Cyril Diagne (cyril.diagne@ecal.ch)
 */

var el = null;
var fadeOutLock = false;
var isPlaying = false;

/**
 * Setup the video player
 */
function setup() {
  el = document.getElementById('player');
  el.addEventListener('ended', onEnded, false);
}

/**
 * Play the video player and dim the screen to max level
 */
function play() {
  if (isPlaying || fadeOutLock) return;
  el.play();
  el.style.opacity = 1;
  isPlaying = true;
  // restore screen light to 1
  brightness.setBrightness(1);
}

/**
 * Stop the video player and dim the screen to min level
 */
function stop() {
  el.pause();
  el.currentTime = 0;
  isPlaying = false;
  // dim screen light to 0
  brightness.setBrightness(0);
}

/**
 * Handles video end event and launches fade-out animation
 * @private
 *
 * @param {Event} ev video ended event
 */
function onEnded(ev) {
  el.style.opacity = 0;
  fadeOutLock = true;
  // wait for css fade-out animation to complete before reseting video
  setTimeout(function() {
    fadeOutLock = false;
    stop();
  }, 500);
}

/**
 * Export module's public methods
 */
export default {
  setup,
  play,
  stop,
  isPlaying : () => isPlaying,
  getEl : () => el
};
