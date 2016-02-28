/**
 * Bar graph for FFT audio signal visualization
 *
 * @author Cyril Diagne (cyril.diagne@ecal.ch)
 */

import config from './config.js';

var canvas, ctx;

/**
 * Setup the graph canvas
 */
function setup() {
  canvas = document.getElementById("graph");
  canvas.addEventListener('click', onClicked, false);
  ctx = canvas.getContext("2d");
}

/**
 * Update the graph
 *
 * @param {Array} buffer the fft array buffer
 */
function update(buffer) {
  const w = canvas.width;
  const h = canvas.height;
  // clear the canvas
  ctx.fillStyle = '#f7f7f7';
  ctx.clearRect(0, 0, w, h);
  // draw the graph
  ctx.fillStyle = 'rgba(255,0,0,0.25)';
  ctx.fillRect(0, h - Math.floor(config.threshold * h), w, 3);
  var barWidth = w / buffer.length;
  for (var i = 0; i < buffer.length; i++) {
    var percent = buffer[i] / 256;
    var height = h * percent;
    var offset = h - height - 1;
    var color = percent > config.threshold ? 'red' : 'lightgrey';
    ctx.fillStyle = color;
    ctx.fillRect(i * barWidth, offset, barWidth, height);
  }
}

/**
 * Handler for click event on the canvas
 * @private
 *
 * @param {Event} ev event
 */
function onClicked(ev) {
  var padding = 10;
  config.threshold = 1 - (ev.clientY - padding) / canvas.clientHeight;
}

/**
 * Export module's public methods
 */
export default {
  setup,
  update
};
