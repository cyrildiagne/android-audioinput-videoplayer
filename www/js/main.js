import config from 'js/config.js';
import graph  from 'js/graph.js';
import audio  from 'js/audio_input.js';
import ui     from 'js/ui.js';
import video  from 'js/video.js';

var showSettings = true;
var isActive = true;
var app_el = document.getElementById('app');
var updateId = 0;

function setup() {
  // setup audio & grab list of available inputs
  audio.setup(function(inputs) {
    // populate UI with available audio inputs
    ui.setup(inputs);
    ui.events.addListener('select', onInputSelected);
    // use last input available by default (jack/bottom microphone on Android)
    var lastDevice = inputs[inputs.length-1].deviceId;
    audio.use(lastDevice);
    audio.events.addListener('signal', onAudioSignalTriggered);
    audio.events.addListener('using', onAudioDeviceChanged);
    // setup video player
    video.setup();
    video.getEl().addEventListener('click', onVideoClicked, false);
    // setup a graph to visualize audio input signal
    graph.setup();
    // launch update loop
    update();
  });
}

function update() {
  if (isActive) {
    updateId = window.requestAnimationFrame(update);
  }

  // only update audio when settings are showing or video is not playing
  if (showSettings || !video.isPlaying()) {
    audio.update();
  }

  if (showSettings) {
    graph.update(audio.getBuffer());
  }
}

function activate() {
  if (isActive) return;
  isActive = true;
  update();
}

function deactivate() {
  if (!isActive) return;
  isActive = false;
  video.stop();
  window.cancelAnimationFrame(updateId);
}

function log(text) {
  var elem = document.getElementById('log');
  elem.innerHTML = text;
  console.log(text);
}

// -- Events Handlers --

function onInputSelected(deviceId) {
  console.log(deviceId);
  audio.use(deviceId);
}

function onAudioSignalTriggered() {
  video.play();
}

function onAudioDeviceChanged(deviceId) {
  ui.select(deviceId);
}

function onVideoClicked(ev) {
  if (showSettings) {
    app_el.style.display = 'none';
    showSettings = false;
    // turn off the screen if no video is playing
    if (!video.isPlaying()) {
      brightness.setBrightness(0);
    }
  }
  else {
    app_el.style.display = '';
    showSettings = true;
    brightness.setBrightness(1);
  }
}

export default setup;
