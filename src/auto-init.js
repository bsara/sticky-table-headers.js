/* globals _globalSTHManager */


;(function() {
  /** @private */
  var _onContentLoaded = function() {
    _globalSTHManager.init();
  };

  if (document.readyState !== 'loading') {
    _onContentLoaded();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', _onContentLoaded);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState === 'complete') {
        _onContentLoaded();
      }
    });
  }
})();
