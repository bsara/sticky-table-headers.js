/* globals StickyTableHeader */
/* exported enableStickyTableHeader, disableStickyTableHeader */


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
}
