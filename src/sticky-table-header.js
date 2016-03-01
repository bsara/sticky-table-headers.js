/* exported StickyTableHeader */



/**
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

    var scrollableElementTop = Math.floor(this.$scrollable.getBoundingClientRect().top);
    var scrollingThreshold   = Math.floor(this.$table.getBoundingClientRect().top);

    var tableHeaderComputedStyle = getComputedStyle(_$tableHeader);
    var tableHeaderMarginTop     = _sth.helpers.removeUnit(tableHeaderComputedStyle.getPropertyValue('marginTop'));

    var tableCaptionComputedStyle;
    var tableCaptionDimens;
    var tableCaptionMarginBottom;


    if (captionExists && !this.includeCaption) {
      tableCaptionDimens        = _$tableCaption.getBoundingClientRect();
      tableCaptionComputedStyle = getComputedStyle(_$tableCaption);
      tableCaptionMarginBottom  = _sth.helpers.removeUnit(tableCaptionComputedStyle.getPropertyValue('marginBottom'));

      scrollingThreshold += (Math.floor(tableCaptionDimens.height) + tableCaptionMarginBottom);
    }

    if (!captionExists || !this.includeCaption) {

      scrollingThreshold += tableHeaderMarginTop;
    }


    if (scrollingThreshold <= scrollableElementTop) {
      var tableHeaderDimens = _$tableHeader.getBoundingClientRect();

      var tableLeftBorderWidth = _sth.helpers.removeUnit(getComputedStyle(this.$table).getPropertyValue('border-left-width'));


      if (captionExists && this.includeCaption) {
        _setNewTopDimenForTopStickyElement(_$tableCaption,
                                           scrollableElementTop,
                                           tableCaptionDimens.top,
                                           _sth.helpers.removeUnit(tableCaptionComputedStyle.getPropertyValue('border-top-width')));

        _setNewLeftRightDimensForStickyElement(_$tableCaption, tableLeftBorderWidth, {
          left:  _sth.helpers.removeUnit(tableCaptionComputedStyle.getPropertyValue('border-left-width')),
          right: _sth.helpers.removeUnit(tableCaptionComputedStyle.getPropertyValue('border-right-width'))
        });

        _$tableHeader.style.top = ((tableCaptionDimens.top
                                      + tableCaptionDimens.height
                                      + tableCaptionMarginBottom
                                      + tableHeaderMarginTop) + 'px');
      } else {
        _setNewTopDimenForTopStickyElement(_$tableHeader,
                                           scrollableElementTop,
                                           tableHeaderDimens.top,
                                           _sth.helpers.removeUnit(tableHeaderComputedStyle.getPropertyValue('border-top-width')));
      }

      _setNewLeftRightDimensForStickyElement(_$tableHeader, tableLeftBorderWidth, {
        left:  _sth.helpers.removeUnit(tableHeaderComputedStyle.getPropertyValue('border-left-width')),
        right: _sth.helpers.removeUnit(tableHeaderComputedStyle.getPropertyValue('border-right-width'))
      });


      var tableHeaderCells              = _$tableHeader.querySelectorAll('th');
      var tableBodyFirstRowCells        = this.$table.querySelectorAll('tbody > tr td');
      var tableBodyFirstRowCellsIsEmpty = (tableBodyFirstRowCells == null || tableBodyFirstRowCells.length === 0);
      var equalWidthAmount              = ((100 / tableHeaderCells.length) + '%');

      for (var i = 0; i < tableHeaderCells.length; i++) {
        var $tableHeaderCell = tableHeaderCells[i];

        if (tableBodyFirstRowCellsIsEmpty) {
          $tableHeaderCell.style.width = equalWidthAmount;
          continue;
        }

        $tableHeaderCell.style.width = getComputedStyle(tableBodyFirstRowCells[i]).getPropertyValue('width');
      }

      _$tableHeader.classList.add(_sth.constants.CSS_CLASS_NAME);

      return;
    }

    _$tableHeader.classList.remove(_sth.constants.CSS_CLASS_NAME);
    _$tableHeader.removeAttribute('style');
  }


  /** @private */
  function _setNewTopDimenForTopStickyElement($el, scrollableElementTop, elTop, elBorderTopWidth) {
    $el.style.top = ((scrollableElementTop - elTop + elBorderTopWidth) + 'px');
  }


  /** @private */
  function _setNewLeftRightDimensForStickyElement($el, tableLeftBorderWidth, elBorderWidths) {
    $el.style.left  = ((elBorderWidths.left - tableLeftBorderWidth) + 'px');
    $el.style.width = ('calc(100% + ' + elBorderWidths.right + 'px)');
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
}
