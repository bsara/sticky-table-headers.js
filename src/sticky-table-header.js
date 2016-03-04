/* exported StickyTableHeader */



/**
 * @typedef {Object} StickyTableHeaderOptions
 * @property {HTMLElement} tableElement           - The table element to add a sticky header to.
 * @property {HTMLElement} [scrollableElement]    - The scrollable element containing the given `tableElement`.
 * @property {Boolean}     [includeCaption=false] - If `true` and a `caption` element exists in the given
 *                                                  table element, then the `caption` element will be sticky
 *                                                  along with the `thead` element of the given table element.
 */



let StickyTableHeader = (function() {

  // region Private Properties

  /**
   * @memberOf {StickyTableHeader}
   * @type {MutationObserver}
   * @private
   */
  let _onChangeTableChildrenObserver = new WeakMap();

  /**
   * @memberOf {StickyTableHeader}
   * @type {MutationObserver}
   * @private
   */
  let _onChangeTableScrollableElementSelectorObserver = new WeakMap();

  /**
   * @memberOf {StickyTableHeader}
   * @type {Function}
   * @private
   */
  let _onChange = new WeakMap();

  /**
   * @memberOf {StickyTableHeader}
   * @type {Function}
   * @private
   */
  let _onChangeTableChildren = new WeakMap();

  /**
   * @memberOf {StickyTableHeader}
   * @type {Function}
   * @private
   */
  let _onChangeTableScrollableElementSelector = new WeakMap();

  /**
   * @memberOf {StickyTableHeader}
   * @type {!Boolean}
   * @private
   */
  let _includeCaption = new WeakMap();

  /**
   * @memberOf {StickyTableHeader}
   * @type {Object[]}
   * @private
   */
  let _origHeaderStyleWidths = new WeakMap();

  /**
   * @memberOf {StickyTableHeader}
   * @type {HTMLElement}
   * @private
   */
  let _$scrollable = new WeakMap();

  /**
   * @memberOf {StickyTableHeader}
   * @type {HTMLElement}
   * @private
   */
  let _$table = new WeakMap();

  /**
   * @memberOf {StickyTableHeader}
   * @type {?HTMLElement}
   * @private
   */
  let _$tableCaption = new WeakMap();

  /**
   * @memberOf {StickyTableHeader}
   * @type {HTMLElement}
   * @private
   */
  let _$tableHeader = new WeakMap();

  // endregion



  /**
   * TODO: Add description
   *
   * @class
   */
  class StickyTableHeader {

    /**
     * @param {(HTMLElement|StickyTableHeaderOptions)} tableElement|options - The table element to add a sticky
     *                                                                        header to or the options used to
     *                                                                        setup this object.
     * @param {HTMLElement} [scrollableElement] - The scrollable element containing the given `tableElement`.
     *
     * @throws {ReferenceError} If `tableElement` and `options.tableElement` are `null` or `undefined`.
     *
     * @constructor
     */
    constructor(options, scrollableElement) {
      // region Event Handler Function Bindings

      _onChange.set(this, _onChangeHandler.bind(this));
      _onChangeTableChildren.set(this, _onChangeTableChildrenHandler.bind(this));
      _onChangeTableScrollableElementSelector.set(this, _onChangeTableScrollableElementSelectorHandler.bind(this));

      // endregion


      options = (options || {});

      if (options instanceof HTMLElement) {
        options = { tableElement: options };
      }


      _origHeaderStyleWidths.set(this, []);

      this.includeCaption = options.includeCaption;

      this.$table      = options.tableElement;
      this.$scrollable = (scrollableElement || options.scrollableElement);


      _onChangeTableChildrenObserver.set(this, new MutationObserver(_onChangeTableChildren.get(this)));
      _onChangeTableChildrenObserver.observe(this.$table, { childList: true });

      _onChangeTableScrollableElementSelectorObserver.set(this, new MutationObserver(_onChangeTableScrollableElementSelector.get(this)));
      _onChangeTableScrollableElementSelectorObserver.observe(this.$table, { attributes: true });
    }



    /**
     * TODO: Add description
     */
    destroy() {
      _onChangeTableChildrenObserver.get(this).disconnect();
      _onChangeTableScrollableElementSelectorObserver.get(this).disconnect();


      _sth.helpers.removeEventListener(window, 'resize', _onChange.get(this));

      if (this.$scrollable != null) {
        _sth.helpers.removeEventListener(this.$scrollable, 'scroll', _onChange.get(this));
      }


      this.$table.classList.remove(_sth.constants.CSS_CLASS_NAME);

      if (_$tableHeader.get(this) != null) {
        _$tableHeader.get(this).classList.remove(_sth.constants.CSS_CLASS_NAME);
      }


      _onChangeTableChildrenObserver.delete(this);
      _onChangeTableScrollableElementSelectorObserver.delete(this);

      _origHeaderStyleWidths.delete(this);

      _$table.delete(this);
      _$scrollable.delete(this);
      _$tableHeader.delete(this);
    }


    // region Getters/Setters

    /** @returns {!Boolean} TODO: Add description */
    get includeCaption() {
      return _includeCaption.get(this);
    }


    /** @param {Boolean} value */
    set includeCaption(value) {
      _includeCaption.set(this, (value === true));
    }


    /** @returns {?HTMLElement} TODO: Add description */
    get $scrollable() {
      return _$scrollable.get(this);
    }


    /** @returns {(HTMLElement|String)} value - TODO: Add description*/
    set $scrollable(value) {
      if (value == null) {
        _setScrollableElementWithSelector.call(this);
      } else {
        _setScrollableElementWithElement.call(this, value);
      }

      if (_$scrollable.get(this) == null) {
        _setScrollableElementWithElement.call(this, _findScrollableParent(this.$table));
      }
    }


    /** @returns {?HTMLElement} TODO: Add description */
    get $table() {
      return _$table.get(this);
    }


    /** @param {!HTMLElement} value - TODO: Add description */
    set $table(value) {
      if (value == null) {
        throw new ReferenceError("'$table' cannot be 'null' or 'undefined'.");
      }

      _$table.set(this, value);

      if (!_$table.get(this).classList.contains(_sth.constants.CSS_CLASS_NAME)) {
        _$table.get(this).classList.add(_sth.constants.CSS_CLASS_NAME);
      }

      _setTableCaption.call(this, _$table.get(this).querySelector('caption'));
      _setTableHeader.call(this, _$table.get(this).querySelector('thead'));
    }

    // endregion
  }


  // region Private Methods

  /** @private */
  function _setScrollableElementWithElement(scrollableElement) {
    if (scrollableElement === _$scrollable.get(this)) {
      return;
    }


    if (_$scrollable.get(this) != null) {
      _sth.helpers.removeEventListener(_$scrollable.get(this), 'scroll', _onChange.get(this));
      _sth.helpers.removeEventListener(window, 'resize', _onChange.get(this));
    }

    _$scrollable.set(this, scrollableElement);

    if (_$scrollable.get(this) != null) {
      _sth.helpers.addEventListener(_$scrollable.get(this), 'scroll', _onChange.get(this));
      _sth.helpers.addEventListener(window, 'resize', _onChange.get(this));
    }
  }


  /** @private */
  function _setScrollableElementWithSelector() {
    let scrollableElementSelector = this.$table.getAttribute(_sth.constants.SCROLLABLE_ELEMENT_SELECTOR_ATTR_NAME);

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

    let $parent             = $el.parentNode;
    let parentComputedStyle = getComputedStyle($parent);

    switch (parentComputedStyle.overflowY) {
      case 'auto':
      case 'scroll':
        return $parent;
    }

    return _findScrollableParent($parent);
  }


  /** @private */
  function _setTableCaption(tableCaptionElement) {
    _$tableCaption.set(this, tableCaptionElement);
  }


  /** @private */
  function _setTableHeader(tableHeaderElement) {
    _$tableHeader.set(this, tableHeaderElement);
  }


  /** @private */
  function _onChangeHandler() {
    if (_$tableHeader.get(this) == null) {
      return;
    }


    let captionExists = (_$tableCaption.get(this) != null);

    let tablePositionTop = this.$table.getBoundingClientRect().top;

    let tableCaptionComputedStyle;
    let tableCaptionDimens;
    let tableCaptionMarginBottom;

    let tableHeaderCells         = _$tableHeader.get(this).querySelectorAll('th');
    let tableHeaderComputedStyle = getComputedStyle(_$tableHeader.get(this));
    let tableHeaderMarginTop     = _sth.helpers.removeUnit(tableHeaderComputedStyle.getPropertyValue('margin-top'));

    let scrollableElementBorderTopWidth = _sth.helpers.removeUnit(getComputedStyle(this.$scrollable).getPropertyValue('border-top-width'));
    let scrollableElementTop            = this.$scrollable.getBoundingClientRect().top;
    let scrollingThreshold              = tablePositionTop;


    if (captionExists) {
      tableCaptionComputedStyle = getComputedStyle(_$tableCaption.get(this));
      tableCaptionDimens        = _$tableCaption.get(this).getBoundingClientRect();
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
        _setNewTopDimenForTopStickyElement(_$tableCaption.get(this), scrollableElementTop, scrollableElementBorderTopWidth, tablePositionTop);
        _setNewLeftRightDimensForStickyElement(_$tableCaption.get(this), tableCaptionComputedStyle);

        _$tableHeader.get(this).style.top = ((_sth.helpers.removeUnit(tableCaptionComputedStyle.getPropertyValue('top'))
                                              + tableCaptionDimens.height
                                              + tableCaptionMarginBottom
                                              + tableHeaderMarginTop) + 'px');
      } else {
        _setNewTopDimenForTopStickyElement(_$tableHeader.get(this), scrollableElementTop, scrollableElementBorderTopWidth, tablePositionTop);
      }

      _setNewLeftRightDimensForStickyElement(_$tableHeader.get(this), tableHeaderComputedStyle);


      _processTableHeaderCells.call(this, tableHeaderCells);


      if (captionExists && this.includeCaption) {
        _$tableCaption.get(this).classList.add(_sth.constants.CSS_CLASS_NAME);
      }
      _$tableHeader.get(this).classList.add(_sth.constants.CSS_CLASS_NAME);


      return;
    }


    if (captionExists && this.includeCaption) {
      _cleanupStickyElement(_$tableCaption.get(this));
    }
    _cleanupStickyElement(_$tableHeader.get(this));

    _cleanupTableHeaderCellStyles(tableHeaderCells);
  }


  /** @private */
  function _setNewTopDimenForTopStickyElement($el, scrollableElTop, scrollableElBorderTopWidth, tablePositionTop) {
    $el.style.top = ((scrollableElTop - tablePositionTop + scrollableElBorderTopWidth) + 'px');
  }


  /** @private */
  function _setNewLeftRightDimensForStickyElement($el, elComputedStyle) {
    let elMarginRight      = _sth.helpers.removeUnit(elComputedStyle.getPropertyValue('margin-right'));
    let elBorderRightWidth = _sth.helpers.removeUnit(elComputedStyle.getPropertyValue('border-right-width'));

    $el.style.left  = elComputedStyle.getPropertyValue('margin-left');
    $el.style.right = ((elMarginRight - elBorderRightWidth) + 'px');
  }


  /** @private */
  function _processTableHeaderCells(tableHeaderCells) {
    let tableBodyFirstRowCells        = this.$table.querySelectorAll('tbody > tr td');
    let tableBodyFirstRowCellsIsEmpty = (tableBodyFirstRowCells == null || tableBodyFirstRowCells.length === 0);
    let equalWidthAmount              = ((100 / tableHeaderCells.length) + '%');

    let isFirstTimeThrough = (_origHeaderStyleWidths.get(this).length === 0);

    for (let i = 0; i < tableHeaderCells.length; i++) {
      let $tableHeaderCell = tableHeaderCells[i];

      if (isFirstTimeThrough) {
        _origHeaderStyleWidths.get(this).push({
          width:    $tableHeaderCell.style.getPropertyValue('width'),
          priority: $tableHeaderCell.style.getPropertyPriority('width')
        });
      }

      if (tableBodyFirstRowCellsIsEmpty) {
        $tableHeaderCell.style.width = equalWidthAmount;
        continue;
      }


      let expectedNewWidth = _sth.helpers.removeUnit(getComputedStyle(tableBodyFirstRowCells[i]).getPropertyValue('width'));


      $tableHeaderCell.style.width = (expectedNewWidth + 'px');


      let newWidth = $tableHeaderCell.getBoundingClientRect().width;

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
    if (_origHeaderStyleWidths.get(this).length === 0) {
      return;
    }

    for (let i = 0; i < tableHeaderCells.length; i++) {
      let $tableHeaderCell = tableHeaderCells[i];
      let origValues       = _origHeaderStyleWidths.get(this)[i];

      if (origValues.width == null) {
        $tableHeaderCell.style.removeProperty('width');
        continue;
      }

      $tableHeaderCell.style.setProperty('width', origValues.width, origValues.priority);
    }

    _origHeaderStyleWidths.get(this).splice(0, _origHeaderStyleWidths.get(this).length);
  }


  /** @private */
  function _onChangeTableChildrenHandler(mutations) {
    mutations.forEach(function(mutation) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        if (mutation.addedNodes[i].nodeName === 'thead') {
          _setTableHeader.call(this, mutation.addedNodes[i]);
          break;
        }
      }

      for (let i = 0; i < mutation.removedNodes.length; i++) {
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

  // endregion



  return StickyTableHeader;
})();
