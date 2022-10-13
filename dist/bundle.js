/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MainPage": () => (/* reexport safe */ _MainPage__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _MainPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Page)
/* harmony export */ });
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _parts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _utils_fetch_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);





const BACKEND_URL = 'https://course-js.javascript.ru/';

class Page {
  API_URL = 'api/dashboard';
  RANGE = {
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  }

  template() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Dashboard</h2>
        <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>

        <h3 class="block-title">Best sellers</h3>
        <div data-element="sortableTable"></div>
      </div>`;
  }

  appendRangePicker() {
    this.rangePicker = new _components__WEBPACK_IMPORTED_MODULE_0__.RangePicker(this.RANGE).element;

    this.subElements.rangePicker.append(this.rangePicker);
  }

  appendColumnCharts() {
    const {from, to} = this.RANGE;
    const {ordersChart, salesChart, customersChart} = this.subElements;

    this.ordersChart = new _components__WEBPACK_IMPORTED_MODULE_0__.ColumnChart({ url: `${this.API_URL}/orders`, range: { from, to }, label: 'orders', link: '#' });
    this.salesChart = new _components__WEBPACK_IMPORTED_MODULE_0__.ColumnChart({ url: `${this.API_URL}/sales`, range: { from, to }, label: 'sales', formatHeading: data => `$${data}` });
    this.customersChart = new _components__WEBPACK_IMPORTED_MODULE_0__.ColumnChart({ url: `${this.API_URL}/customers`, range: { from, to }, label: 'customers' });

    ordersChart.append(this.ordersChart.element);
    salesChart.append(this.salesChart.element);
    customersChart.append(this.customersChart.element);
  }

  appendSortableTable() {
    this.sortableTable = new _components__WEBPACK_IMPORTED_MODULE_0__.SortableTable(_parts__WEBPACK_IMPORTED_MODULE_1__.Header, {
      url: `${this.API_URL}/bestsellers`,
      isSortLocally: true
    });
    
    this.subElements.sortableTable.append(this.sortableTable.element);
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.element = element.firstElementChild;
    
    this.subElements = this.getSubElements(this.element);

    this.appendRangePicker();
    this.appendColumnCharts();
    this.appendSortableTable();
    
    this.setEventListeners();
    this.switchProgressBar('off');
  
    return this.element;
  }

  getSubElements() { 
    const res = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      res[subElement.dataset.element] = subElement;
    }
    return res;
  }

  switchProgressBar(switchType) {
    if (!this.progressBar) {
      this.progressBar = document.querySelector('.progress-bar');
      if (!this.progressBar) {return;}
    }

    if (switchType === 'on') {this.progressBar.hidden = false;}
    else if (switchType === 'off') {this.progressBar.hidden = true;}
  }

  handleDateSelect = (event) => {
    this.switchProgressBar('on');

    const {detail: {from, to}} = event;
    
    this.updateSortableTable(from, to);
    this.ordersChart.update(from, to);
    this.salesChart.update(from, to);
    this.customersChart.update(from, to);
    
    this.switchProgressBar('off');
  }

  fetchDataSortableTable(from, to) {
    const [start, end] = [1, 20];
    const url = new URL(`${this.API_URL}/bestsellers`, BACKEND_URL);

    url.searchParams.set('from', from);
    url.searchParams.set('to', to);
    url.searchParams.set('_start', start);
    url.searchParams.set('_end', end);

    return (0,_utils_fetch_json__WEBPACK_IMPORTED_MODULE_2__["default"])(url);
  }

  async updateSortableTable(from, to) {
    this.sortableTable.element.classList.add('sortable-table_loading');
    
    const data = await this.fetchDataSortableTable(from, to);

    this.sortableTable.renderRows(data);
    this.sortableTable.element.classList.remove('sortable-table_loading');
  }

  setEventListeners() {
    this.element.addEventListener('date-select', this.handleDateSelect);
  }

  remove() {
    this.element?.remove();
    this.removeEventListeners();
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
  }
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColumnChart": () => (/* reexport safe */ _ColumnChart__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "RangePicker": () => (/* reexport safe */ _RangePicker__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "SortableTable": () => (/* reexport safe */ _SortableTable__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _ColumnChart__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _SortableTable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _RangePicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);




/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ColumnChart)
/* harmony export */ });
/* harmony import */ var _utils_fetch_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);


const BACKEND_URL = 'https://course-js.javascript.ru/api';

class ColumnChart {
  chartHeight = 50;
  element;
  subElements;
  data = [];
  tableValues = [];

  constructor({
    label,
    link,
    url,
    range = {
      from: Date.now(),
      to: Date.now(),
    },
    formatHeading = (val) => val
  } = {}) {
    this.label = label;
    this.link = link;
    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.heading = formatHeading;

    this.render();
  }

  getNewData() {
    const url = new URL(this.url);
    
    url.searchParams.append("from", this.range.from.toISOString());
    url.searchParams.append("to", this.range.to.toISOString());

    return (0,_utils_fetch_json__WEBPACK_IMPORTED_MODULE_0__["default"])(url).then(res => res);
  }

  get templateColumnChart() {
    return `
      <div class='column-chart column-chart_loading'>
        <div class='column-chart__title'>
          Total ${this.label}
          ${this.link ? this.templateLink : ''}
        </div>
        <div class='column-chart__container'>
          <div data-element="header" class="column-chart__header">
            ${this.heading}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.renderColumns()}
          </div>
        </div>
      </div>`;
  }

  get templateLink() {
    return this.link
      ? `<a class='column-chart__link' href=${this.link}>
          View all
        </a>`
      : '';
  }

  calcHeadingValues() {
    return this.heading(
      this.tableValues.reduce((acc, curr) => acc += parseInt(curr), 0)
    );
  }

  renderSubElements() {
    const { body, header } = this.subElements;

    body.innerHTML = this.renderColumns();
    header.innerHTML = this.calcHeadingValues();

    if (this.tableValues.length) {
      this.element.classList.remove("column-chart_loading");
    }
  }

  async render() {
    const el = document.createElement("div");
    el.innerHTML = this.templateColumnChart;
    this.element = el.firstElementChild;

    this.subElements = this.getSubElements();

    this.data = await this.getNewData();
    this.tableValues = Object.values(this.data);
    this.renderSubElements();

    return this.element;
  }

  renderColumns() {
    if (!this.tableValues.length) {return;}

    const max = Math.max(...this.tableValues);
    const scale = this.chartHeight / max;
    const el = document.createElement('div');

    return this.tableValues.map((value) => {
      const precent = `${((value / max) * 100).toFixed(0)}%`;

      el.style = `--value: ${Math.floor(value * scale)}`;
      el.dataset['tooltip'] = precent;

      return el.outerHTML;
    }).join("");
  }

  getSubElements() {
    const subElements = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      subElements[name] = subElement;
    }

    return subElements;
  }

  async update(from, to) {
    this.range = { from, to };
    this.data = await this.getNewData();
    this.tableValues = Object.values(this.data);
    this.renderSubElements();

    return this.data;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FetchError": () => (/* binding */ FetchError),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// same as fetch, but throws FetchError in case of errors
// status >= 400 is an error
// network error / json error are errors

/* harmony default export */ async function __WEBPACK_DEFAULT_EXPORT__(url, params) {
  let response;
  
  try {
    // TODO: "toString" call needed for correct work of "jest-fetch-mock"
    response = await fetch(url.toString(), params);
  } catch (err) {
    throw new FetchError(response, 'Network error has occurred.');
  }
  
  let body;
  
  if (!response.ok) {
    let errorText = response.statusText; // Not Found (for 404)
  
    try {
      body = await response.json();
  
      errorText = (body.error && body.error.message)
          || (body.data && body.data.error && body.data.error.message)
          || errorText;
    } catch (error) { /* ignore failed body */ }
  
    let message = `Error ${response.status}: ${errorText}`;
  
    throw new FetchError(response, body, message);
  }
  
  try {
    return await response.json();
  } catch (err) {
    throw new FetchError(response, null, err.message);
  }
}
  
class FetchError extends Error {
    name = 'FetchError';
  
    constructor(response, body, message) {
      super(message);
      this.response = response;
      this.body = body;
    }
}
  
// handle uncaught failed fetch through
window.addEventListener('unhandledrejection', event => {
  if (event.reason instanceof FetchError) {
    alert(event.reason.message);
  }
});  

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SortableList)
/* harmony export */ });
class SortableList {
  constructor({items = []}) {
    this.items = items;
    this.render();
  }
  
  render() {
    this.items = this.prepareData(this.items);
  
    this.element = this.template();
    this.element.append(...this.items);
  
    this.setEventListeners();
  }
  
  setEventListeners() {
    this.element.addEventListener('pointerdown', this.handleDown);
    document.addEventListener('pointerup', this.handleUp);
  }
  
    handleDown = (event) => {
      event.preventDefault();
      const isDraggingElement = event.target.closest('[data-grab-handle]')?.closest('li');
      const isDeletingElement = event.target.closest('[data-delete-handle]')?.closest('li');
  
      if (isDraggingElement) {
        this.draggingElement = isDraggingElement;
        this.handleGrab(event);
      }
      else if (isDeletingElement) {
        this.handleDelete(isDeletingElement);
      }
    }
  
    handleUp = () => {
      if (!this.draggingElement) {return;}
  
      this.draggingElement.classList.remove('sortable-list__item_dragging');
      this.draggingElement.removeAttribute('style');
      this.placeholder.replaceWith(this.draggingElement);
  
      document.removeEventListener('pointermove', this.handleDrag);
    }
  
    createPlaceholder() {
      const placeholder = document.createElement('div');
  
      placeholder.classList.add('sortable-list__placeholder');
      placeholder.style.height = `${this.elementHeight}px`;
      placeholder.style.width = `${this.elementWidth}px`;
  
      return placeholder;
    }
  
    setElementSize() {
      const {height, width, top, left} = this.draggingElement.getBoundingClientRect();
  
      this.elementHeight = height;
      this.elementWidth = width;
      this.initialElementTop = top;
      this.initialElementLeft = left;
    }
  
    setInitialCoords(event) {
      this.initialY = event.clientY;
      this.initialX = event.clientX;
    }
  
    placePlaceholder() {
      const placeholder = this.createPlaceholder();
      this.placeholder = placeholder;
      this.draggingElement.closest('li').after(placeholder);
    }
  
    handleGrab(event) {
      this.setElementSize();
      this.setInitialCoords(event);
      this.draggingElement.style.top = `${event.clientY - this.initialY + this.initialElementTop}px`;
      this.draggingElement.classList.add('sortable-list__item_dragging');
      this.draggingElement.style.width = `${this.elementWidth}px`;
  
      this.placePlaceholder();
      
      document.addEventListener('pointermove', this.handleDrag);
    }
  
    handleDrag = (event) => {
      this.draggingElement.style.top = `${event.clientY - this.initialY + this.initialElementTop}px`;
      this.draggingElement.style.left = `${event.clientX - this.initialX + this.initialElementLeft}px`;
  
      this.draggingElement.style.visibility = 'hidden';
      const neighborhood = document.elementFromPoint(event.clientX, event.clientY)?.closest('li');
      this.draggingElement.style.visibility = 'visible';
      
      if (!neighborhood) {return;}
      const neighborhoodSizes = neighborhood.getBoundingClientRect();
  
      if (event.clientY - neighborhoodSizes.top < neighborhoodSizes.height / 2) {
        neighborhood.after(this.placeholder);
      } else if (neighborhoodSizes.bottom - event.clientY > 0) {
        neighborhood.before(this.placeholder);
      }
    }
  
    template() {
      const element = document.createElement('ul');
      element.classList.add('sortable-list');
      element.dataset.element = 'itemList';
      
      return element;
    }
  
    prepareData(items) {
      return items.map(item => {
        item.classList.add('sortable-list__item');
        
        return item;
      });
    }
  
    handleDelete(element) {
      element.remove();
    }
  
    remove() {
      document.removeEventListener('pointermove', this.handleDrag);
      document.removeEventListener('pointerup', this.handleUp);
      this.element?.remove();
    }
  
    destroy() {
      this.remove();
    }
}
  

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RangePicker)
/* harmony export */ });
class RangePicker {
  constructor({
    from = new Date(),
    to = new Date(),
  }) {
    const year = from.getFullYear();
    const month = from.getMonth();
  
    this.from = new Date(year, month, 1);
    this.to = new Date(year, month + 1, 1);
    this.selectedDates = {
      from,
      to
    };
    this.isCalendarOpen = false;
    this.locale = 'ru';
  
    this.render();
  }
  
  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.element = element.firstElementChild;
      
    this.subElements = this.getSubElements();
    this.setEnentListeners();
  }
  
  setEnentListeners() {
    this.subElements.input.addEventListener('click', this.toggleCalendar);
    this.subElements.selector.addEventListener('click', this.handleClickSelector);
  }
  
  getSubElements() {
    const res = {};
    const elements = this.element.querySelectorAll("[data-element]");
  
    for (const subElement of elements) {
      res[subElement.dataset.element] = subElement;
    }
    return res;
  }
  
    toggleCalendar = () => {
      this.element.classList.toggle('rangepicker_open');    
      this.isCalendarOpen = !this.isCalendarOpen;
      this.subElements.selector.innerHTML = this.selectorTemplate();
    }
  
    handleSelectDate(event) {
      if (this.selectedDates.to !== null) {
        this.selectedDates.from = new Date(event.target.dataset.value);
        this.selectedDates.to = null;
  
        event.target.classList.add('rangepicker__selected-from');
      } else {
        event.target.classList.add('rangepicker__selected-to');
        const valueTo = new Date(event.target.dataset.value);
        if (Number(this.selectedDates.from) > Number(valueTo)) {
          this.selectedDates.to = this.selectedDates.from;
          this.selectedDates.from = valueTo;
        } else {
          this.selectedDates.to = valueTo;
        }
        
        this.subElements.input.innerHTML = this.inputTemplate();
        this.element.dispatchEvent(new CustomEvent('date-select'), {bubles: true});
        this.toggleCalendar();
      }
  
      this.subElements.selector.innerHTML = this.selectorTemplate();
    }
  
    handleControlMonth(event) {
      const action = {
        left: () => {
          this.from.setMonth(this.from.getMonth() - 1);
          this.to.setMonth(this.to.getMonth() - 1);
        },
        right: () => {
          this.from.setMonth(this.from.getMonth() + 1);
          this.to.setMonth(this.to.getMonth() + 1);
        }
      };
      const way = event.target.className.split('rangepicker__selector-control-')[1];
      action[way]();
      
      this.subElements.selector.innerHTML = this.selectorTemplate();
    }
  
    handleClickSelector = (event) => {
      if (event.target.dataset.value) {
        this.handleSelectDate(event);
      }
      else if (event.target.className.includes('control')) {
        this.handleControlMonth(event);
      }
    }
  
    getMonthCells(date) {
      const secondsFrom = Number(this.selectedDates.from);
      const secondsTo = Number(this.selectedDates.to);
      const year = date.getFullYear();
      let month = date.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
  
      return new Array(lastDay).fill().map((_, dayNum) => {
        const dateOfDay = new Date(year, month, dayNum + 1);
  
        const getClassName = () => {
          const currentSeconds = Number(dateOfDay);
          let className = "rangepicker__cell";
  
          if (currentSeconds > secondsFrom && currentSeconds < secondsTo) {className += ' rangepicker__selected-between';}
          else if (currentSeconds === secondsFrom) {className += ' rangepicker__selected-from';}
          else if (currentSeconds === secondsTo) {className += ' rangepicker__selected-to';}
          
          return className;
        };
  
        return `
        <button
          type="button"
          class="${getClassName()}"
          data-value="${dateOfDay.toLocaleDateString('en')}"
          ${dayNum === 0 ? 'style="--start-from:' + dateOfDay.getDay() + '"' : ''}
        >
          ${dayNum + 1}
        </button>
        `;
      }).join("");
    }
  
    getDayNames() {
      return new Array(7).fill().map((_, dayInd) => {
        const date = new Date(2022, 9, dayInd + 3); // 3 Oct 2022 is Monday.
        
        return `<div>${date.toLocaleDateString(this.locale, {weekday: 'short'})}</div>`;
      }).join("");
    }
  
    selectorTemplate() {
      if (!this.isCalendarOpen) {return '';}
      const monthNameFrom = this.from.toLocaleString(this.locale, {month: 'long'});
      const dateFromCopy = new Date(this.from);
      const monthNameNext = new Date(dateFromCopy.setMonth(dateFromCopy.getMonth() + 1)).toLocaleDateString(this.locale, {month: 'long'});
  
      return `
        <div class="rangepicker__selector-arrow"></div>
        <div class="rangepicker__selector-control-left"></div>
        <div class="rangepicker__selector-control-right"></div>
        <div class="rangepicker__calendar">
          <div class="rangepicker__month-indicator">
            <time datetime="${monthNameFrom}">${monthNameFrom}</time>
          </div>
          <div class="rangepicker__day-of-week">
            ${this.getDayNames()}
          </div>
          <div class="rangepicker__date-grid">
          ${this.getMonthCells(this.from)}
          </div>
        </div>
        <div class="rangepicker__calendar">
          <div class="rangepicker__month-indicator">
            <time datetime="${monthNameNext}">${monthNameNext}</time>
          </div>
          <div class="rangepicker__day-of-week">
            ${this.getDayNames()}
          </div>
          <div class="rangepicker__date-grid">
            ${this.getMonthCells(this.to)}
          </div>
        </div>`;
    }
  
    inputTemplate() {
      return `
      <span data-element="from">${this.selectedDates.from.toLocaleDateString(this.locale)}</span> -
      <span data-element="to">${this.selectedDates.to.toLocaleDateString(this.locale)}</span>`;
    }
  
    template() {
      return `
        <div class="rangepicker">
          <div class="rangepicker__input" data-element="input">${this.inputTemplate()}</div>
          <div class="rangepicker__selector" data-element="selector">${this.selectorTemplate()}</div>
        </div>`;
    }
  
    remove() {
      this.element?.remove();
      this.subElements = {};
    }
  
    destroy() {
      this.remove();
    }
}
  

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Header": () => (/* reexport safe */ _Header__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const header = [
  {
    id: 'images',
    title: 'Image',
    sortable: false,
    template: data => {
      return `
            <div class="sortable-table__cell">
              <img class="sortable-table-image" alt="Image" src="${data[0].url}">
            </div>
          `;
    }
  },
  {
    id: 'title',
    title: 'Name',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'quantity',
    title: 'Quantity',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'price',
    title: 'Price',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'status',
    title: 'Status',
    sortable: true,
    sortType: 'number',
    template: data => {
      return `<div class="sortable-table__cell">
            ${data > 0 ? 'Active' : 'Inactive'}
          </div>`;
    }
  },
];
  
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (header);
  

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(14);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(15);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(16);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_all_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(17);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_all_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_all_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_all_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_all_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),
/* 11 */
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 12 */
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),
/* 13 */
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),
/* 14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),
/* 15 */
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),
/* 16 */
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),
/* 17 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_common_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(20);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_SortableTable_style_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(32);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_RangePicker_style_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(33);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_ColumnChart_style_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(36);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_pages_MainPage_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(38);
// Imports







var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_common_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_SortableTable_style_css__WEBPACK_IMPORTED_MODULE_3__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_RangePicker_style_css__WEBPACK_IMPORTED_MODULE_4__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_ColumnChart_style_css__WEBPACK_IMPORTED_MODULE_5__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_pages_MainPage_style_css__WEBPACK_IMPORTED_MODULE_6__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* Styles for components  */\r\n/* components */", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 18 */
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),
/* 19 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 20 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_assets_fonts_css_fontello_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(21);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_variables_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(28);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_form_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(29);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(22);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_5__);
// Imports






var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(30), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(31), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap);"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_assets_fonts_css_fontello_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_variables_css__WEBPACK_IMPORTED_MODULE_3__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_form_css__WEBPACK_IMPORTED_MODULE_4__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_5___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_5___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body {\r\n  font-family: \"Source Sans Pro\", sans-serif;\r\n}\r\n\r\n* {\r\n  box-sizing: border-box;\r\n}\r\n\r\nbody {\r\n  margin: 0;\r\n}\r\n\r\n.button-primary,\r\n.button-primary-outline {\r\n  outline: none;\r\n  font-weight: 600;\r\n  font-size: 16px;\r\n  line-height: 24px;\r\n  padding: 6px 34px;\r\n  border: 1px solid var(--blue);\r\n  border-radius: 4px;\r\n  cursor: pointer;\r\n  transition: 0.2s all;\r\n  text-decoration: none;\r\n}\r\n\r\n.button-primary {\r\n  color: var(--white);\r\n  background-color: var(--blue);\r\n  box-shadow: 0 4px 10px rgba(16, 156, 241, 0.24);\r\n}\r\n\r\n.button-primary:hover,\r\n.button-primary:focus,\r\n.button-primary:active,\r\n.button-primary.active {\r\n  opacity: 0.8;\r\n}\r\n\r\n.button-primary-outline {\r\n  color: var(--blue);\r\n  background-color: var(--white);\r\n}\r\n\r\nbutton.is-loading::before {\r\n  content: \"\";\r\n  display: grid;\r\n  width: 24px;\r\n  height: 24px;\r\n  animation: spin 1000ms linear infinite;\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  margin-top: -12px;\r\n  margin-left: -12px;\r\n  z-index: 1;\r\n}\r\n\r\n.button-primary.is-loading::before {\r\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") center\r\n    no-repeat;\r\n  background-size: cover;\r\n}\r\n\r\n.button-primary-outline.is-loading::before {\r\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") center\r\n    no-repeat;\r\n  background-size: cover;\r\n}\r\n\r\nbutton.is-loading {\r\n  pointer-events: none;\r\n  cursor: default;\r\n  opacity: 0.5;\r\n  overflow: hidden;\r\n  text-indent: -9999px;\r\n  position: relative;\r\n}\r\n\r\nbutton.is-loading > span {\r\n  display: none;\r\n}\r\n\r\n/* skeleton */\r\n\r\n.loading-line {\r\n  animation-duration: 1.5s;\r\n  animation-fill-mode: forwards;\r\n  animation-iteration-count: infinite;\r\n  animation-name: backgroundMovement;\r\n  animation-timing-function: linear;\r\n  background: var(--grey-skeleton);\r\n  background: linear-gradient(\r\n    267.58deg,\r\n    var(--grey-skeleton) 0%,\r\n    var(--grey-light) 80%,\r\n    var(--grey-skeleton) 100%\r\n  );\r\n  background-size: 200%;\r\n  border-radius: 2px;\r\n  display: block;\r\n  height: var(--loading-line-height);\r\n}\r\n\r\n@keyframes backgroundMovement {\r\n  0% {\r\n    background-position: 100%;\r\n  }\r\n  100% {\r\n    background-position: -100%;\r\n  }\r\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 21 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(23), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(24), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(25), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(26), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(27), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___, { hash: "#iefix" });
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___, { hash: "#fontello" });
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@font-face {\r\n  font-family: 'fontello';\r\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\r\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format('embedded-opentype'),\r\n       url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ") format('woff2'),\r\n       url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ") format('woff'),\r\n       url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ") format('truetype'),\r\n       url(" + ___CSS_LOADER_URL_REPLACEMENT_5___ + ") format('svg');\r\n  font-weight: normal;\r\n  font-style: normal;\r\n}\r\n/* Chrome hack: SVG is rendered more smooth in Windozze. 100% magic, uncomment if you need it. */\r\n/* Note, that will break hinting! In other OS-es font will be not as sharp as it could be */\r\n/*\r\n@media screen and (-webkit-min-device-pixel-ratio:0) {\r\n  @font-face {\r\n    font-family: 'fontello';\r\n    src: url('../font/fontello.svg?11275683#fontello') format('svg');\r\n  }\r\n}\r\n*/\r\n \r\n [class^=\"icon-\"]:before, [class*=\" icon-\"]:before {\r\n  font-family: \"fontello\";\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  speak: none;\r\n \r\n  display: inline-block;\r\n  text-decoration: inherit;\r\n  width: 1em;\r\n  margin-right: .2em;\r\n  text-align: center;\r\n  /* opacity: .8; */\r\n \r\n  /* For safety - reset parent styles, that can break glyph codes*/\r\n  font-variant: normal;\r\n  text-transform: none;\r\n \r\n  /* fix buttons height, for twitter bootstrap */\r\n  line-height: 1em;\r\n \r\n  /* Animation center compensation - margins should be symmetric */\r\n  /* remove if not needed */\r\n  margin-left: .2em;\r\n \r\n  /* you can be more comfortable with increased icons size */\r\n  /* font-size: 120%; */\r\n \r\n  /* Font smoothing. That was taken from TWBS */\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n \r\n  /* Uncomment for 3D effect */\r\n  /* text-shadow: 1px 1px 1px rgba(127, 127, 127, 0.3); */\r\n}\r\n \r\n.icon-sales:before { content: '\\e800'; } /* '' */\r\n.icon-categories:before { content: '\\e801'; } /* '' */\r\n.icon-dashboard:before { content: '\\e802'; } /* '' */\r\n.icon-products:before { content: '\\e803'; } /* '' */\r\n.icon-reset-demo:before { content: '\\e804'; } /* '' */\r\n.icon-toggle-sidebar:before { content: '\\e805'; } /* '' */", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 22 */
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "9dd28f7b2c5fbe5b4676.eot?11275683";

/***/ }),
/* 24 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "0561e12bef9fb768d9f8.woff2?11275683";

/***/ }),
/* 25 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "614af0d23e8a730d3cab.woff?11275683";

/***/ }),
/* 26 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "1bc2c3227b3b95262d0b.ttf?11275683";

/***/ }),
/* 27 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "89d8da11d4a328096bbf.svg?11275683";

/***/ }),
/* 28 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root {\r\n  --blue: #109cf1;\r\n  --dark-blue: #334d6e;\r\n  --light-blue: #cfebfc;\r\n  --middle-blue: #9fd7f9;\r\n  --yellow: #ffb946;\r\n  --red: #f7685b;\r\n  --green: #2ed47a;\r\n  --purple: #885af8;\r\n  --black: #192a3e;\r\n  --table-black: #323c47;\r\n  --table-grey: #707683;\r\n  --grey: #90a0b7;\r\n  --grey-light: #c2cfe0;\r\n  --grey-extra-light: #eff1f4;\r\n  --grey-skeleton: #f5f6f8;\r\n  --grey-middle: #e0e4eb;\r\n  --white: #ffffff;\r\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 29 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "form.form-grid {\r\n  display: grid;\r\n  grid-template-columns: 1fr 1fr 1fr;\r\n  grid-gap: 16px;\r\n}\r\n\r\nform.form-grid .form-group {\r\n  display: grid;\r\n  position: relative;\r\n}\r\n\r\nform .form-group.has-error .form-control {\r\n  border-color: var(--red);\r\n}\r\n\r\nform .form-error-text {\r\n  margin-top: 8px;\r\n  display: none;\r\n}\r\n\r\nform .form-group.has-error .form-error-text {\r\n  display: inline-block;\r\n  color: var(--red);\r\n}\r\n\r\nform.form-grid fieldset {\r\n  display: grid;\r\n  grid-gap: 16px;\r\n  border: none;\r\n  padding: 0;\r\n}\r\n\r\nform.form-grid .form-group__wide {\r\n  grid-column: 1 / 4;\r\n}\r\n\r\nform.form-grid .form-group__half_left {\r\n  grid-column: 1 / 3;\r\n}\r\n\r\nform.form-grid .form-group__half_right {\r\n  grid-column: 2 / 4;\r\n}\r\n\r\nform.form-grid .form-group__part-half {\r\n  grid-column: 1 / 2;\r\n}\r\n\r\nform.form-grid .form-group__two-col {\r\n  grid-template-columns: 1fr 1fr;\r\n  grid-gap: 16px;\r\n}\r\n\r\n.form-group_nested {\r\n  display: grid;\r\n  grid-template-columns: auto 1fr;\r\n  grid-gap: 16px;\r\n}\r\n\r\nform .form-label {\r\n  font-weight: normal;\r\n  font-size: 16px;\r\n  line-height: 20px;\r\n  color: var(--table-grey);\r\n  margin-bottom: 8px;\r\n}\r\n\r\nform .form-control {\r\n  background-color: var(--white);\r\n  border: 1px solid var(--grey-light);\r\n  border-radius: 4px;\r\n  padding: 8px 12px;\r\n  font-weight: 400;\r\n  font-size: 16px;\r\n  line-height: 20px;\r\n  color: var(--dark-blue);\r\n  outline: none;\r\n}\r\n\r\nform.form-grid .form-control {\r\n  width: 100%;\r\n}\r\n\r\nform textarea {\r\n  resize: none;\r\n  min-height: 186px;\r\n}\r\n\r\nform select.form-control {\r\n  height: 38px;\r\n}\r\n\r\nform .form-buttons {\r\n  display: grid;\r\n  grid-column: 1 / 3;\r\n  grid-template-columns: 1fr 1fr;\r\n  grid-gap: 16px;\r\n  margin-top: 24px;\r\n}\r\n\r\nform.form-inline {\r\n  display: grid;\r\n  grid: auto-flow / repeat(auto-fit, minmax(50px, 1fr));\r\n  grid-gap: 16px;\r\n}\r\n\r\nform.form-inline .form-group {\r\n  margin-bottom: 0;\r\n}\r\n\r\n@keyframes spin {\r\n  from {\r\n    transform: rotate(0deg);\r\n  }\r\n  to {\r\n    transform: rotate(360deg);\r\n  }\r\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 30 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "a47f2da9a78bf43fbdb3.svg";

/***/ }),
/* 31 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "c8172f43e179b8a2adb9.svg";

/***/ }),
/* 32 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* Common styles */\r\n\r\n/* SortableTable styles */\r\n.sortable-table {\r\n  background-color: var(--white);\r\n  max-width: 100%;\r\n  border-radius: 4px;\r\n  margin-bottom: 40px;\r\n  overflow: hidden;\r\n}\r\n\r\n.sortable-table__row {\r\n  display: grid;\r\n  grid: auto-flow / 80px calc(50% - 80px) 20% 15% 15%;\r\n  text-decoration: none;\r\n}\r\n.sortable-table__row.bold {\r\n  font-weight: bold;\r\n}\r\n\r\n.sortable-table__cell {\r\n  padding: 16px;\r\n  font-size: 16px;\r\n  line-height: 20px;\r\n  color: var(--table-black);\r\n  display: flex;\r\n  align-items: center;\r\n  border-top: 1px solid var(--grey-light);\r\n}\r\n\r\n.sortable-table__cell:first-child {\r\n  padding-left: 32px;\r\n}\r\n\r\n.sortable-table__cell:last-child {\r\n  padding-right: 32px;\r\n}\r\n\r\n.sortable-table__header .sortable-table__cell {\r\n  color: var(--grey-light);\r\n  border-top: none;\r\n}\r\n\r\n.sortable-table__header .sortable-table__cell[data-sortable] {\r\n  cursor: pointer;\r\n}\r\n\r\n.sortable-table__cell-img {\r\n  height: 40px;\r\n  max-width: 100%;\r\n  padding: 4px;\r\n  border: 1px solid var(--grey-light);\r\n  border-radius: 2px;\r\n}\r\n\r\n.sortable-table__sort-arrow {\r\n  padding: 8px;\r\n  display: inline-flex;\r\n  cursor: pointer;\r\n}\r\n\r\n.sortable-table__cell[data-order='asc'] .sort-arrow {\r\n  width: 0;\r\n  height: 0;\r\n  border-left: 4px solid transparent;\r\n  border-right: 4px solid transparent;\r\n  border-bottom: 4px solid var(--grey-light);\r\n}\r\n\r\n.sortable-table__cell[data-order='desc'] .sort-arrow {\r\n  width: 0;\r\n  height: 0;\r\n  border-left: 4px solid transparent;\r\n  border-right: 4px solid transparent;\r\n  border-top: 4px solid var(--grey-light);\r\n}\r\n\r\n.sortable-table.sortable-table_loading {\r\n  grid-template-columns: auto;\r\n}\r\n\r\n.sortable-table__body .sortable-table__row:hover {\r\n  background-color: var(--grey-skeleton);\r\n}\r\n\r\n\r\n.sortable-table_empty {\r\n  display: flex;\r\n  flex-direction: column;\r\n  height: 100%;\r\n}\r\n\r\n.sortable-table__empty-placeholder p {\r\n  margin: 0 0 12px;\r\n}\r\n\r\n.sortable-table__empty-placeholder,\r\n.sortable-table_empty .sortable-table__header,\r\n.sortable-table_empty .sortable-table__body {\r\n  display: none;\r\n}\r\n\r\n.sortable-table_empty .sortable-table__empty-placeholder {\r\n  background: var(--grey-extra-light);\r\n  border: 1px solid var(--grey-light);\r\n  border-radius: 4px;\r\n  flex: 1 0 auto;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n  color: var(--grey);\r\n}\r\n\r\n.sortable-table-image {\r\n  height: 40px;\r\n  max-width: 100%;\r\n  padding: 4px;\r\n  border: 1px solid var(--grey-light);\r\n  border-radius: 2px;\r\n}\r\n\r\n.sortable-table-tooltip__category {\r\n  color: var(--grey);\r\n}\r\n\r\n.sortable-field-tooltip__subcategory {\r\n  color: var(--dark-blue);\r\n}\r\n\r\n.sortable-table.sortable-table_loading .sortable-table__loading-line {\r\n  display: grid;\r\n}\r\n\r\n/* Loading line */\r\n\r\n.sortable-table__loading-line {\r\n  grid-column: 1 / 7;\r\n  display: none;\r\n  margin: 16px;\r\n  --loading-line-height: 20px;\r\n}\r\n\r\n.loading-line {\r\n  animation-duration: 1.5s;\r\n  animation-fill-mode: forwards;\r\n  animation-iteration-count: infinite;\r\n  animation-name: backgroundMovement;\r\n  animation-timing-function: linear;\r\n  background: var(--grey-skeleton);\r\n  background: linear-gradient(\r\n    267.58deg,\r\n    var(--grey-middle) 0%,\r\n    var(--grey-skeleton) 80%,\r\n    var(--grey-middle) 100%\r\n  );\r\n  background-size: 200%;\r\n  border-radius: 2px;\r\n  height: var(--loading-line-height);\r\n}\r\n\r\n@keyframes backgroundMovement {\r\n  0% {\r\n    background-position: 100%;\r\n  }\r\n  100% {\r\n    background-position: -100%;\r\n  }\r\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 33 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(34), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(35), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap);"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* Common styles */\r\n\r\n/* RangePicker styles */\r\n.rangepicker {\r\n  position: relative;\r\n}\r\n\r\n.rangepicker__input {\r\n  display: inline-flex;\r\n  padding: 12px 16px 12px 40px;\r\n  cursor: pointer;\r\n  font-weight: normal;\r\n  font-size: 16px;\r\n  line-height: 20px;\r\n  background-color: var(--white);\r\n  border: 1px solid var(--grey-light);\r\n  border-radius: 4px;\r\n  outline: none;\r\n  background: var(--white) url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") 16px center no-repeat;\r\n  background-size: 18px 18px;\r\n}\r\n\r\n.rangepicker_open .rangepicker__input,\r\n.rangepicker__input:focus,\r\n.rangepicker__input:active {\r\n  border-color: var(--blue);\r\n}\r\n\r\n.rangepicker__input > span {\r\n  display: inline-flex;\r\n  margin: 0 4px;\r\n}\r\n\r\n.rangepicker__input > span:last-child {\r\n  margin-right: 0;\r\n}\r\n\r\n.rangepicker__selector {\r\n  display: none;\r\n  background-color: var(--white);\r\n  padding: 32px 26px;\r\n  border-radius: 6px;\r\n  box-shadow: 0 4px 29px rgba(0, 0, 0, 0.09);\r\n  flex-direction: row;\r\n  justify-content: space-between;\r\n  flex: 1 0 auto;\r\n  position: absolute;\r\n  top: calc(100% + 16px);\r\n  right: 0;\r\n  z-index: 1;\r\n}\r\n\r\n.rangepicker__selector-arrow {\r\n  width: 30px;\r\n  height: 15px;\r\n  position: absolute;\r\n  bottom: 100%;\r\n  right: 60px;\r\n  overflow: hidden;\r\n}\r\n\r\n.rangepicker__selector-arrow:after {\r\n  content: \"\";\r\n  position: absolute;\r\n  width: 12px;\r\n  height: 12px;\r\n  background: var(--white);\r\n  transform: translateX(-50%) translateY(-50%) rotate(45deg);\r\n  top: 100%;\r\n  left: 50%;\r\n  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.09);\r\n}\r\n\r\n.rangepicker_open .rangepicker__selector {\r\n  display: inline-flex;\r\n}\r\n\r\n.rangepicker__cell {\r\n  cursor: pointer;\r\n}\r\n\r\n.rangepicker__calendar {\r\n  width: 252px;\r\n}\r\n\r\n.rangepicker__calendar:last-child {\r\n  margin-left: 26px;\r\n}\r\n\r\n.rangepicker__month-indicator {\r\n  text-align: center;\r\n  font-weight: 600;\r\n  font-size: 20px;\r\n  line-height: 24px;\r\n  padding: 0 15px;\r\n  color: var(--dark-blue);\r\n}\r\n\r\n.rangepicker__selector-control-left,\r\n.rangepicker__selector-control-right {\r\n  position: absolute;\r\n  top: 32px;\r\n  width: 15px;\r\n  height: 24px;\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n  cursor: pointer;\r\n  transition: 0.3s all;\r\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") left center no-repeat;\r\n  background-size: 9px 13px;\r\n}\r\n\r\n.rangepicker__selector-control-left:hover,\r\n.rangepicker__selector-control-right:hover {\r\n  opacity: 0.8;\r\n}\r\n\r\n.rangepicker__selector-control-left {\r\n  left: 26px;\r\n}\r\n\r\n.rangepicker__selector-control-right {\r\n  right: 26px;\r\n  transform: rotate(180deg);\r\n}\r\n\r\n.rangepicker__day-of-week,\r\n.rangepicker__date-grid {\r\n  display: grid;\r\n  grid-template-columns: repeat(7, 1fr);\r\n}\r\n\r\n.rangepicker__day-of-week {\r\n  margin-top: 28px;\r\n}\r\n\r\n.rangepicker__day-of-week > * {\r\n  font-weight: 400;\r\n  font-size: 14px;\r\n  line-height: 20px;\r\n  color: var(--grey);\r\n  text-align: center;\r\n}\r\n\r\n/* Dates */\r\n.rangepicker__date-grid {\r\n  margin-top: 16px;\r\n}\r\n\r\n.rangepicker__cell {\r\n  position: relative;\r\n  border: 0;\r\n  width: 36px;\r\n  height: 36px;\r\n  background-color: transparent;\r\n  color: var(--dark-blue);\r\n  font-weight: 400;\r\n  font-size: 16px;\r\n  line-height: 20px;\r\n}\r\n\r\n.rangepicker__cell:first-child {\r\n  grid-column-start: var(--start-from);\r\n}\r\n\r\n.rangepicker__cell:active,\r\n.rangepicker__cell.rangepicker__selected,\r\n.rangepicker__cell.rangepicker__selected-from,\r\n.rangepicker__cell.rangepicker__selected-to {\r\n  background-color: var(--blue);\r\n  color: var(--white);\r\n}\r\n\r\n.rangepicker__cell:hover,\r\n.rangepicker__cell:focus {\r\n  outline: none;\r\n  background-color: var(--light-blue);\r\n  color: var(--dark-blue);\r\n  transition: 0.2s all;\r\n}\r\n\r\n.rangepicker__cell.rangepicker__selected:hover,\r\n.rangepicker__cell.rangepicker__selected-from:hover,\r\n.rangepicker__cell.rangepicker__selected-to:hover,\r\n.rangepicker__cell.rangepicker__selected:focus,\r\n.rangepicker__cell.rangepicker__selected-from:focus,\r\n.rangepicker__cell.rangepicker__selected-to:focus {\r\n  background-color: var(--middle-blue);\r\n  color: var(--dark-blue);\r\n}\r\n\r\n.rangepicker__cell.rangepicker__selected-between {\r\n  background-color: var(--light-blue);\r\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 34 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "335d4ee8b0ca3ca1e5d4.svg";

/***/ }),
/* 35 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "f2fc29de05738f63883d.svg";

/***/ }),
/* 36 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(37), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap);"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* Component styles */\r\n\r\nbody {\r\n  font-family: 'Source Sans Pro', sans-serif;\r\n}\r\n\r\n:root {\r\n  --blue: #109cf1;\r\n  --dark-blue: #334d6e;\r\n  --light-blue: #cfebfc;\r\n  --middle-blue: #9fd7f9;\r\n  --yellow: #ffb946;\r\n  --red: #f7685b;\r\n  --green: #2ed47a;\r\n  --purple: #885af8;\r\n  --black: #192a3e;\r\n  --table-black: #323c47;\r\n  --table-grey: #707683;\r\n  --grey: #90a0b7;\r\n  --grey-light: #c2cfe0;\r\n  --grey-extra-light: #eff1f4;\r\n  --grey-skeleton: #f5f6f8;\r\n  --grey-middle: #e0e4eb;\r\n  --white: #ffffff;\r\n}\r\n\r\n.dashboard__charts {\r\n  display: grid;\r\n  grid-template-columns: 1fr 1fr 1fr;\r\n  grid-gap: 24px;\r\n  --chart-height: 50;\r\n}\r\n\r\n.dashboard__chart_orders {\r\n  --chart-column-color: var(--yellow);\r\n}\r\n\r\n.dashboard__chart_sales {\r\n  --chart-column-color: var(--green);\r\n}\r\n\r\n.dashboard__chart_customers {\r\n  --chart-column-color: var(--purple);\r\n}\r\n\r\n/* ColumnChart styles */\r\n.column-chart__chart {\r\n  width: 100%;\r\n  height: calc(var(--chart-height) * 1px);\r\n  display: flex;\r\n  flex-direction: row;\r\n  justify-content: space-between;\r\n  align-items: flex-end;\r\n}\r\n\r\n.column-chart__chart div {\r\n  height: calc(var(--value) * 1px);\r\n  background-color: var(--chart-column-color);\r\n  min-width: 1px;\r\n  flex-grow: 1;\r\n  margin: 0 0 0 1px;\r\n  cursor: pointer;\r\n}\r\n\r\n.column-chart__chart div:first-child {\r\n  margin: 0;\r\n}\r\n\r\n.column-chart__chart div.is-hovered {\r\n  opacity: 1;\r\n}\r\n\r\n.column-chart__chart.has-hovered div:not(.is-hovered) {\r\n  opacity: 0.5;\r\n}\r\n\r\n.column-chart__container {\r\n  max-width: 100%;\r\n  position: relative;\r\n}\r\n\r\n.column-chart {\r\n  padding: 16px 26px 24px;\r\n  background: var(--white);\r\n  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);\r\n  border-radius: 4px;\r\n  border-left: 2px solid var(--chart-column-color);\r\n  position: relative;\r\n}\r\n\r\n.column-chart__title {\r\n  font-size: 16px;\r\n  line-height: 20px;\r\n  color: var(--grey);\r\n  display: flex;\r\n  flex-direction: row;\r\n  justify-content: space-between;\r\n  margin-bottom: 8px;\r\n}\r\n\r\n.column-chart__link {\r\n  color: var(--blue);\r\n  text-decoration: none;\r\n}\r\n\r\n.column-chart__header {\r\n  font-weight: 600;\r\n  font-size: 28px;\r\n  line-height: 35px;\r\n  color: var(--dark-blue);\r\n  margin-bottom: 28px;\r\n  position: relative;\r\n}\r\n\r\n.column-chart_loading .column-chart__header,\r\n.column-chart_loading .column-chart__chart {\r\n  display: none;\r\n}\r\n\r\n.column-chart_loading .column-chart__container {\r\n  height: 113px;\r\n}\r\n\r\n.column-chart_loading .column-chart__container:before {\r\n  content: \"\";\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 113px;\r\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") center no-repeat;\r\n  background-size: cover;\r\n  display: block;\r\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 37 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "926116e659a442e09402.svg";

/***/ }),
/* 38 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".main {\r\n    display: grid;\r\n    grid-template-columns: 256px 1fr;\r\n    grid-template-rows: minmax(100vh, auto);\r\n    grid-template-areas: \"sidebar content\";\r\n  }\r\n  \r\n  .content {\r\n    grid-area: content;\r\n    background: var(--grey-skeleton);\r\n    padding: 24px 36px;\r\n  }\r\n  \r\n  .sidebar {\r\n    grid-area: sidebar;\r\n    display: grid;\r\n    grid-template-rows: auto 1fr auto;\r\n    grid-template-columns: 100%;\r\n    background: var(--white);\r\n    box-shadow: 6px 0 18px rgba(0, 0, 0, 0.06);\r\n    padding: 24px 26px;\r\n    height: 100vh;\r\n    position: sticky;\r\n    top: 0;\r\n  }\r\n  \r\n  .is-collapsed-sidebar .sidebar ul {\r\n    margin-left: -3px;\r\n  }\r\n  \r\n  .is-collapsed-sidebar .sidebar ul a span,\r\n  .is-collapsed-sidebar .sidebar ul button span {\r\n    display: none;\r\n  }\r\n  \r\n  .is-collapsed-sidebar .sidebar__title {\r\n    font-size: 12px;\r\n    line-height: 1.2;\r\n    margin-left: -16px;\r\n    text-align: center;\r\n    width: 48px;\r\n  }\r\n  \r\n  .is-collapsed-sidebar .main {\r\n    grid-template-columns: 70px 1fr;\r\n  }\r\n  \r\n  .is-collapsed-sidebar .sidebar__nav_bottom li {\r\n    height: 24px;\r\n  }\r\n  \r\n  .sidebar__title {\r\n    font-size: 24px;\r\n    line-height: 36px;\r\n    height: 36px;\r\n    color: var(--dark-blue);\r\n    margin-top: 0;\r\n    margin-bottom: 32px;\r\n    text-transform: uppercase;\r\n    display: flex;\r\n    align-items: center;\r\n  }\r\n  \r\n  .sidebar__title a {\r\n    text-decoration: none;\r\n    color: inherit;\r\n  }\r\n  \r\n  .sidebar__title a:hover {\r\n    text-decoration: underline;\r\n  }\r\n  \r\n  .sidebar__nav {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\r\n  }\r\n  \r\n  .sidebar__nav li {\r\n    margin-bottom: 16px;\r\n  }\r\n  \r\n  .sidebar__nav li:last-child {\r\n    margin-bottom: 0;\r\n  }\r\n  \r\n  .sidebar__nav li a,\r\n  .sidebar__nav li button {\r\n    font-size: 16px;\r\n    line-height: 24px;\r\n    color: var(--dark-blue);\r\n    text-decoration: none;\r\n    padding-left: 32px;\r\n    position: relative;\r\n  }\r\n  \r\n  .sidebar__nav li a i,\r\n  .sidebar__nav li button i {\r\n    color: var(--grey-light);\r\n    position: absolute;\r\n    left: 0;\r\n    top: 50%;\r\n    transform: translate(0, -50%);\r\n  }\r\n  \r\n  .sidebar__nav li a:hover,\r\n  .sidebar__nav li a:focus,\r\n  .sidebar__nav li a:active,\r\n  .sidebar__nav li.active a,\r\n  .sidebar__nav li a:hover i,\r\n  .sidebar__nav li a:focus i,\r\n  .sidebar__nav li a:active i,\r\n  .sidebar__nav li.active a i,\r\n  .sidebar__nav li button:hover,\r\n  .sidebar__nav li.active button,\r\n  .sidebar__nav li button:hover i,\r\n  .sidebar__nav li.active button i {\r\n    color: var(--blue);\r\n  }\r\n  \r\n  .sidebar__toggler {\r\n    -webkit-appearance: none;\r\n    -moz-appearance: none;\r\n    border: none;\r\n    outline: none;\r\n    background: none;\r\n    cursor: pointer;\r\n    height: 24px;\r\n  }\r\n  \r\n  .content__top-panel {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-bottom: 24px;\r\n  }\r\n  \r\n  .content__top-panel .form-inline {\r\n    width: 50%;\r\n  }\r\n  \r\n  .page-title {\r\n    font-weight: 600;\r\n    font-size: 28px;\r\n    line-height: 36px;\r\n    color: var(--grey);\r\n    margin: 0;\r\n  }\r\n  \r\n  .page-title .link {\r\n    text-decoration: none;\r\n    color: var(--blue);\r\n  }\r\n  \r\n  .page-title .link.disabled {\r\n    color: inherit;\r\n    pointer-events: none;\r\n  }\r\n  \r\n  .block-title {\r\n    font-weight: 600;\r\n    font-size: 24px;\r\n    line-height: 30px;\r\n    color: var(--grey);\r\n    margin: 40px 0 24px;\r\n  }\r\n  \r\n  .content-box {\r\n    padding: 34px 32px 48px;\r\n    background-color: var(--white);\r\n    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);\r\n    margin-bottom: 24px;\r\n  }\r\n  \r\n  .content-box.content-box_small {\r\n    padding: 16px 32px;\r\n  }\r\n  \r\n  .progress-bar {\r\n    background-color: var(--grey);\r\n    box-shadow: none;\r\n    position: fixed;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 10px;\r\n    /* TODO: uncomment after implementation */\r\n    /*display: none;*/\r\n    z-index: 1;\r\n  }\r\n  \r\n  .progress-bar__line {\r\n    height: 100%;\r\n    box-shadow: none;\r\n    animation: progress-bar-stripes 2s linear infinite;\r\n    background: var(--blue)\r\n    linear-gradient(\r\n      45deg,\r\n      rgba(255, 255, 255, 0.15) 25%,\r\n      transparent 25%,\r\n      transparent 50%,\r\n      rgba(255, 255, 255, 0.15) 50%,\r\n      rgba(255, 255, 255, 0.15) 75%,\r\n      transparent 75%,\r\n      transparent\r\n    );\r\n    background-size: 40px 40px;\r\n  }\r\n  \r\n  @keyframes progress-bar-stripes {\r\n    from {\r\n      background-position: 40px 0;\r\n    }\r\n    to {\r\n      background-position: 0 0;\r\n    }\r\n  }\r\n  \r\n  .main.is-loading .progress-bar {\r\n    display: block;\r\n  }\r\n  \r\n  .dashboard__charts {\r\n    display: grid;\r\n    grid-template-columns: 1fr 1fr 1fr;\r\n    grid-gap: 24px;\r\n    --chart-height: 50;\r\n  }\r\n  \r\n  .dashboard__chart_orders {\r\n    --chart-column-color: var(--yellow);\r\n  }\r\n  \r\n  .dashboard__chart_sales {\r\n    --chart-column-color: var(--green);\r\n  }\r\n  \r\n  .dashboard__chart_customers {\r\n    --chart-column-color: var(--purple);\r\n  }\r\n  \r\n  .dashboard .sortable-table {\r\n    --cols: 6;\r\n  }\r\n  ", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			0: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _styles_all_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);



const contentNode = document.querySelector('#content');

async function initialize () {
  const page = new _pages__WEBPACK_IMPORTED_MODULE_0__.MainPage();
  const element = await page.render();

  contentNode.innerHTML = '';
  contentNode.append(element);
}

initialize();
})();

/******/ })()
;