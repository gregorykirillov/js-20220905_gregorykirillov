import {RangePicker, SortableTable} from '@/components';

import fetchJson from '@/utils/fetch-json';
import { BACKEND_URL, DATE_SELECT_EVENT, RANGE } from '@/utils/settings';
import headerConfig from './headerConfig';

export default class Page {
  API_URL = 'api/rest';

  template() {
    return `
    <div class="products-list">
      <div class="content__top-panel">
        <h1 class="page-title">Продажи</h1>
        <div data-element="rangePicker"></div>
      </div>
      <div data-element="sortableTable"></div>
    </div>
    `;
  }

  appendRangePicker() {
    this.components.rangePicker = new RangePicker(RANGE);

    this.subElements.rangePicker.append(this.components.rangePicker.element);
  }

  appendSortableTable() {
    const {from, to} = RANGE;

    const url = new URL(`${this.API_URL}/orders`, BACKEND_URL);

    this.setUrlParams({url, from, to});

    this.components.sortableTable = new SortableTable(headerConfig, {
      url,
      isSortLocally: false,
    });
    
    this.subElements.sortableTable.append(this.components.sortableTable.element);
  }

  getSubElements() { 
    const res = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      res[subElement.dataset.element] = subElement;
    }
    return res;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.element = element.firstElementChild;
    this.components = {};

    this.subElements = this.getSubElements(this.element);
      
    this.appendRangePicker();
    this.appendSortableTable();

    this.setEventListeners();
  
    return this.element;
  }

  handleDateSelect = async (event) => {
    const {detail: {from, to}} = event;
    
    this.updateSortableTable(from, to);
    this.components.sortableTable.setSearchParams({
      ...this.components.sortableTable.searchParams,
      'createdAt_gte': new Date(from.getTime() - (from.getTimezoneOffset() * 60000)).toISOString(),
      'createdAt_lte': new Date(to.getTime() - (to.getTimezoneOffset() * 60000)).toISOString(),
    });
  }

  setUrlParams({url, from, to}) {
    const start = 0;
    const end = 30;

    const sortedElement = headerConfig.find(el => el.preSorting) || headerConfig.find(el => el.sortable);
    const sorted = {
      id: sortedElement.id,
      order: sortedElement.order || 'asc',
    };

    const fromTime = new Date(from.getTime() - (from.getTimezoneOffset() * 60000)).toISOString();
    const toTime = new Date(to.getTime() - (to.getTimezoneOffset() * 60000)).toISOString();

    const params = {
      '_sort': this.components.sortableTable?.searchParams?.['_sort'] || sorted.id,
      '_order': this.components.sortableTable?.searchParams?.['_order'] || sorted.order,
      'createdAt_gte': fromTime,
      'createdAt_lte': toTime,
      '_start': start,
      '_end': end
    };

    Object.entries(params).forEach(([name, value]) => url.searchParams.set(name, value));
  }

  fetchDataSortableTable(from, to) {
    const url = new URL(`${this.API_URL}/orders`, BACKEND_URL);

    this.setUrlParams({url, from, to});

    return fetchJson(url);
  }

  async updateSortableTable(from, to) {
    const {sortableTable} = this.subElements;
    sortableTable.firstElementChild.classList.add('sortable-table_loading');
    
    const data = await this.fetchDataSortableTable(from, to);
    
    this.components.sortableTable.setData(data);
    this.components.sortableTable.updateData();
    sortableTable.firstElementChild.classList.remove('sortable-table_loading');
  }

  setEventListeners() {
    this.element.addEventListener(DATE_SELECT_EVENT, this.handleDateSelect);
  }

  removeComponents() {
    Object.entries(this.components).forEach(([_, component]) => component.remove());
  }

  remove() {
    this.element.remove();
    this.removeComponents();
  }

  destroy() {
    this.remove();
  }
}