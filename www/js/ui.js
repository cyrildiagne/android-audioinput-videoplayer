/**
 * UI for audio input selection & audio signal visualization
 *
 * @author Cyril Diagne (cyril.diagne@ecal.ch)
 */

import events from './events.js';

var miclist_el,
    miclistlabel_el;

var labelDict = {};

/**
 * Setup the UI
 *
 * @param {Array} micsInfos
 */
function setup(micsInfos) {
  miclist_el = document.querySelector('#mic-list');
  miclistlabel_el = document.querySelector('#mic-list-label');
  for (var md of micsInfos) {
    // get moderated label
    var label = md.label;
    if (!label || label == '') {
      label = md.deviceId;
      if (label.length > 20) {
        label = label.substr(0, 20) + '...';
      }
    }
    labelDict[md.deviceId] = label;
    // create list item
    var li_el = document.createElement('li');
    li_el.className = 'mdl-menu__item';
    li_el.setAttribute('data', 'deviceId: "'+md.deviceId+'"');
    li_el.innerHTML = label;
    li_el.addEventListener('click', onSelectHandler, false);
    // append to mic list
    miclist_el.appendChild(li_el);
  }
}

/**
 * Handler for click events on li elements
 * @private
 *
 * @param {Event} ev click event
 */
function onSelectHandler(ev) {
  var deviceId = ev.target.getAttribute('data').split(':')[1]; // rocknroll
  deviceId = deviceId.replace(/[" ]/g, ''); // remove quotes & spaces
  events.dispatch('select', deviceId);
}

/**
 * Determines which input is being showed in the label
 *
 * @param {int} deviceId the audio input device id
 */
function select(micId) {
  var label = labelDict[micId];
  miclistlabel_el.querySelector('.mic-label').innerHTML = label;
  // close menu if open
  var menu_el = document.querySelector('.mdl-menu__container');
  menu_el.classList.remove('is-visible');
}

/**
 * Export module's public methods
 */
export default {
  setup,
  select,
  events
};
