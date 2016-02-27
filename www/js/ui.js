var miclist_el,
    miclistlabel_el;

var labelDict = {};

function setupSelectUI(micsInfos) {

  miclist_el = document.querySelector('#mic-list');
  miclistlabel_el = document.querySelector('#mic-list-label');
  // miclist_el.addEventListener('change', onSelectChange, false);

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
    li_el.addEventListener('click', liSelectedHandler, false);
    // append to mic list
    miclist_el.appendChild(li_el);
  }
}

function liSelectedHandler(ev) {
  var deviceId = ev.target.getAttribute('data').split(':')[1]; // rocknroll
  deviceId = deviceId.replace(/[" ]/g, ''); // remove quotes & spaces
  //TODO(cyril.diagne) dispatch event instead to remove this logic from view
  setMicrophone(deviceId);
}

function setMicrophoneDisplay(micId) {
  console.log(micId);
  var label = labelDict[micId];
  miclistlabel_el.querySelector('.mic-label').innerHTML = label;

  // close menu if open
  var menu_el = document.querySelector('.mdl-menu__container');
  menu_el.classList.remove('is-visible');
}
