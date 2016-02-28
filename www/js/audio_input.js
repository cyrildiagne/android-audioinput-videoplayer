import events from './events.js';
import config from './config.js';

navigator.getUserMedia = navigator.getUserMedia ||
                   navigator.webkitGetUserMedia ||
                   navigator.mozGetUserMedia;

var ctx,
    analyser,
    buffer,
    mediaStreamSource;

function setup(cb) {
  ctx = new AudioContext();
  analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0;
  buffer = new Uint8Array(analyser.frequencyBinCount);
  retrieveAvailableInputs(cb);
}

function update() {
  // populate the analyser buffer with frequency bytes
  analyser.getByteFrequencyData(buffer);
  // look for trigger signal
  for (var i = 0; i < analyser.frequencyBinCount; i++) {
    var percent = buffer[i] / 256;
    // TODO very basic / naive implementation where we only look
    // for one bar with amplitude > threshold
    // proper way will be to find the fundamental frequence of the square wave
    if (percent > config.threshold) {
        //onAudioSignalTriggered();
        events.dispatch('signal');
        return;
    }
  }
}

// TODO fix microphone selection which doesn't seem to work on Android
function use(deviceId) {
  requestUserMedia(deviceId, function(stream) {
    createAnalyserSource(stream);
    //setInputDisplay(deviceId);
    events.dispatch('using', deviceId);
  })
}

// - PRIVATE -

function retrieveAvailableInputs(cb) {
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

function requestUserMedia(deviceId, cb) {
  // only set the desired deviceId as option
  var opts = {
    audio: {
      optional: [{
        sourceId: deviceId
      }]
    },
  };
  // prompt user for access authorization to audio input
  navigator.getUserMedia(opts, cb, function(err) {
    log("get user media error: " + err.name);
  });
}

function createAnalyserSource(stream) {
  // close current media source and stream if any
  if (mediaStreamSource) {
    mediaStreamSource.disconnect();
    mediaStreamSource = null;
  }
  // Create an AudioNode from the stream
  mediaStreamSource = ctx.createMediaStreamSource(stream);
  // Connect it to the analyser
  mediaStreamSource.connect(analyser);
}

function getBuffer() {
  return buffer;
}

// export public function & properties
export default {
  setup : setup,
  update : update,
  use : use,
  events : events,
  getBuffer : getBuffer
};
