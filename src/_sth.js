/* globals -_sth */
/* exported _sth */


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


Object.freeze(_sth);
