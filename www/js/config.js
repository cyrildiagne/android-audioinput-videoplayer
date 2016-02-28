/**
 * Static configuration module
 *
 * @author Cyril Diagne (cyril.diagne@ecal.ch)
 */

// store global reference in window object
if (!window.config_) {
  window.config_ = {
    threshold: 0.5
  }
}

/**
 * Export config object
 */
export default window.config_;
