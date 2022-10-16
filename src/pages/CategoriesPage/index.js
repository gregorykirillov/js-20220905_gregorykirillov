import {RangePicker, SortableTable, ColumnChart} from '../../components';

import fetchJson from '../../utils/fetch-json';
import { API_URL_DASHBOARD, BACKEND_URL, RANGE } from '../../utils/settings';

const header = [
  {
    id: 'images',
    title: 'Фото',
    sortable: false,
    template: data => {
      return `
        <div class='sortable-table__cell'>
          <img class='sortable-table-image' alt='Image' src='${data[0].url}'>
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
    id: 'quantity',
    title: 'Количество',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'price',
    title: 'Цена',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'status',
    title: 'Статус',
    sortable: true,
    sortType: 'number',
    template: data => {
      return `
        <div class='sortable-table__cell'>
          ${data > 0 ? 'Active' : 'Inactive'}
        </div>
      `;
    }
  },
];

export default class Page {
  template() {
    return `
      <div class='dashboard'>
        <div class='content__top-panel'>
          <h2 class='page-title'>Categories</h2>
        <div data-element='rangePicker'></div>
        </div>
        <div data-element='chartsRoot' class='dashboard__charts'>
          <div data-element='ordersChart' class='dashboard__chart_orders'></div>
          <div data-element='salesChart' class='dashboard__chart_sales'></div>
          <div data-element='customersChart' class='dashboard__chart_customers'></div>
        </div>

        <h3 class='block-title'>Лидеры продаж</h3>
        <div data-element='sortableTable'></div>
      </div>`;
  }

  appendRangePicker() {
    this.rangePicker = new RangePicker(RANGE).element;

    this.subElements.rangePicker.append(this.rangePicker);
  }

  appendColumnCharts() {
    const {from, to} = RANGE;
    const {ordersChart, salesChart, customersChart} = this.subElements;

    this.ordersChart = new ColumnChart({ url: `${API_URL_DASHBOARD}/orders`, range: { from, to }, label: 'orders', link: '#' });
    this.salesChart = new ColumnChart({ url: `${API_URL_DASHBOARD}/sales`, range: { from, to }, label: 'sales', formatHeading: data => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', useGrouping: ',', maximumFractionDigits: 0}).format(data)});
    this.customersChart = new ColumnChart({ url: `${API_URL_DASHBOARD}/customers`, range: { from, to }, label: 'customers' });

    ordersChart.append(this.ordersChart.element);
    salesChart.append(this.salesChart.element);
    customersChart.append(this.customersChart.element);
  }

  appendSortableTable() {
    this.sortableTable = new SortableTable(header, {
      url: `${API_URL_DASHBOARD}/bestsellers`,
      isSortLocally: false
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
    const {detail: {from, to}} = event;
    
    this.updateSortableTable(from, to);
    this.ordersChart.update(from, to);
    this.salesChart.update(from, to);
    this.customersChart.update(from, to);
  }

  fetchDataSortableTable(from, to) {
    const start = 0;
    const end = 30;
    
    const url = new URL(`${API_URL_DASHBOARD}/bestsellers`, BACKEND_URL);

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