import {RangePicker, SortableTable} from '../../components';

import fetchJson from '../../utils/fetch-json';
import { BACKEND_URL, RANGE } from '../../utils/settings';

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
      <div data-element="productsContainer" class="products-list__container">
    </div>
    `;
  }

  appendRangePicker() {
    this.rangePicker = new RangePicker(RANGE).element;

    this.subElements.rangePicker.append(this.rangePicker);
  }

  appendSortableTable() {
    this.sortableTable = new SortableTable(header, {
      url: `${this.API_URL}/orders`,
      isSortLocally: false,
      urlParams: [
        {name: 'createdAt_gte', value: RANGE.from},
        {name: 'createdAt_lte', value: RANGE.to}
      ]
    });
    
    const container = this.element.querySelector('[data-element="productsContainer"]');
    container.append(this.sortableTable.element);
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

  fetchDataSortableTable(from, to) {
    const start = 0;
    const end = 30;
    
    const url = new URL(`${this.API_URL}/orders`, BACKEND_URL);

    url.searchParams.set('createdAt_gte', from.toLocaleString());
    url.searchParams.set('createdAt_lte', to.toLocaleString());
    url.searchParams.set('_start', start);
    url.searchParams.set('_end', end);

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