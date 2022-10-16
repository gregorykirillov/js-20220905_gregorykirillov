import {RangePicker, SortableTable, ColumnChart} from '@/components';

import fetchJson from '@/utils/fetch-json';
import { API_URL_DASHBOARD, BACKEND_URL, DATE_SELECT_EVENT, RANGE } from '@/utils/settings';

const header = [
  {
    id: 'images',
    title: 'Фото',
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
    title: 'Название',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'subcategory',
    title: 'Категория',
    sortable: false,
    template: subcategory => {
      return `
      <div class="sortable-table__cell">
        <span data-tooltip="
          <div class='sortable-table-tooltip'>
            <span class='sortable-table-tooltip__category'>${subcategory.category.title}</span> /
            <b class='sortable-table-tooltip__subcategory'>${subcategory.title}</b>
          </div>">
          ${subcategory.title}
        </span>
      </div>
      `;}
  },
  {
    id: 'quantity',
    title: 'Количество',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'price',
    title: 'Цена',
    sortable: true,
    sortType: 'number',
    template: price => `<div class="sortable-table__cell">
      ${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(price)}
    </div>`
  },
  {
    id: 'sales',
    title: 'Продажи',
    sortable: true,
    sortType: 'number'
  },
];

export default class Page {
  template() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Панель управления</h2>
          <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>

        <h3 class="block-title">Лидеры продаж</h3>
        <div data-element="sortableTable"></div>
      </div>`;
  }

  appendRangePicker() {
    this.rangePicker = new RangePicker(RANGE).element;

    this.subElements.rangePicker.append(this.rangePicker);
  }

  appendColumnCharts() {
    const {from, to} = RANGE;
    const {ordersChart, salesChart, customersChart} = this.subElements;

    this.ordersChart = new ColumnChart({ url: `${API_URL_DASHBOARD}/orders`, range: { from, to }, label: 'Заказы', link: '#' });
    this.salesChart = new ColumnChart({ url: `${API_URL_DASHBOARD}/sales`, range: { from, to }, label: 'Продажи', formatHeading: price => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(price)});
    this.customersChart = new ColumnChart({ url: `${API_URL_DASHBOARD}/customers`, range: { from, to }, label: 'Клиенты' });

    ordersChart.append(this.ordersChart.element);
    salesChart.append(this.salesChart.element);
    customersChart.append(this.customersChart.element);
  }

  appendSortableTable() {
    const url = new URL(`${API_URL_DASHBOARD}/bestsellers`, BACKEND_URL);
    const {from, to} = RANGE;
    const start = 0;
    const end = 30;

    url.searchParams.set('from', from.toISOString());
    url.searchParams.set('to', to.toISOString());
    url.searchParams.set('_start', start);
    url.searchParams.set('_end', end);

    this.sortableTable = new SortableTable(header, {
      url,
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

    if (switchType === 'on') {this.progressBar.style.display = 'block';}
    else if (switchType === 'off') {this.progressBar.style.display = 'none';}
  }

  handleDateSelect = async (event) => {
    this.switchProgressBar('on');
    const {detail: {from, to}} = event;
    
    const promises = [
      this.updateSortableTable(from, to),
      this.ordersChart.update(from, to),
      this.salesChart.update(from, to),
      this.customersChart.update(from, to),
    ];

    await Promise.allSettled(promises);
    this.switchProgressBar('off');
  }

  fetchDataSortableTable(from, to) {
    const start = 0;
    const end = 30;
    
    const url = new URL(`${API_URL_DASHBOARD}/bestsellers`, BACKEND_URL);

    url.searchParams.set('_sort', header.find(el => el.sortable).id);
    url.searchParams.set('_order', 'asc');
    url.searchParams.set('from', from.toISOString());
    url.searchParams.set('to', to.toISOString());
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
    this.element.addEventListener(DATE_SELECT_EVENT, this.handleDateSelect);
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