
# sticky-table-headers.js [![Build Status](https://img.shields.io/travis/bsara/sticky-table-headers.js.svg)](https://travis-ci.org/bsara/sticky-table-headers.js?style=flat-square)


[![CPOL v1.02 License](https://img.shields.io/badge/license-CPOL--1.02-blue.svg?style=flat-square)](https://github.com/bsara/sticky-table-headers.js/blob/master/LICENSE.md)

[![NPM Package](https://img.shields.io/npm/v/sticky-table-headers.js.svg?style=flat-square)](https://www.npmjs.com/package/sticky-table-headers.js)&nbsp;
[![Bower Package](https://img.shields.io/bower/v/sticky-table-headers.js.svg?style=flat-square)](http://bower.io/search/?q=sticky-table-headers.js)


Sticky table headers done right, with native JS and CSS, no extra libraries needed. This is a super easy-to-use library that can be used without writing a single bit of JavaScript yourself!

Includes support for AMD, CommonJS, and global inclusion via an HTML script tag.



## Install

- **NPM:** `$ npm install --save sticky-table-headers.js`
- **Bower:** `$ bower install --save sticky-table-headers.js`
- **CDN - Auto Init (minified):**
  - `<script src="//npmcdn.com/sticky-table-headers.js@0.2.1/dist/sticky-table-headers.auto-init.min.js"></script>`
  - `<link type="text/css" src="//npmcdn.com/sticky-table-headers.js@0.2.1/dist/sticky-table-headers.min.css">`
- **CDN - Auto Init (not minified):**
  - `<script src="//npmcdn.com/sticky-table-headers.js@0.2.1/dist/sticky-table-headers.auto-init.js"></script>`
  - `<link type="text/css" src="//npmcdn.com/sticky-table-headers.js@0.2.1/dist/sticky-table-headers.css">`
- **CDN - Manual Init (minified):**
  - `<script src="//npmcdn.com/sticky-table-headers.js@0.2.1/dist/sticky-table-headers.min.js"></script>`
  - `<link type="text/css" src="//npmcdn.com/sticky-table-headers.js@0.2.1/dist/sticky-table-headers.min.css">`
- **CDN - Manual Init (not minified):**
  - `<script src="//npmcdn.com/sticky-table-headers.js@0.2.1"></script>`
  - `<link type="text/css" src="//npmcdn.com/sticky-table-headers.js@0.2.1/dist/sticky-table-headers.css">`
- [**Download**](https://github.com/bsara/sticky-table-headers.js/releases)


## Features

- Built with fully native, pure JavaScript and CSS! No extra libraries needed!
- Super lightweight! (Only ~7 kB minified)
- No additional HTML tag creation...so that the DOM elements you expect, are always going to be the DOM elements that you have.
- No additional JavaScript necessary for usage! (Perfect for single page applications or static sites)
    - Uses HTML tag `class` attribute to indicate tables with sticky headers.
- [Auto initilaization version][auto-init-example] available for simple uses, and a [manual initialization version][manual-init-example] available for more complicated uses.
- Allows for table resizing even after you've begun scrolling through table.
- Automatically finds first scrollable parent element, so that you don't have to!
- Ability to manually specify scrollable parent element.
- Support for...
    - AMD
    - CommonJS
    - Global HTML script tag


<br/>
<br/>


# Documentation

- [Changelog](https://github.com/bsara/sticky-table-headers.js/blob/master/CHANGELOG.md)


---


### Table of Contents

- [Code Samples](#code-samples)
- [Including the Library Auto Initialization Version in Your Project](#including-the-library-auto-initialization-version-in-your-project)
    - [Include as AMD Module](#include-as-amd-module)
    - [Include as CommonJS Module](#include-as-commonjs-module)
    - [Include via HTML Script Tag](#include-via-html-script-tag)
- [Including the Library Manual Initialization Version in Your Project](#including-the-library-manual-initialization-version-in-your-project)
    - [Include as AMD Module](#include-as-amd-module)
    - [Include as CommonJS Module](#include-as-commonjs-module)
    - [Include via HTML Script Tag](#include-via-html-script-tag)
- [Usage](#usage)
    - [Auto Initialization](#auto-initialization)
    - [Manual Initialization](#manual-initialization)



---


## Code Samples

- [How to use without writing any JavaScript][auto-init-example]
- [Auto Initialization][auto-init-example]
- [Manual Initialization][manual-init-example]


---


## Including the Library's Auto Initialization Version in Your Project

#### Include as AMD Module

```javascript
define([ 'sticky-table-headers.auto' ], function(STH) {
  ...
});
```


#### Include as CommonJS Module

```javascript
var STH = require('sticky-table-headers.auto');
...
```


#### Include via HTML Script Tag

```html
<script type="text/javascript" src="sticky-table-headers.auto.min.js" />
```


---


## Including the Library's Manual Initialization Version in Your Project

#### Include as AMD Module

```javascript
define([ 'sticky-table-headers' ], function(STH) {
  STH.manager.init();
  ...
});
```


#### Include as CommonJS Module

```javascript
var STH = require('sticky-table-headers');
STH.manager.init();
...
```


#### Include via HTML Script Tag

```html
<script type="text/javascript" src="sticky-table-headers.auto.min.js" />
<script type="text/javascript">
  ...
  STH.manager.init();
  ...
</script>
```


---



## Usage

### Auto Initialization

To use auto initialization, you must [include the file `sticky-table-headers.auto.js`
(or `sticky-table-headers.auto.min.js`) in your project](#including-the-library-auto-initialization-version-in-your-project).
This contains code that will automatically call [`STH.manager.init()`][sth-manager-init] once the
page has finished loading.

Because auto initialization takes place after the page has finished loading, **if any
additional tables requiring sticky headers are added after the page has loaded, they
will not automatically be loaded** by the library**. You can, however, call
[`STH.manager.reinit()`][sth-manager-reinit] if you don't want to manually locate each new table and add
it to the `STH.manager` object (though it would be much more performant to add each
table one by one to `STH.manager`, see the [`STH.manager`][sth-manager] docs for more details).

**Auto Initialization in Action:** [JSBin Code Example][auto-init-example]


### Manual Initialization

Manually initializing the sticky headers is available if you want to specify exactly
when to initialize all sticky headers, or if you don't want to use the [manager][global-manager] at
all.

To manually initialize **ALL** sticky table headers found on a page, simply call
[`STH.manager.init()`][sth-manager-init] after those tables have finished loading.

To manually initialize sticky table headers for a single table, simply call
[`STH.manager.addStickyHeaderToTable(tableElement, [scrollableElement])`][sth-manager-add]
after that the table has finished loading. If you don't want to use the manager to manage
your sticky header tables, you can also initialize a sticky table header by doing the
following (See [`StickyTableHeader`][sth] for details):

```javascript
var myStickyTableHeader = new StickyTableHeader(tableElement, scrollableElement)
```

**Manual Initialization in Action:** [JSBin Code Example][manual-init-example]



<br/>

---

<br/>



## Contributing

See [contribution documentation page](https://github.com/bsara/sticky-table-headers.js/blob/master/CONTRIBUTING.md) for details.




[auto-init-example]:   http://jsbin.com/lizoyaw/edit?html,output   "Auto Init Example (JSBin)"
[manual-init-example]: http://jsbin.com/fuxuro/edit?html,js,output "Manual Init Example (JSBin)"

[global-manager]: http://bsara.github.io/sticky-table-headers.js/docs#global-manager "Global Sticky Table Headers Manager"

[sth]: http://bsara.github.io/sticky-table-headers.js/docs#sth "StickyTableHeader Object Definition"

[sth-manager]:        http://bsara.github.io/sticky-table-headers.js/docs#sth-manager        "StickyTableHeaderManager Object Definition"
[sth-manager-init]:   http://bsara.github.io/sticky-table-headers.js/docs#sth-manager-init   "StickyTableHeaderManager.prototype.init"
[sth-manager-reinit]: http://bsara.github.io/sticky-table-headers.js/docs#sth-manager-reinit "StickyTableHeaderManager.prototype.reinit"
[sth-manager-add]:    http://bsara.github.io/sticky-table-headers.js/docs#sth-manager-add    "StickyTableHeaderManager.prototype.addStickyHeaderToTable"
