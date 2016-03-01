/* globals enableStickyTableHeader, disableStickyTableHeader */
/* exported StickyTableHeaderManager, _globalSTHManager */


/**
 * @constructor
 * @private
 */
function StickyTableHeaderManager() {
  if (this.constructor !== StickyTableHeaderManager) {
    return new StickyTableHeaderManager();
  }



  /**
   * @type {HTMLElement[]}
   * @private
   */
  var _tableElements;




  /**
   * @constructs {StickyTableHeaderManager}
   * @private
   */
  ;(function ctor() {
    // region Public Functions

    this.init      = init;
    this.reinit    = reinit;
    this.add       = add;
    this.remove    = remove;
    this.removeAll = removeAll;

    // endregion


    _tableElements = [];
  }).call(this);



  /**
   * TODO: Add description
   */
  function init() {
    var tableElements = document.querySelectorAll('table.' + _sth.constants.CSS_CLASS_NAME);

    for (var i = 0; i < tableElements.length; i++) {
      this.add(tableElements[i]);
    }
  }


  /**
   * TODO: Add description
   */
  function reinit() {
    this.removeAll();
    this.init();
  }


  /**
   * Makes the headers of the give table element (`tableElement`) sticky.
   *
   * @param {HTMLElement} tableElement        - The table where sticky headers are to be enabled.
   * @param {HTMLElement} [scrollableElement] - The scrollable element containing the given `tableElement`.
   *
   * @throws {ReferenceError} If `tableElement` is `null` or `undefined`.
   * @throws {TypeError}      If `tableElement` is not of type `HTMLElement` or `scrollableElement` if is
   *                          not `null` or `undefined` and is not of type `HTMLElement`.
   *
   * @returns {HTMLElement} The table element given.
   */
  function add(tableElement, scrollableElement) {
    if (_tableElements.indexOf(tableElement) > -1) {
      return tableElement;
    }

    enableStickyTableHeader(tableElement, scrollableElement);
    _tableElements.push(tableElement);

    return tableElement;
  }


  function remove(tableElement) {
    var index = _tableElements.indexOf(tableElement);

    if (index > -1) {
      disableStickyTableHeader(tableElement);
      _tableElements.splice(index, 1);
    }

    return tableElement;
  }


  /**
   * TODO: Add description
   */
  function removeAll() {
    for (var i = _tableElements.length; i >= 0; i--) {
      this.remove(i);
    }
  }
}



var _globalSTHManager = new StickyTableHeaderManager();
