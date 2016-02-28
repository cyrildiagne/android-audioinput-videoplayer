/**
 * Event dispatcher module
 *
 * @author Cyril Diagne (cyril.diagne@ecal.ch)
 */

var listeners = {}

/**
 * Register a handler for a event
 *
 * @param {String} event event name
 * @param {Function} fn event handler
 */
function addListener(event, fn) {
  listeners[event] = listeners[event] || []
  listeners[event].push(fn)
}

/**
 * Removes a handler of a event
 *
 * @param {String} event event name
 * @param {Function} fn event handler
 */
function removeListener(event, fn) {
  var handlers = listeners[event]
  handlers.splice(handlers.indexOf(fn), 1)
}

/**
 * Dispatches an event
 *
 * @param {String} event event name
 * @param {args} arguments to send to handlers
 */
function dispatch(event, ...args) {
  const eventListeners = listeners[event]
  if (eventListeners) {
    eventListeners.forEach(function(event) {
      event.apply(null, args)
    })
  }
}

/**
 * Handlers for an event
 *
 * @param {String} event event name
 * @return {Array} list of handlers
 */
function getHandlers(event) {
  return listeners[event]
}

/**
 * Clear list of handlers for an event
 *
 * @param {String} event event name
 */
function clearHandlers(event) {
  if (event) {
    listeners[event] = []
  }
}

/**
 * Export module's public methods
 */
export default {
  addListener,
  removeListener,
  dispatch,
  getHandlers,
  clearHandlers
};
