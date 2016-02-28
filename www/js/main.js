System.config({ baseURL: '/js' });

var threshold = 0.5;
var showSettings = true;
var isActive = true;
var app_el = document.getElementById('app');
var updateId = 0;

function setup() {
  // get list of vailable microphones
  getMicrophones(function(microphones) {
    // populate select input
    setupSelectUI(microphones);

    setMicrophone(microphones[microphones.length-1].deviceId);

    setupVideo();
    setupGraph();
    setupAudio();

    video_el.addEventListener('click', videoClicked, false);

    // launch update loop
    update();
  });
}

function update() {
  if (isActive) {
    updateId = window.requestAnimationFrame(update);
  }

  // only update audio when settings are showing or video is not playing
  if (showSettings || !videoIsPlaying) {
    updateAudioInputs();
  }

  if (showSettings) {
    updateGraph();
  }
}

function onAudioSignalTriggered() {
  playVideo();
}

function activate() {
  if (isActive) return;
  isActive = true;
  update();
}

function deactivate() {
  if (!isActive) return;
  isActive = false;
  stopVideo();
  window.cancelAnimationFrame(updateId);
}

function videoClicked(ev) {
  if (showSettings) {
    app_el.style.display = 'none';
    showSettings = false;
    // turn off the screen if no video is playing
    if (!videoIsPlaying) {
      brightness.setBrightness(0);
    }
  }
  else {
    app_el.style.display = '';
    showSettings = true;
    brightness.setBrightness(1);
  }
}

function log(text) {
  var elem = document.getElementById('log');
  elem.innerHTML = text;
  console.log(text);
}

document.addEventListener('deviceready', function() {
  window.brightness = cordova.require("cordova.plugin.Brightness.Brightness");
  brightness.setKeepScreenOn(true);
  setup();
}, false);
