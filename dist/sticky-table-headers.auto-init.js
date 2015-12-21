/*!
 * sticky-table-headers.js (0.0.1)
 *
 * Copyright (c) 2015 Brandon Sara (http://bsara.github.io)
 * Licensed under the CPOL-1.02 (https://github.com/bsara/stickytableheaders.js/blob/v0.0.1/LICENSE.md)
 */


(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.StickyTableHeaders = factory();
  }
}(this, function(require, exports, module) {

/**
 * TODO: Add description
 *
 * @type {Object}
 * @readonly
 */
var _sth = {
  /**
   * @private
   * @readonly
   */
  constants: {
    CSS_CLASS_NAME                        : 'sth-sticky',
    SCROLLABLE_ELEMENT_SELECTOR_ATTR_NAME : 'data-sth-scrollable-selector'
  },


  /**
   * @private
   * @readonly
   */
  helpers: {
    addEventListener: function($el, type, handler) {
      if ($el.attachEvent) {
        $el.attachEvent('on' + type, handler);
        return;
      }
      $el.addEventListener(type, handler, false);
    },


    removeEventListener: function($el, type, handler) {
      if ($el.detachEvent) {
        $el.detachEvent('on' + type);
        return;
      }
      $el.removeEventListener(type, handler);
    },


    removeUnit: function(value) {
      if (typeof value !== 'string' || value === null) {
        throw new TypeError('`value` argument must be a non-null string!');
      }
      return ((value.trim() === '') ? 0 : Number(value.trim().replace(/[a-z]*$/i, '')));
    }
  }
};


Object.freeze(_sth);var StickyTableHeader = (function() {

  /**
   * TODO: Add description
   *
   * @constructor
   *
   * @param {HTMLElement} tableElement - The table to add a sticky header to.
   * @param {HTMLElement} [scrollableElement] - The scrollable element containing the given `tableElement`.
   *
   * @throws {TypeError} Thrown if `tableElement` is `undefined` or `null`.
   */
  function StickyTableHeader(tableElement, scrollableElement) {
    if (tableElement == null) {
      throw new TypeError("`tableElement` is a required parameter!");
    }

    if (this.constructor !== StickyTableHeader) {
      return new StickyTableHeader(tableElement, scrollableElement);
    }


    Object.defineProperties(this, {
      /**
       * @type {Object}
       * @private
       */
      _onChangeTableChildrenObserver: {
        configurable: true,
        enumerable:   false,
        writable:     true,
        value:        undefined
      },

      /**
       * @type {Object}
       * @private
       */
      _onChangeTableScrollableElementSelectorObserver: {
        configurable: true,
        enumerable:   false,
        writable:     true,
        value:        undefined
      },


      /**
       * @type {Function}
       * @private
       */
      _onChange: {
        configurable: false,
        enumerable:   false,
        writable:     false,
        value:        _onChange.bind(this)
      }
    });


    /** @type {HTMLElement} */ this.$table       = tableElement;
    /** @type {HTMLElement} */ this.$tableHeader = undefined;
    /** @type {HTMLElement} */ this.$scrollable  = undefined;



    if (!this.$table.classList.contains(_sth.constants.CSS_CLASS_NAME)) {
      this.$table.classList.add(_sth.constants.CSS_CLASS_NAME);
    }

    _setTableHeader.call(this, this.$table.querySelector('thead'));

    if (scrollableElement == null) {
      _setScrollableElementWithSelector.call(this);
    } else {
      _setScrollableElement.call(this, scrollableElement);
    }


    this._onChangeTableChildrenObserver = new MutationObserver(_onChangeTableChildren.bind(this));
    this._onChangeTableChildrenObserver.observe(this.$table, { childList: true });

    this._onChangeTableScrollableElementSelectorObserver = new MutationObserver(_onChangeTableScrollableElementSelector.bind(this));
    this._onChangeTableScrollableElementSelectorObserver.observe(this.$table, { attributes: true });
  }



  /**
   * TODO: Add description
   */
  StickyTableHeader.prototype.destroy = function() {
    this._onChangeTableChildrenObserver.disconnect();
    this._onChangeTableScrollableElementSelectorObserver.disconnect();


    _sth.helpers.removeEventListener(window, 'resize', this._onChange);

    if (this.$scrollable != null) {
      _sth.helpers.removeEventListener(this.$scrollable, 'scroll', this._onChange);
    }


    this.$table.classList.remove(_sth.constants.CSS_CLASS_NAME);

    if (this.$tableHeader != null) {
      this.$tableHeader.classList.remove(_sth.constants.CSS_CLASS_NAME);
    }


    delete this.$table;
    delete this.$tableHeader;
    delete this.$scrollable;
    delete this._onChangeTableChildrenObserver;
    delete this._onChangeTableScrollableElementSelectorObserver;
    delete this._onChange;
  };


  /** @private */
  var _setTableHeader = function(tableHeaderElement) {
    this.$tableHeader = tableHeaderElement;

    if (this.$tableHeader != null) {
      // TODO: Implement
    }
  };


  /** @private */
  var _setScrollableElementWithSelector = function() {
    var scrollableElementSelector = this.$table.getAttribute(_sth.constants.SCROLLABLE_ELEMENT_SELECTOR_ATTR_NAME);

    if (scrollableElementSelector != null
          && typeof scrollableElementSelector === 'string'
          && scrollableElementSelector.trim()) {
      _setScrollableElement.call(this, document.querySelector(scrollableElementSelector.trim()));
    }

    if (this.$scrollable == null) {
      _setScrollableElement.call(this, this.$table.parentNode);
    }
  };


  /** @private */
  var _setScrollableElement = function(scrollableElement) {
    this.$scrollable = scrollableElement;

    if (this.$scrollable != null) {
      _sth.helpers.addEventListener(this.$scrollable, 'scroll', this._onChange);
      _sth.helpers.addEventListener(window, 'resize', this._onChange);
      return;
    }

    _sth.helpers.removeEventListener(window, 'resize', this._onChange);
  };


  /** @private */
  var _onChange = function() {
    if (this.$tableHeader == null) {
      return;
    }


    var scrollableElementTop = this.$scrollable.getBoundingClientRect().top;

    if (this.$table.getBoundingClientRect().top < scrollableElementTop) {
      var tableDimens = this.$table.getBoundingClientRect();

      var tableLeftBorderWidth = _sth.helpers.removeUnit(window.getComputedStyle(this.$table, null).getPropertyValue('border-left-width'));

      var tableHeaderComputedStyle    = window.getComputedStyle(this.$tableHeader, null);
      var tableHeaderTopBorderWidth   = _sth.helpers.removeUnit(tableHeaderComputedStyle.getPropertyValue('border-top-width'));
      var tableHeaderLeftBorderWidth  = _sth.helpers.removeUnit(tableHeaderComputedStyle.getPropertyValue('border-left-width'));
      var tableHeaderRightBorderWidth = _sth.helpers.removeUnit(tableHeaderComputedStyle.getPropertyValue('border-right-width'));

      this.$tableHeader.style.top   = scrollableElementTop - tableDimens.top + tableHeaderTopBorderWidth + 'px';
      this.$tableHeader.style.left  = tableHeaderLeftBorderWidth - tableLeftBorderWidth + 'px';
      this.$tableHeader.style.width = 'calc(100% + ' + tableHeaderRightBorderWidth + 'px)';


      var tableHeaderCells              = this.$tableHeader.querySelectorAll('th');
      var tableBodyFirstRowCells        = this.$table.querySelectorAll('tbody > tr td');
      var tableBodyFirstRowCellsIsEmpty = (tableBodyFirstRowCells == null || tableBodyFirstRowCells.length === 0);
      var equalWidthAmount              = (100 / tableHeaderCells.length) + '%';

      for (var i = 0; i < tableHeaderCells.length; i++) {
        var $tableHeaderCell = tableHeaderCells[i];

        if (tableBodyFirstRowCellsIsEmpty) {
          $tableHeaderCell.style.width = equalWidthAmount;
          continue;
        }

        $tableHeaderCell.style.width = window.getComputedStyle(tableBodyFirstRowCells[i], undefined).getPropertyValue('width');
      }

      this.$tableHeader.classList.add(_sth.constants.CSS_CLASS_NAME);

      return;
    }

    this.$tableHeader.classList.remove(_sth.constants.CSS_CLASS_NAME);
    this.$tableHeader.removeAttribute('style');
  };


  /** @private */
  var _onChangeTableChildren = function(mutations) {
    mutations.forEach(function(mutation) {
      var i;

      for (i = 0; i < mutation.addedNodes.length; i++) {
        if (mutation.addedNodes[i].nodeName === 'thead') {
          _setTableHeader.call(this, mutation.addedNodes[i]);
          break;
        }
      }

      for (i = 0; i < mutation.removedNodes.length; i++) {
        if (mutation.removedNodes[i].nodeName === 'thead') {
          _setTableHeader.call(this, undefined);
          break;
        }
      }
    });
  };


  /** @private */
  var _onChangeTableScrollableElementSelector = function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === _sth.constants.SCROLLABLE_ELEMENT_SELECTOR_ATTR_NAME) {
        _setScrollableElementWithSelector.call(this);
      }
    });
  };



  return StickyTableHeader;
})();var StickyTableHeaderManager = (function() {

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


var _globalSTHManager = new StickyTableHeaderManager();;(function() {
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

return (function() {
  var ret = {};
  Object.defineProperties(ret, {
    manager: {
      configurable: false,
      enumerable:   true,
      writable:     false,
      value:        new StickyTableHeaderManager()
    },
    StickyTableHeader: {
      configurable: false,
      enumerable:   true,
      writable:     false,
      value:        StickyTableHeader
    }
  });
  return ret;
})();

}));
