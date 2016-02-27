navigator.getUserMedia = navigator.getUserMedia ||
                   navigator.webkitGetUserMedia ||
                   navigator.mozGetUserMedia;

var audioContext,
    analyser,
    analyserBuffer,
    mediaStreamSource,
    currStream;

function setupAudio() {
  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0;
  analyserBuffer = new Uint8Array(analyser.frequencyBinCount);
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
