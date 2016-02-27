var threshold = 0.4;

function setup() {
  // get list of vailable microphones
  getMicrophones(function(microphones) {
    // populate select input
    setupSelectUI(microphones);

    setMicrophone(microphones[microphones.length-1].deviceId);

    setupCanvas();
    setupAudio();
    update();
  });
}

function update() {
  window.requestAnimationFrame(update);
  // populate the analyser buffer with frequency bytes
  analyser.getByteFrequencyData(analyserBuffer);
  // draw a frequency graph
  drawFreq(analyserBuffer);
}

function log(text) {
  var elem = document.getElementById('log');
  elem.innerHTML = text;
  console.log(text);
}
