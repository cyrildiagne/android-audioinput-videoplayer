/*
* shared events accross application
*/

var listeners = {}

function addListener(event, fn) {
  listeners[event] = listeners[event] || []
  listeners[event].push(fn)
}

function removeListener(event, fn) {
  var handlers = listeners[event]
  handlers.splice(handlers.indexOf(fn), 1)
}

function dispatch(event, ...args) {
  const eventListeners = listeners[event]
  if (eventListeners) {
    eventListeners.forEach(function(event) {
      event.apply(null, args)
    })
  }
}

function getHandlers(event) {
  return listeners[event]
}

function clearHandlers(event) {
  if (event) {
    listeners[event] = []
  }
}

export default {
  addListener,
  removeListener,
  dispatch,
  getHandlers,
  clearHandlers
};
