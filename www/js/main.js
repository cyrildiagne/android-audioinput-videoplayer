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

  updateAudioInputs();

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
  }
  else {
    app_el.style.display = '';
    showSettings = true;
  }
}

function log(text) {
  var elem = document.getElementById('log');
  elem.innerHTML = text;
  console.log(text);
}

document.addEventListener('deviceready', function() {
  keepscreenon.enable();
  setup();
}, false);
