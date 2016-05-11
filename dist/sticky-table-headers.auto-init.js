/*!
 * sticky-table-headers.js (0.2.1)
 *
 * Copyright (c) 2016 Brandon Sara (http://bsara.github.io)
 * Licensed under the CPOL-1.02 (https://github.com/bsara/stickytableheaders.js/blob/v0.2.1/LICENSE.md)
 */


(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.STH = factory();
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
    CSS_CLASS_NAME:                        'sth-sticky',
    SCROLLABLE_ELEMENT_SELECTOR_ATTR_NAME: 'data-sth-scrollable-selector'
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
      if (value == null || typeof value !== 'string') {
        throw new TypeError('`value` parameter must be a non-null/non-undefined string!');
      }
      return ((value.trim() === '') ? 0 : Number(value.trim().replace(/[a-z]*$/i, '')));
    }
  }
};


Object.freeze(_sth);/**
 * @typedef {Object} StickyTableHeaderOptions
 * @property {HTMLElement} tableElement           - The table element to add a sticky header to.
 * @property {HTMLElement} [scrollableElement]    - The scrollable element containing the given `tableElement`.
 * @property {Boolean}     [includeCaption=false] - If `true` and a `caption` element exists in the given
 *                                                  table element, then the `caption` element will be sticky
 *                                                  along with the `thead` element of the given table element.
 */



/**
 * TODO: Add description
 *
 * @param {(HTMLElement|StickyTableHeaderOptions)} tableElement|options - The table element to add a sticky
 *                                                                        header to or the options used to
 *                                                                        setup this object.
 * @param {HTMLElement} [scrollableElement] - The scrollable element containing the given `tableElement`.
 *
 * @throws {ReferenceError} If `tableElement` and `options.tableElement` are `null` or `undefined`.
 *
 * @constructor
 */
function StickyTableHeader(options, scrollableElement) {
  if (this.constructor !== StickyTableHeader) {
    return new StickyTableHeader(options, scrollableElement);
  }



  /** @type {MutationObserver}
   * @private
   */
  var _onChangeTableChildrenObserver;

  /**
   * @type {MutationObserver}
   * @private
   */
  var _onChangeTableScrollableElementSelectorObserver;

  /**
   * @type {Function}
   * @private
   */
  var _onChange;

  /**
   * @type {Function}
   * @private
   */
  var _onChangeTableChildren;

  /**
   * @type {Function}
   * @private
   */
  var _onChangeTableScrollableElementSelector;

  /**
   * @type {!Boolean}
   * @private
   */
  var _includeCaption;

  /**
   * @type {Object[]}
   * @private
   */
  var _origHeaderStyleWidths;

  /**
   * @type {HTMLElement}
   * @private
   */
  var _$scrollable;

  /**
   * @type {HTMLElement}
   * @private
   */
  var _$table;

  /**
   * @type {?HTMLElement}
   * @private
   */
  var _$tableCaption;

  /**
   * @type {HTMLElement}
   * @private
   */
  var _$tableHeader;




  /**
   * @constructs {StickyTableHeader}
   * @private
   */
  ;(function ctor() {
    // region Public Functions

    this.destroy = destroy.bind(this);

    Object.defineProperties(this, {
      /** @type {!Boolean} */
      includeCaption: {
        get: _includeCaptionGetter,
        set: _includeCaptionSetter
      },

      /** @type {HTMLElement} */
      $scrollable: {
        get: _$scrollableGetter,
        set: _$scrollableSetter
      },

      /** @type {HTMLElement} */
      $table: {
        get: _$tableGetter,
        set: _$tableSetter
      }
    });

    // endregion

    // region Event Handler Function Bindings

    _onChange                               = _onChangeHandler.bind(this);
    _onChangeTableChildren                  = _onChangeTableChildrenHandler.bind(this);
    _onChangeTableScrollableElementSelector = _onChangeTableScrollableElementSelectorHandler.bind(this);

    // endregion


    options = (options || {});

    if (options instanceof HTMLElement) {
      options = { tableElement: options };
    }


    _origHeaderStyleWidths = [];

    this.includeCaption = options.includeCaption;

    this.$table      = options.tableElement;
    this.$scrollable = (scrollableElement || options.scrollableElement);


    _onChangeTableChildrenObserver = new MutationObserver(_onChangeTableChildren);
    _onChangeTableChildrenObserver.observe(this.$table, { childList: true });

    _onChangeTableScrollableElementSelectorObserver = new MutationObserver(_onChangeTableScrollableElementSelector);
    _onChangeTableScrollableElementSelectorObserver.observe(this.$table, { attributes: true });
  }).call(this);




  /**
   * TODO: Add description
   */
  function destroy() {
    _onChangeTableChildrenObserver.disconnect();
    _onChangeTableScrollableElementSelectorObserver.disconnect();


    _sth.helpers.removeEventListener(window, 'resize', _onChange);

    if (this.$scrollable != null) {
      _sth.helpers.removeEventListener(this.$scrollable, 'scroll', _onChange);
    }


    this.$table.classList.remove(_sth.constants.CSS_CLASS_NAME);

    if (_$tableHeader != null) {
      _$tableHeader.classList.remove(_sth.constants.CSS_CLASS_NAME);
    }


    _onChangeTableChildrenObserver                  = undefined;
    _onChangeTableScrollableElementSelectorObserver = undefined;

    _$table       = undefined;
    _$scrollable  = undefined;
    _$tableHeader = undefined;
  }


  /** @private */
  function _includeCaptionGetter() {
    return _includeCaption;
  }


  /** @private */
  function _includeCaptionSetter(includeCaption) {
    _includeCaption = (includeCaption === true);
  }


  /** @private */
  function _$tableGetter() {
    return _$table;
  }


  /** @private */
  function _$tableSetter(tableElement) {
    if (tableElement == null) {
      throw new ReferenceError("`$table` cannot be `null` or `undefined`.");
    }

    _$table = tableElement;

    if (!_$table.classList.contains(_sth.constants.CSS_CLASS_NAME)) {
      _$table.classList.add(_sth.constants.CSS_CLASS_NAME);
    }

    _setTableCaption.call(this, _$table.querySelector('caption'));
    _setTableHeader.call(this, _$table.querySelector('thead'));
  }


  /** @private */
  function _$scrollableGetter() {
    return _$scrollable;
  }


  /** @private */
  function _$scrollableSetter(scrollableElement) {
    if (scrollableElement == null) {
      _setScrollableElementWithSelector.call(this);
    } else {
      _setScrollableElementWithElement.call(this, scrollableElement);
    }

    if (_$scrollable == null) {
      _setScrollableElementWithElement.call(this, _findScrollableParent(this.$table));
    }
  }


  /** @private */
  function _setScrollableElementWithElement(scrollableElement) {
    if (scrollableElement === _$scrollable) {
      return;
    }


    if (_$scrollable != null) {
      _sth.helpers.removeEventListener(_$scrollable, 'scroll', _onChange);
      _sth.helpers.removeEventListener(window, 'resize', _onChange);
    }

    _$scrollable = scrollableElement;

    if (_$scrollable != null) {
      _sth.helpers.addEventListener(_$scrollable, 'scroll', _onChange);
      _sth.helpers.addEventListener(window, 'resize', _onChange);
    }
  }


  /** @private */
  function _setScrollableElementWithSelector() {
    var scrollableElementSelector = this.$table.getAttribute(_sth.constants.SCROLLABLE_ELEMENT_SELECTOR_ATTR_NAME);

    if (scrollableElementSelector != null
          && typeof scrollableElementSelector === 'string'
          && scrollableElementSelector.trim()) {
      _setScrollableElementWithElement.call(this, document.querySelector(scrollableElementSelector.trim()));
    }
  }


  /** @private */
  function _findScrollableParent($el) {
    if ($el.parentNode == null) {
      return $el;
    }

    var $parent             = $el.parentNode;
    var parentComputedStyle = getComputedStyle($parent);

    switch (parentComputedStyle.overflowY) {
      case 'auto':
      case 'scroll':
        return $parent;
    }

    return _findScrollableParent($parent);
  }


  /** @private */
  function _setTableCaption(tableCaptionElement) {
    _$tableCaption = tableCaptionElement;
  }


  /** @private */
  function _setTableHeader(tableHeaderElement) {
    _$tableHeader = tableHeaderElement;
  }


  /** @private */
  function _onChangeHandler() {
    if (_$tableHeader == null) {
      return;
    }


    var captionExists = (_$tableCaption != null);

    var tablePositionTop = this.$table.getBoundingClientRect().top;

    var tableCaptionComputedStyle;
    var tableCaptionDimens;
    var tableCaptionMarginBottom;

    var tableHeaderCells         = _$tableHeader.querySelectorAll('th');
    var tableHeaderComputedStyle = getComputedStyle(_$tableHeader);
    var tableHeaderMarginTop     = _sth.helpers.removeUnit(tableHeaderComputedStyle.getPropertyValue('margin-top'));

    var scrollableElementBorderTopWidth = _sth.helpers.removeUnit(getComputedStyle(this.$scrollable).getPropertyValue('border-top-width'));
    var scrollableElementTop            = this.$scrollable.getBoundingClientRect().top;
    var scrollingThreshold              = tablePositionTop;


    if (captionExists) {
      tableCaptionComputedStyle = getComputedStyle(_$tableCaption);
      tableCaptionDimens        = _$tableCaption.getBoundingClientRect();
      tableCaptionMarginBottom  = _sth.helpers.removeUnit(tableCaptionComputedStyle.getPropertyValue('margin-bottom'));

      scrollingThreshold += _sth.helpers.removeUnit(tableCaptionComputedStyle.getPropertyValue('margin-top'));

      if (!this.includeCaption) {
        scrollingThreshold += (tableCaptionDimens.height + tableCaptionMarginBottom);
      }
    }

    if (!this.includeCaption) {
      scrollingThreshold += tableHeaderMarginTop;
    }


    if (scrollingThreshold < scrollableElementTop) {
      if (captionExists && this.includeCaption) {
        _setNewTopDimenForTopStickyElement(_$tableCaption, scrollableElementTop, scrollableElementBorderTopWidth, tablePositionTop);
        _setNewLeftRightDimensForStickyElement(_$tableCaption, tableCaptionComputedStyle);

        _$tableHeader.style.top = ((_sth.helpers.removeUnit(tableCaptionComputedStyle.getPropertyValue('top'))
                                    + tableCaptionDimens.height
                                    + tableCaptionMarginBottom
                                    + tableHeaderMarginTop) + 'px');
      } else {
        _setNewTopDimenForTopStickyElement(_$tableHeader, scrollableElementTop, scrollableElementBorderTopWidth, tablePositionTop);
      }

      _setNewLeftRightDimensForStickyElement(_$tableHeader, tableHeaderComputedStyle);


      _processTableHeaderCells.call(this, tableHeaderCells);


      if (captionExists && this.includeCaption) {
        _$tableCaption.classList.add(_sth.constants.CSS_CLASS_NAME);
      }
      _$tableHeader.classList.add(_sth.constants.CSS_CLASS_NAME);


      return;
    }


    if (captionExists && this.includeCaption) {
      _cleanupStickyElement(_$tableCaption);
    }
    _cleanupStickyElement(_$tableHeader);

    _cleanupTableHeaderCellStyles(tableHeaderCells);
  }


  /** @private */
  function _setNewTopDimenForTopStickyElement($el, scrollableElTop, scrollableElBorderTopWidth, tablePositionTop) {
    $el.style.top = ((scrollableElTop - tablePositionTop + scrollableElBorderTopWidth) + 'px');
  }


  /** @private */
  function _setNewLeftRightDimensForStickyElement($el, elComputedStyle) {
    var elMarginRight      = _sth.helpers.removeUnit(elComputedStyle.getPropertyValue('margin-right'));
    var elBorderRightWidth = _sth.helpers.removeUnit(elComputedStyle.getPropertyValue('border-right-width'));

    $el.style.left  = elComputedStyle.getPropertyValue('margin-left');
    $el.style.right = ((elMarginRight - elBorderRightWidth) + 'px');
  }


  /** @private */
  function _processTableHeaderCells(tableHeaderCells) {
    var tableBodyFirstRowCells        = this.$table.querySelectorAll('tbody > tr td');
    var tableBodyFirstRowCellsIsEmpty = (tableBodyFirstRowCells == null || tableBodyFirstRowCells.length === 0);
    var equalWidthAmount              = ((100 / tableHeaderCells.length) + '%');

    var isFirstTimeThrough = (_origHeaderStyleWidths.length === 0);

    for (var i = 0; i < tableHeaderCells.length; i++) {
      var $tableHeaderCell = tableHeaderCells[i];

      if (isFirstTimeThrough) {
        _origHeaderStyleWidths.push({
          width:    $tableHeaderCell.style.getPropertyValue('width'),
          priority: $tableHeaderCell.style.getPropertyPriority('width')
        });
      }

      if (tableBodyFirstRowCellsIsEmpty) {
        $tableHeaderCell.style.width = equalWidthAmount;
        continue;
      }


      var expectedNewWidth = _sth.helpers.removeUnit(getComputedStyle(tableBodyFirstRowCells[i]).getPropertyValue('width'));


      $tableHeaderCell.style.width = (expectedNewWidth + 'px');


      var newWidth = $tableHeaderCell.getBoundingClientRect().width;

      if (newWidth < expectedNewWidth) {
        $tableHeaderCell.style.width = ((expectedNewWidth + (expectedNewWidth - newWidth)) + 'px');
      } else if (newWidth > expectedNewWidth) {
        $tableHeaderCell.style.width = ((expectedNewWidth - (newWidth - expectedNewWidth)) + 'px');
      }
    }
  }


  /** @private */
  function _cleanupStickyElement($el) {
    $el.classList.remove(_sth.constants.CSS_CLASS_NAME);
    $el.removeAttribute('style');
  }


  /** @private */
  function _cleanupTableHeaderCellStyles(tableHeaderCells) {
    if (_origHeaderStyleWidths.length === 0) {
      return;
    }

    for (var i = 0; i < tableHeaderCells.length; i++) {
      var $tableHeaderCell = tableHeaderCells[i];
      var origValues       = _origHeaderStyleWidths[i];

      if (origValues.width == null) {
        $tableHeaderCell.style.removeProperty('width');
        continue;
      }

      $tableHeaderCell.style.setProperty('width', origValues.width, origValues.priority);
    }

    _origHeaderStyleWidths.splice(0, _origHeaderStyleWidths.length);
  }


  /** @private */
  function _onChangeTableChildrenHandler(mutations) {
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
  }


  /** @private */
  function _onChangeTableScrollableElementSelectorHandler(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === _sth.constants.SCROLLABLE_ELEMENT_SELECTOR_ATTR_NAME) {
        _setScrollableElementWithSelector.call(this);
      }
    });
  }
}/**
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



var _globalSTHManager = new StickyTableHeaderManager();/**
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
function enableStickyTableHeader(tableElement, scrollableElement) {
  _validateElementParameter('tableElement',      tableElement);
  _validateElementParameter('scrollableElement', scrollableElement, true);

  if (tableElement.stickyTableHeader != null) {
    return tableElement;
  }

  tableElement.stickyTableHeader = new StickyTableHeader(tableElement, scrollableElement);

  return tableElement;
}



/**
 * Makes the headers of the give table element (`tableElement`) NOT sticky.
 *
 * @param {HTMLElement} tableElement - The table where sticky headers are to be disabled.
 *
 * @throws {ReferenceError} If `tableElement` is `null` or `undefined`.
 * @throws {TypeError}      If `tableElement` is not of type `HTMLElement`.
 *
 * @returns {HTMLElement} The table element given.
 */
function disableStickyTableHeader(tableElement) {
  _validateElementParameter('tableElement', tableElement);

  if (tableElement.stickyTableHeader == null) {
    return tableElement;
  }

  tableElement.stickyTableHeader.destroy();
  delete tableElement.stickyTableHeader;

  return tableElement;
}



/**
 * @param  {String}      paramName
 * @param  {HTMLElement} param
 * @param  {Boolean}     [nullable = false]
 *
 * @private
 */
function _validateElementParameter(paramName, param, nullable) {
  if (nullable !== true && param == null) {
    throw new ReferenceError("`" + paramName + "` parameter cannot be `null` or `undefined`.");
  }
  if (nullable === true && param != null && !(param instanceof HTMLElement)) {
    throw new TypeError("`" + paramName + "` parameter must be an `HTMLElement`, but a `" + param.constructor.name + "` was given.");
  }
};(function() {
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
    disableStickyTableHeader: {
      configurable: false,
      enumerable:   true,
      writable:     false,
      value:        disableStickyTableHeader
    },
    enableStickyTableHeader: {
      configurable: false,
      enumerable:   true,
      writable:     false,
      value:        enableStickyTableHeader
    },
    manager: {
      configurable: false,
      enumerable:   true,
      writable:     false,
      value:        _globalSTHManager
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
