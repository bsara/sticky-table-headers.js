/* globals StickyTableHeader */
/* exported StickyTableHeaderManager, _globalSTHManager */


var StickyTableHeaderManager = (function() {

  /** @private */
  function StickyTableHeaderManager() {
    if (this.constructor !== StickyTableHeaderManager) {
      return new StickyTableHeaderManager();
    }


    Object.defineProperties(this, {
      /**
       * @type {Object}
       * @private
       */
      _stickyTableHeaders: {
        configurable: true,
        enumerable:   false,
        writable:     true,
        value:        []
      },

      /**
       * @type {Object}
       * @private
       */
      _tableElements: {
        configurable: true,
        enumerable:   false,
        writable:     true,
        value:        []
      }
    });
  }


  /**
   * TODO: Add description
   */
  StickyTableHeaderManager.prototype.init = function() {
    var tableElements = document.querySelectorAll('table.' + _sth.constants.CSS_CLASS_NAME);

    for (var i = 0; i < tableElements.length; i++) {
      _add.call(this, tableElements[i]);
    }
  };


  /**
   * TODO: Add description
   */
  StickyTableHeaderManager.prototype.reinit = function() {
    this.removeAll();
    this.init();
  };


  /**
   * TODO: Add description
   */
  StickyTableHeaderManager.prototype.removeAll = function() {
    for (var i = this._tableElements.length; i >= 0; i--) {
      _remove.call(this, i);
    }
  };


  /**
   * TODO: Add description
   *
   * @param {HTMLElement} tableElement - The table to add a sticky header to.
   * @param {HTMLElement} [scrollableElement] - The scrollable element containing the given `tableElement`.
   *
   * @returns {HTMLElement} The table element given.
   */
  StickyTableHeaderManager.prototype.addStickyHeaderToTable = function(tableElement, scrollableElement) {
    if (this._tableElements.indexOf(tableElement) > -1) {
      return tableElement;
    }

    _add.call(this, tableElement, scrollableElement);

    return tableElement;
  };


  /**
   * TODO: Add description
   *
   * @param {HTMLElement} tableElement - The table to remove a sticky header from.
   *
   * @returns {HTMLElement} The table element given.
   */
  StickyTableHeaderManager.prototype.removeStickyHeaderFromTable = function(tableElement) {
    var index = this._tableElements.indexOf(tableElement);

    if (index > -1) {
      _remove.call(this, index);
    }
  };


  /** @private */
  var _add = function(tableElement, scrollableElement) {
    this._stickyTableHeaders.push(new StickyTableHeader(tableElement, scrollableElement));
    this._tableElements.push(tableElement);
  };


  /** @private */
  var _remove = function(index) {
    this._stickyTableHeaders.splice(index, 1)[0].destroy();
    this._tableElements.splice(index, 1);
  };


  return StickyTableHeaderManager;
})();


var _globalSTHManager = new StickyTableHeaderManager();
