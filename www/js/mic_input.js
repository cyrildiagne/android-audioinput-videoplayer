navigator.getUserMedia = navigator.getUserMedia ||
                   navigator.webkitGetUserMedia ||
                   navigator.mozGetUserMedia;

var audioContext,
    analyser,
    fftBuffer,
    mediaStreamSource,
    currStream;

function setupAudio() {
  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0;
  fftBuffer = new Uint8Array(analyser.frequencyBinCount);
}

function getMicrophones(cb) {
  var mics = [];
  navigator.mediaDevices.enumerateDevices()
  .then(function(mediaDeviceInfo) {
    for (var md of mediaDeviceInfo) {
      if (md.kind == 'audioinput') {
        mics.push(md);
      }
    }
    cb(mics);
  });
}

function setMicrophone(microphoneDeviceId) {
  requestUserMedia(microphoneDeviceId, function(stream) {
    createAnalyserSource(stream);

    //TODO(cyril.diagne) dispatch event instead to remove this logic from here
    setMicrophoneDisplay(microphoneDeviceId);
  })
}

function requestUserMedia(deviceId, cb) {
  var opts = {
    audio: {
      optional: [{
        sourceId: deviceId
      }]
    },
  };
  navigator.webkitGetUserMedia(opts, cb, function(err) {
    log("get user media error: " + err.name);
  });
}

function createAnalyserSource(stream) {
  if (mediaStreamSource) {
    mediaStreamSource.disconnect();
    currStream.active = false;
    mediaStreamSource = null;
  }
  // Create an AudioNode from the stream
  currStream = stream;
  mediaStreamSource = audioContext.createMediaStreamSource(stream);
  // Connect it to the analyser
  mediaStreamSource.connect(analyser);
}

function updateAudioInputs() {
  // populate the analyser buffer with frequency bytes
  analyser.getByteFrequencyData(fftBuffer);

  // look for trigger signal
  for (var i = 0; i < analyser.frequencyBinCount; i++) {
    var percent = fftBuffer[i] / 256;
    // TODO(cyril.diagne) very basic / naive implementation where we only look
    // for one bar with amplitude > threshold
    // proper way will be to find the fundamental frequence of the square wave
    if (percent > threshold) {
        // TODO(cyril.diagne) dispatch event instead of calling directly
        onAudioSignalTriggered();
        return;
    }
  }
}
