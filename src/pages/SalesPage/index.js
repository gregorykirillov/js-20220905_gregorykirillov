import {RangePicker, SortableTable} from '@/components';

import fetchJson from '@/utils/fetch-json';
import { BACKEND_URL, DATE_SELECT_EVENT, RANGE } from '@/utils/settings';

const header = [
  {
    id: 'id',
    title: 'ID',
    sortable: true,
    sortType: 'number',
  },
  {
    id: 'user',
    title: 'Клиент',
    sortable: true,
    sortType: 'string',
  },
  {
    id: 'createdAt',
    title: 'Дата',
    sortable: true,
    preSorting: true,
    order: 'desc',
    sortType: 'string',
    template: date => `<div class="sortable-table__cell">
      ${(new Date(date).toLocaleString('ru', {day: 'numeric', month: 'short', year: 'numeric'}))}
    </div>`
  },
  {
    id: 'totalCost',
    title: 'Стоимость',
    sortable: true,
    sortType: 'number',
    template: price => `<div class="sortable-table__cell">
    ${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(price)}
  </div>`
  },
  {
    id: 'delivery',
    title: 'Статус',
    sortable: true,
    sortType: 'number',
  },
];

export default class Page {
  API_URL = 'api/rest';

  template() {
    return `
    <div class="products-list">
      <div class="content__top-panel">
        <h1 class="page-title">Продажи</h1>
        <div data-element="rangePicker"></div>
      </div>
    </div>
    `;
  }

  appendRangePicker() {
    this.rangePicker = new RangePicker(RANGE).element;

    this.subElements.rangePicker.append(this.rangePicker);
  }

  appendSortableTable() {
    const {from, to} = RANGE;

    const url = new URL(`${this.API_URL}/orders`, BACKEND_URL);

    this.setUrlParams({url, from, to});

    this.sortableTable = new SortableTable(header, {
      url,
      isSortLocally: false,
    });
    
    this.element.append(this.sortableTable.element);
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
      
    this.subElements = this.getSubElements(this.element);
      
    this.appendRangePicker();
    this.appendSortableTable();

    this.setEventListeners();
  
    return this.element;
  }

  handleDateSelect = async (event) => {
    const {detail: {from, to}} = event;
    
    this.updateSortableTable(from, to);
  }

  setUrlParams({url, from, to, id, order}) {
    const start = 0;
    const end = 30;

    const sortedElement = header.find(el => el.preSorting) || headerConfig.find(el => el.sortable);
    const sorted = {
      id: sortedElement.id,
      order: sortedElement.order || 'asc',
    };

    const fromTime = new Date(from.getTime() - (from.getTimezoneOffset() * 60000)).toISOString();
    const toTime = new Date(to.getTime() - (to.getTimezoneOffset() * 60000)).toISOString();

    url.searchParams.set('_sort', sorted.id);
    url.searchParams.set('_order', sorted.order);
    url.searchParams.set('createdAt_gte', fromTime);
    url.searchParams.set('createdAt_lte', toTime);
    url.searchParams.set('_start', start);
    url.searchParams.set('_end', end);
  }

  fetchDataSortableTable(from, to) {
    const url = new URL(`${this.API_URL}/orders`, BACKEND_URL);

    this.setUrlParams({url, from, to});

    return fetchJson(url);
  }

  async updateSortableTable(from, to) {
    this.sortableTable.element.firstElementChild.classList.add('sortable-table_loading');
    
    const data = await this.fetchDataSortableTable(from, to);   
    
    this.sortableTable.setData(data);
    this.sortableTable.updateData();
    this.sortableTable.element.firstElementChild.classList.remove('sortable-table_loading');
  }

  setEventListeners() {
    this.element.addEventListener(DATE_SELECT_EVENT, this.handleDateSelect);
  }

  remove() {
    this.element?.remove();
    this.rangePicker.remove();
    this.sortableTable.remove();
  }

  destroy() {
    this.remove();
  }
}