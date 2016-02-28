/**
 * Audio input module that configures and retrieves fft data
 * from a selected audio input
 *
 * @author Cyril Diagne (cyril.diagne@ecal.ch)
 */

import events from './events.js';
import config from './config.js';

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

var ctx,
    analyser,
    buffer,
    mediaStreamSource;

/**
 * Setup the audio inputs, context & buffers
 *
 * @param {Function} callback called when list of inputs is available
 */
function setup(cb) {
  ctx = new AudioContext();
  analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0;
  buffer = new Uint8Array(analyser.frequencyBinCount);
  retrieveAvailableInputs(cb);
}

/**
 * Update buffers & look for trigger signal
 */
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
        events.dispatch('signal');
        return;
    }
  }
}

/**
 * Specify which audio input device to use
 *
 * @param {String} deviceId audio input device id
 */
// TODO fix microphone selection which doesn't seem to work on Android
function use(deviceId) {
  requestUserMedia(deviceId, function(stream) {
    createAnalyserSource(stream);
    events.dispatch('using', deviceId);
  })
}

/**
 * Retrieve the list of available input devices
 * @private
 *
 * @param {Function} cb callback called when the list is ready
 */
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

/**
 * Prompt user for authorization to use audio input device
 * @private
 *
 * @param {String} deviceId audio input device id
 * @param {Function} cb callback called when the access is ready
 */
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
    console.log("get user media error: " + err.name);
  });
}

/**
 * Create a media stream source and connect it to the analyser
 * @private
 *
 * @param {MediaStreamSource} stream to connect
 */
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

/**
 * Retrieve analyser's FFT buffer
 *
 * @return {Array} FFT datas
 */
function getBuffer() {
  return buffer;
}

/**
 * Export module's public methods
 */
export default {
  setup,
  update,
  use,
  events,
  getBuffer
};
